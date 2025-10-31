import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupplierDashboardService } from './supplier-dashboard.service';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { UserRole, User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetSupplierOrdersDto } from './dto/get-supplier-orders.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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
  getSupplierProfile(@GetUser() user: User) {
    return this.supplierDashboardService.getSupplierProfile(user);
  }

  @Get('summary')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get summary statistics for the supplier' })
  @ApiResponse({
    status: 200,
    description: 'Summary data retrieved successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getSummaryStats(@GetUser() user: User) {
    return this.supplierDashboardService.getSummaryStats(user);
  }

  @Get('top-selling-products')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get top 5 selling products for the supplier' })
  getTopSellingProducts(@GetUser() user: User) {
    return this.supplierDashboardService.getTopSellingProducts(user);
  }

  @Get('recent-orders')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get recent orders containing supplier’s products' })
  getRecentOrders(@GetUser() user: User) {
    return this.supplierDashboardService.getRecentOrders(user);
  }

  @Get('inventory-report')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get an inventory report of all products' })
  getInventoryReport(@GetUser() user: User) {
    return this.supplierDashboardService.getInventoryReport(user);
  }

  @Get('revenue-over-time')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get revenue aggregated by day for the last N days' })
  revenueOverTime(
    @GetUser() user: User,
    @Query('days') days?: string,
  ) {
    const n = Math.max(1, Math.min(90, Number(days) || 30));
    return this.supplierDashboardService.revenueOverTime(user, n);
  }

  @Get('orders-count')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get count of supplier-related orders in the last N days' })
  ordersCount(
    @GetUser() user: User,
    @Query('days') days?: string,
  ) {
    const n = Math.max(1, Math.min(90, Number(days) || 30));
    return this.supplierDashboardService.ordersCountLastNDays(user, n);
  }

  @Get('restock-candidates')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Top variants with low stock and high recent sales' })
  restockCandidates(
    @GetUser() user: User,
    @Query('limit') limit?: string,
    @Query('lowThreshold') lowThreshold?: string,
  ) {
    const l = Math.max(1, Math.min(50, Number(limit) || 10));
    const th = Math.max(0, Math.min(1000, Number(lowThreshold) || 5));
    return this.supplierDashboardService.restockCandidates(user, l, th);
  }

  @Get('orders')
  @Roles(UserRole.SUPPLIER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a paginated list of all related orders' })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully.',
  })
  getAllOrders(@GetUser() user: User, @Query() query: GetSupplierOrdersDto) {
    return this.supplierDashboardService.getAllOrders(user, query);
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
    @GetUser() user: User,
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ) {
    return this.supplierDashboardService.getOrderDetails(user, orderId);
  }
}
