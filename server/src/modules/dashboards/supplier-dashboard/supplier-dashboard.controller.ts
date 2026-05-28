import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SupplierDashboardService } from './supplier-dashboard.service';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetSupplierOrdersDto } from './dto/get-supplier-orders.dto';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { CurrentSupplierId } from '@/modules/auth/decorators/current-supplier.decorator';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

@ApiTags('Supplier Dashboard')
@ApiBearerAuth()
@Controller('supplier-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierDashboardController {
  constructor(
    private readonly supplierDashboardService: SupplierDashboardService,
  ) {}

  @Get('profile')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get supplier profile for current user' })
  @ApiResponse({ status: 200, description: 'Supplier profile retrieved.' })
  getSupplierProfile(@CurrentSupplierId() supplierId: string | null) {
    return this.supplierDashboardService.getSupplierProfile(supplierId);
  }

  @Get('summary')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get summary statistics for the supplier' })
  @ApiResponse({
    status: 200,
    description: 'Summary data retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getSummaryStats(@CurrentSupplierId() supplierId: string | null) {
    return this.supplierDashboardService.getSummaryStats(supplierId);
  }

  @Get('top-selling-products')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get top 5 selling products for the supplier' })
  getTopSellingProducts(@CurrentSupplierId() supplierId: string | null) {
    return this.supplierDashboardService.getTopSellingProducts(supplierId);
  }

  @Get('recent-orders')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get recent orders containing supplier’s products' })
  getRecentOrders(@CurrentSupplierId() supplierId: string | null) {
    return this.supplierDashboardService.getRecentOrders(supplierId);
  }

  @Get('inventory-report')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get an inventory report of all products' })
  getInventoryReport(@CurrentSupplierId() supplierId: string | null) {
    return this.supplierDashboardService.getInventoryReport(supplierId);
  }

  @Get('revenue-over-time')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get revenue aggregated by day for the last N days',
  })
  revenueOverTime(
    @CurrentSupplierId() supplierId: string | null,
    @Query('days') days?: string,
  ) {
    const n = Math.max(1, Math.min(90, Number(days) || 30));
    return this.supplierDashboardService.revenueOverTime(supplierId, n);
  }

  @Get('orders-count')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get count of supplier-related orders in the last N days',
  })
  ordersCount(
    @CurrentSupplierId() supplierId: string | null,
    @Query('days') days?: string,
  ) {
    const n = Math.max(1, Math.min(90, Number(days) || 30));
    return this.supplierDashboardService.ordersCountLastNDays(supplierId, n);
  }

  @Get('restock-candidates')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Top variants with low stock and high recent sales',
  })
  restockCandidates(
    @CurrentSupplierId() supplierId: string | null,
    @Query('limit') limit?: string,
    @Query('lowThreshold') lowThreshold?: string,
  ) {
    const l = Math.max(1, Math.min(50, Number(limit) || 10));
    const th = Math.max(0, Math.min(1000, Number(lowThreshold) || 5));
    return this.supplierDashboardService.restockCandidates(supplierId, l, th);
  }

  @Get('orders')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a paginated list of all related orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully.',
  })
  getAllOrders(
    @CurrentSupplierId() supplierId: string | null,
    @Query() query: GetSupplierOrdersDto,
  ) {
    return this.supplierDashboardService.getAllOrders(supplierId, query);
  }

  @Get('orders/:orderId')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get detailed information for a single order' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found or access denied.',
  })
  getOrderDetails(
    @CurrentSupplierId() supplierId: string | null,
    @Param('orderId', ParseObjectIdPipe) orderId: string,
  ) {
    return this.supplierDashboardService.getOrderDetails(supplierId, orderId);
  }
}
