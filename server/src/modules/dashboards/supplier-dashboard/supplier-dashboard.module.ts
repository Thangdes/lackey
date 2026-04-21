import { Module } from '@nestjs/common';
import { SupplierDashboardController } from './supplier-dashboard.controller';
import { SupplierDashboardService } from './supplier-dashboard.service';
import { PrismaModule } from '@/infrastructure/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierDashboardController],
  providers: [SupplierDashboardService],
})
export class SupplierDashboardModule {}
