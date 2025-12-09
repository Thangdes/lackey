import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { MailModule } from '@/integrations/mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
