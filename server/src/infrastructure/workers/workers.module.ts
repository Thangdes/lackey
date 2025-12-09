import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsWorkerService } from './notifications/notifications.worker.service';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { TelegramModule } from '@/integrations/telegram/telegram.module';
import { PaymentModule } from '@/modules/commerce/payments/payment.module';
import { OrderModule } from '@/modules/commerce/orders/order.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
    }),
    PrismaModule,
    TelegramModule,
    PaymentModule,
    OrderModule,
  ],
  providers: [NotificationsWorkerService],
})
export class WorkersModule { }
