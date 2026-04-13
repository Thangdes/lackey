import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { ShippingModule } from '@/modules/commerce/shipping/shipping.module';
import { MailModule } from '@/integrations/mail/mail.module';
import { OrderRepository } from './repositories/order.repository';
import { OrderNotificationListener } from './listeners/order-notification.listener';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
    ShippingModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, OrderNotificationListener],
  exports: [OrderService],
})
export class OrderModule {}
