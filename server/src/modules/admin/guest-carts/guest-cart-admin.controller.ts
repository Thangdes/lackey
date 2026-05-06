import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { CleanupGuestCartsTask } from '@/infrastructure/schedulers/cleanup-guest-carts.task';

@ApiTags('Admin - Guest Carts')
@ApiBearerAuth()
@Controller('admin/guest-carts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class GuestCartAdminController {
  constructor(
    private readonly cleanupTask: CleanupGuestCartsTask,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Lấy thống kê về guest carts' })
  async getStats() {
    return this.cleanupTask.getGuestCartStats();
  }

  @Delete('cleanup')
  @ApiOperation({ summary: 'Xóa guest cart items cũ (manual cleanup)' })
  @ApiQuery({ name: 'daysOld', required: false, type: Number, description: 'Số ngày cũ (default: 30)' })
  async manualCleanup(@Query('daysOld') daysOld?: string) {
    const days = daysOld ? parseInt(daysOld, 10) : 30;
    return this.cleanupTask.manualCleanup(days);
  }
}
