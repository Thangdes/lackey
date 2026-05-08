import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentConfirmedEvent } from '@/infrastructure/events/commerce.events';
import { MailService } from '@/integrations/mail/mail.service';

@Injectable()
export class PaymentNotificationListener {
  private readonly logger = new Logger(PaymentNotificationListener.name);

  constructor(
    private readonly mailService: MailService,
  ) {}

  @OnEvent('payment.confirmed', { async: true })
  async handlePaymentConfirmedEvent(event: PaymentConfirmedEvent) {
    this.logger.log(`Handling payment.confirmed event for orderId: ${event.orderId}`);
    try {
      this.logger.log(`Sending invoice email to ${event.email}`);
      await this.mailService.sendInvoiceEmail(event.email, event.detailedOrder);
      this.logger.log(`Invoice email sent to ${event.email}`);
    } catch (error) {
      this.logger.error(`Failed to handle payment.confirmed event for orderId: ${event.orderId}`, error);
    }
  }
}
