import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderCreatedEvent, OrderShippedEvent } from '@/infrastructure/events/commerce.events';
import { MailService } from '@/integrations/mail/mail.service';

@Injectable()
export class OrderNotificationListener {
  private readonly logger = new Logger(OrderNotificationListener.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    private readonly mailService: MailService,
  ) {}

  @OnEvent('order.created', { async: true })
  async handleOrderCreatedEvent(event: OrderCreatedEvent) {
    this.logger.log(`Handling order.created event for orderId: ${event.orderId}`);
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
    } catch (error) {
      this.logger.error(`Failed to handle order.created event for orderId: ${event.orderId}`, error);
    }
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
