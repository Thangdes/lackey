import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { AdminGuard } from '../auth/admin.gaurd';
import { JwtAuthGuard } from 'src/auth/auth.gaurd';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getStats(query);
  }

  @Get('revenue-over-time')
  getRevenueOverTime(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getRevenueOverTime(query);
  }

  @Get('top-products')
  getTopProducts(@Query() query: DashboardQueryDto) {
    return this.dashboardService.getTopProducts(query);
  }
}
