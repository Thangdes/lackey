import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { SepayController } from './sepay.controller';
import { SepayWebhookService } from './sepay.service';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../commerce/payments/payment.module';

/**
 * SepayModule
 *
 * Xử lý tích hợp SePay Báo Có webhook để tự động xác nhận đơn hàng
 * khi khách hàng chuyển khoản thành công.
 *
 * Routes: /payments/sepay/*
 */
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    PaymentModule,
  ],
  controllers: [SepayController],
  providers: [SepayWebhookService],
  exports: [SepayWebhookService],
})
export class SepayModule {}
