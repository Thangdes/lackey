import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsWorkerService } from './notifications/notifications.worker.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { PaymentModule } from 'src/payment/payment.module';
import { OrderModule } from 'src/order/order.module';

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
export class WorkersModule {}
