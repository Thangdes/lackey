import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { DiscountRepository } from './repositories/discount.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DiscountController],
  providers: [DiscountService, DiscountRepository],
})
export class DiscountModule {}
