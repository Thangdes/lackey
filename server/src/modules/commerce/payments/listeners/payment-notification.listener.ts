import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaymentConfirmedEvent } from '@/infrastructure/events/commerce.events';
import { MailService } from '@/integrations/mail/mail.service';

@Injectable()
export class PaymentNotificationListener {
  private readonly logger = new Logger(PaymentNotificationListener.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private readonly mailService: MailService,
  ) {}

  @OnEvent('payment.confirmed', { async: true })
  async handlePaymentConfirmedEvent(event: PaymentConfirmedEvent) {
    this.logger.log(`Handling payment.confirmed event for orderId: ${event.orderId}`);
    try {
      await this.notificationsQueue.add(
        'send-new-order-telegram',
        { orderId: event.orderId },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
          removeOnFail: 1000,
        },
      );

      this.logger.log(`Sending invoice email to ${event.email}`);
      await this.mailService.sendInvoiceEmail(event.email, event.detailedOrder);
      this.logger.log(`Invoice email sent to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to handle payment.confirmed event for orderId: ${event.orderId}`, error);
    }
  }
}
