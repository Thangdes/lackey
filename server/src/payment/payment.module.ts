import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MailModule } from 'src/mail/mail.module';
import { PaymentTasks } from './payment.tasks';

@Module({
  imports: [
    PrismaModule,
    PdfModule,
    CloudinaryModule,
    MailModule,
    MulterModule.register({}),
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentTasks],
  exports: [PaymentService],
})
export class PaymentModule {}
