import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
