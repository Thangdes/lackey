import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { GhnModule } from '../ghn/ghn.module';

@Module({
  imports: [GhnModule],
  providers: [ShippingService],
  exports: [ShippingService],
  controllers: [ShippingController],
})
export class ShippingModule {}
