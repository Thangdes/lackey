import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { GhnModule } from '@/integrations/ghn/ghn.module';
import { PrismaModule } from '@/infrastructure/database/prisma.module';

@Module({
  imports: [GhnModule, PrismaModule],
  providers: [ShippingService],
  exports: [ShippingService],
  controllers: [ShippingController],
})
export class ShippingModule {}
