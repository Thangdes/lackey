import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentTasks {
  private readonly logger = new Logger(PaymentTasks.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // Runs every hour to cancel unpaid orders older than grace period
  @Cron(CronExpression.EVERY_HOUR)
  async autoCancelUnpaidOrders() {
    const graceHours = Number(this.configService.get<number>('UNPAID_CANCEL_GRACE_HOURS', 48));
    const cutoff = new Date(Date.now() - graceHours * 60 * 60 * 1000);

    this.logger.log(`Auto-cancel job running. Grace hours=${graceHours}, cutoff=${cutoff.toISOString()}`);

    // Find candidates
    const candidates = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_CONFIRMATION,
        createdAt: { lt: cutoff },
      },
      include: { payments: true },
    });

    for (const order of candidates) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Cancel order if still pending confirmation
          await tx.order.updateMany({
            where: { id: order.id, status: OrderStatus.PENDING_CONFIRMATION },
            data: { status: OrderStatus.CANCELED, canceledAt: new Date() },
          });

          // Mark any pending payments as FAILED
          await tx.payment.updateMany({
            where: { orderId: order.id, status: PaymentStatus.PENDING },
            data: { status: PaymentStatus.FAILED },
          });

          // Audit event (if model exists after migration)
          try {
            // @ts-ignore - model added via Prisma migration
            await tx.paymentEvent.create({
              data: {
                paymentId: order.payments[0]?.id || undefined,
                orderId: order.id,
                type: 'CANCELED',
                metadata: { reason: 'auto-cancel', cutoff: cutoff.toISOString() },
              },
            });
          } catch (e) {
            // ignore if model not yet generated
          }
        });
        this.logger.log(`Auto-canceled unpaid order ${order.orderCode}`);
      } catch (e) {
        this.logger.error(`Failed to auto-cancel order ${order.orderCode}`, e);
      }
    }
  }
}
