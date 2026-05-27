import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { PdfModule } from '@/integrations/pdf/pdf.module';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';
import { MailModule } from '@/integrations/mail/mail.module';
import { PaymentNotificationListener } from './listeners/payment-notification.listener';
import { PaymentReconciliationService } from './payment-reconciliation.service';
import { PaymentTasks } from './payment.tasks';

@Module({
  imports: [
    PrismaModule,
    PdfModule,
    CloudinaryModule,
    MailModule,
    MulterModule.register({}),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentTasks, PaymentNotificationListener, PaymentReconciliationService],
  exports: [PaymentService],
})
export class PaymentModule {}
