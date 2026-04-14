import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PaymentStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentConfirmedEvent } from '@/infrastructure/events/commerce.events';

@Injectable()
export class PaymentReconciliationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async reconcileCsv(fileBuffer: Buffer, actorUsername: string) {
    const text = fileBuffer.toString('utf8');
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      throw new BadRequestException('CSV file is empty');
    }
    const header = lines.shift();
    const headers = header.split(',').map((h) => h.trim().toLowerCase());
    const idxTxn = headers.indexOf('transactionid');
    const idxAmount = headers.indexOf('amount');
    const idxDesc = headers.indexOf('description');
    const idxPaidAt = headers.indexOf('paidat');
    if (idxAmount === -1 || idxDesc === -1) {
      throw new BadRequestException('CSV must contain at least amount and description columns');
    }

    const results: Array<{ transactionId?: string; matchedOrderCode?: string; matchedPaymentId?: string; status: 'matched' | 'skipped' | 'error'; reason?: string }> = [];

    for (const line of lines) {
      const cols = line.split(',');
      const transactionId = idxTxn !== -1 ? cols[idxTxn]?.trim() : undefined;
      const amountRaw = cols[idxAmount]?.trim();
      const description = cols[idxDesc]?.trim() || '';
      const paidAtRaw = idxPaidAt !== -1 ? cols[idxPaidAt]?.trim() : undefined;
      const amount = Number(amountRaw);
      if (!Number.isFinite(amount)) {
        results.push({ transactionId, status: 'skipped', reason: 'Invalid amount' });
        continue;
      }
      const match = description.match(/(LK-\d{10,})/i);
      if (!match) {
        results.push({ transactionId, status: 'skipped', reason: 'No order code in description' });
        continue;
      }
      const orderCode = match[1];
      try {
        const order = await this.prisma.order.findFirst({
          where: { orderCode },
          include: { payments: true, customer: true },
        });
        if (!order) {
          results.push({ transactionId, matchedOrderCode: orderCode, status: 'error', reason: 'Order not found' });
          continue;
        }
        const pending = order.payments.find((p) => p.status === PaymentStatus.PENDING && Number(p.amount) === amount);
        if (!pending) {
          results.push({ transactionId, matchedOrderCode: orderCode, status: 'skipped', reason: 'No pending payment with matching amount' });
          continue;
        }

        let detailedOrderForEvent: any;

        await this.prisma.$transaction(async (tx) => {
          const transition = await tx.payment.updateMany({
            where: { id: pending.id, status: PaymentStatus.PENDING },
            data: {
              status: PaymentStatus.SUCCESS,
              paidAt: paidAtRaw ? new Date(paidAtRaw) : new Date(),
              confirmedBy: actorUsername,
              confirmedAt: new Date(),
              externalTxnId: transactionId,
            },
          });
          if (transition.count === 0) {
            throw new Error('Payment already processed');
          }
          await tx.order.updateMany({
            where: { id: order.id, status: OrderStatus.PENDING_CONFIRMATION },
            data: { status: OrderStatus.CONFIRMED, confirmedAt: new Date() },
          });

          if (pending.method === PaymentMethod.VIETQR) {
            const orderWithItems = await tx.order.findUnique({
              where: { id: order.id },
              include: { orderItems: true },
            });
            for (const item of orderWithItems.orderItems) {
              const updateResult = await tx.productVariant.updateMany({
                where: { 
                  id: item.productVariantId,
                  stockQuantity: { gte: item.quantity }
                },
                data: { stockQuantity: { decrement: item.quantity } },
              });
              
              // Nếu không update được, nghĩa là không đủ stock
              if (updateResult.count === 0) {
                const current = await tx.productVariant.findUnique({
                  where: { id: item.productVariantId },
                  select: { stockQuantity: true, name: true }
                });
                throw new Error(
                  `Not enough stock for ${current?.name || 'product'}. Available: ${current?.stockQuantity || 0}, Requested: ${item.quantity}`
                );
              }
            }
            await tx.cartItem.deleteMany({ where: { customerId: order.customerId } });
          }

          await tx.paymentEvent.create({
            data: {
              paymentId: pending.id,
              orderId: order.id,
              type: 'RECONCILED',
              metadata: { actor: actorUsername, transactionId, amount, description },
            },
          });

          detailedOrderForEvent = await tx.order.findUnique({
            where: { id: order.id },
            include: {
              customer: true,
              shippingAddress: true,
              orderItems: { include: { productVariant: true } },
              payments: true,
              discount: true,
            },
          });
        });

        // After successful reconciliation, emit event
        this.eventEmitter.emit(
          'payment.confirmed',
          new PaymentConfirmedEvent(order.id, order.customer.email, detailedOrderForEvent),
        );

        results.push({ transactionId, matchedOrderCode: orderCode, matchedPaymentId: pending.id, status: 'matched' });
      } catch (e) {
        results.push({ transactionId, matchedOrderCode: orderCode, status: 'error', reason: String(e.message || e) });
      }
    }

    return { results };
  }
}
