import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderShippedEvent } from '@/infrastructure/events/commerce.events';
import { MailService } from '@/integrations/mail/mail.service';

@Injectable()
export class OrderNotificationListener {
  private readonly logger = new Logger(OrderNotificationListener.name);

  constructor(
    private readonly mailService: MailService,
  ) {}

  @OnEvent('order.created', { async: true })
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.logger.log(`Handling order.created event for orderId: ${event.orderId}`);
    // Telegram notification removed
  }

  @OnEvent('order.shipped', { async: true })
  async handleOrderShippedEvent(event: OrderShippedEvent) {
    this.logger.log(`Handling order.shipped event for orderCode: ${event.orderCode}`);
    try {
      await this.mailService.sendOrderShippedEmail(event.email, {
        orderCode: event.orderCode,
        deliveryCode: event.deliveryCode,
        fullName: event.fullName,
      });
    } catch (error) {
      this.logger.error(`Failed to handle order.shipped event for orderCode: ${event.orderCode}`, error);
    }
  }
}
