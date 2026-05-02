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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentConfirmedEvent } from '@/infrastructure/events/commerce.events';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private pdfService: PdfService,
    private cloudinaryService: CloudinaryService,
    private eventEmitter: EventEmitter2,
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

      this.eventEmitter.emit(
        'payment.confirmed',
        new PaymentConfirmedEvent(detailedOrder.id, detailedOrder.customer.email, detailedOrder),
      );
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
}
