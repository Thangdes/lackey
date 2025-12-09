import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PaymentStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PdfService } from '@/integrations/pdf/pdf.service';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { MailService } from '@/integrations/mail/mail.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private pdfService: PdfService,
    private cloudinaryService: CloudinaryService,
    private mailService: MailService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async createPaymentLink(orderId: string) {
    const order = await this.prisma.order
      .findUniqueOrThrow({
        where: { id: orderId },
        include: { payments: true },
      })
      .catch(() => {
        throw new NotFoundException('Order not found.');
      });

    if (order.status !== OrderStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('This order cannot be paid for.');
    }

    const pendingPayment = order.payments.find(
      (p) => p.status === PaymentStatus.PENDING,
    );
    if (!pendingPayment) {
      throw new NotFoundException('No pending payment found for this order.');
    }

    const vietQRData = {
      amount: Number(order.totalAmount),
      accountName: this.configService.get<string>('VIETQR_ACCOUNT_NAME'),
      accountNumber: this.configService.get<string>('VIETQR_ACCOUNT_NUMBER'),
      bankCode: this.configService.get<string>('VIETQR_BANK_CODE'),
      description: `Thanh toan don hang ${order.orderCode}`,
    };

    const encodedDescription = encodeURIComponent(vietQRData.description);
    const encodedAccountName = encodeURIComponent(vietQRData.accountName || '');
    const finalAmount = Math.max(0, Math.floor(Number(vietQRData.amount) || 0));


    const qrCodeImageUrl = `https://img.vietqr.io/image/${vietQRData.bankCode}-${vietQRData.accountNumber}-compact.png?amount=${finalAmount}&addInfo=${encodedDescription}&accountName=${encodedAccountName}`;

    const windowMinutes = Math.max(1, Number(process.env.ORDER_IDEMPOTENCY_MINUTES || 10));
    const expiresAt = new Date(order.createdAt.getTime() + windowMinutes * 60 * 1000);
    const now = new Date();
    const expiresInSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

    // If order already expired, automatically cancel and fail pending payments, then block link creation
    if (expiresInSeconds <= 0) {
      await this.prisma.$transaction(async (tx) => {
        await tx.order.updateMany({
          where: { id: order.id, status: OrderStatus.PENDING_CONFIRMATION },
          data: { status: OrderStatus.CANCELED, canceledAt: new Date() },
        });
        await tx.payment.updateMany({
          where: { orderId: order.id, status: PaymentStatus.PENDING },
          data: { status: PaymentStatus.FAILED },
        });
      });
      throw new BadRequestException('This payment session has expired. Please re-checkout to get a new QR.');
    }

    return {
      orderId: order.id,
      orderCode: order.orderCode,
      accountName: vietQRData.accountName,
      accountNumber: vietQRData.accountNumber,
      bankCode: vietQRData.bankCode,
      bankName: this.configService.get<string>('VIETQR_BANK_NAME'),
      amount: order.totalAmount,
      qrCodeImageUrl: qrCodeImageUrl,
      paymentId: pendingPayment.id,
      expiresAt: expiresAt.toISOString(),
      expiresInSeconds,
    };
  }

  async confirmPaymentManually(orderId: string, confirmedByUsername: string) {
    this.logger.log(
      `Manual payment confirmation for order ${orderId} by @${confirmedByUsername}`,
    );

    const { updatedPayment, performed, order } = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          payments: true,
          orderItems: { include: { productVariant: true } },
        },
      });

      if (!order) throw new NotFoundException('Order not found');

      const pendingPayment = order.payments.find(
        (p) => p.status === PaymentStatus.PENDING,
      );
      if (!pendingPayment)
        throw new BadRequestException(
          'Order has no pending payment to confirm.',
        );

      const transition = await tx.payment.updateMany({
        where: { id: pendingPayment.id, status: PaymentStatus.PENDING },
        data: { status: PaymentStatus.SUCCESS, paidAt: new Date(), confirmedBy: confirmedByUsername, confirmedAt: new Date() },
      });

      if (transition.count === 0) {
        throw new BadRequestException('Payment already processed.');
      }

      const updatedPayment = await tx.payment.findUnique({ where: { id: pendingPayment.id } });

      await tx.order.updateMany({
        where: { id: order.id, status: OrderStatus.PENDING_CONFIRMATION },
        data: { status: OrderStatus.CONFIRMED, confirmedAt: new Date() },
      });

      const isVietQr = pendingPayment.method === PaymentMethod.VIETQR;
      if (isVietQr) {
        for (const item of order.orderItems) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          });
        }
        await tx.cartItem.deleteMany({ where: { customerId: order.customerId } });
      }

      // Audit event
      await tx.paymentEvent.create({
        data: {
          paymentId: updatedPayment.id,
          orderId: order.id,
          type: 'CONFIRMED',
          metadata: { actor: confirmedByUsername, method: pendingPayment.method },
        },
      });

      return { updatedPayment, performed: true, order };
    });

    const detailedOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        shippingAddress: true,
        orderItems: { include: { productVariant: true } },
        payments: true,
        discount: true,
      },
    });

    try {
      // Enqueue Telegram notification now that payment is confirmed (avoid ghost notifications earlier)
      await this.notificationsQueue.add(
        'send-new-order-telegram',
        { orderId: detailedOrder.id },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
          removeOnFail: 1000,
        },
      );

      await this.prisma.invoice.create({
        data: {
          orderId: detailedOrder.id,
          paymentId: updatedPayment.id,
          invoiceNumber: `INV-${detailedOrder.orderCode}`,
        },
      });
      this.logger.log(
        `Invoice record created for order ${detailedOrder.orderCode}`,
      );

      this.logger.log(
        `Sending invoice email to ${detailedOrder.customer.email}`,
      );
      await this.mailService.sendInvoiceEmail(
        detailedOrder.customer.email,
        detailedOrder,
      );
      this.logger.log(`Invoice email sent to ${detailedOrder.customer.email}`);
    } catch (error) {
      this.logger.error(
        `Error during post-confirmation tasks for order ${orderId}`,
        error,
      );
    }

    return detailedOrder;
  }

  async listPendingPayments(params: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit || 20)));
    const skip = (page - 1) * limit;
    const where = { status: PaymentStatus.PENDING } as const;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          paidAt: 'desc',
        },
        include: {
          order: { include: { customer: true } },
        },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

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
      const match = description.match(/(CVF-\d{10,})/i);
      if (!match) {
        results.push({ transactionId, status: 'skipped', reason: 'No order code in description' });
        continue;
      }
      const orderCode = match[1];
      try {
        const order = await this.prisma.order.findFirst({
          where: { orderCode },
          include: { payments: true },
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
              await tx.productVariant.update({
                where: { id: item.productVariantId },
                data: { stockQuantity: { decrement: item.quantity } },
              });
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
        });

        // After successful reconciliation, notify Telegram just once now
        await this.notificationsQueue.add(
          'send-new-order-telegram',
          { orderId: order.id },
          {
            attempts: 3,
            backoff: { type: 'exponential', delay: 5000 },
            removeOnComplete: true,
            removeOnFail: 1000,
          },
        );

        results.push({ transactionId, matchedOrderCode: orderCode, matchedPaymentId: pending.id, status: 'matched' });
      } catch (e) {
        results.push({ transactionId, matchedOrderCode: orderCode, status: 'error', reason: String(e.message || e) });
      }
    }

    return { results };
  }
}
