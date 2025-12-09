import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  applyDecorators,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { Request } from 'express';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { UpdateDeliveryCodeDto } from './dto/update-delivery-code.dto';
import { OrderStatus } from '@prisma/client';

interface UserPayload {
  id: string;
}

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private prisma: PrismaService,
  ) {}

  @Post('/checkout')
  async create(
    @CurrentUser() user: UserPayload | null,
    @Req() req: Request,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    if (user) {
      const customer = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { customerId: true },
      });
      createOrderDto.customerId = customer.customerId;
    } else {
      createOrderDto.guestCartId = req.cookies.guestCartId;
    }

    return this.orderService.create(createOrderDto);
  }

  @Post(':id/placed')
  async markPlaced(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.orderService.markPlaced(id);
  }

  @Get('/lookup')
  async lookupOrder(
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    if (code) {
      const order = await this.orderService.findByCode(code);
      return [order];
    }
    if (email || phone) {
      return this.orderService.lookupOrders({ email, phone });
    }
    throw new BadRequestException(
      'Query parameter "code", "email", or "phone" is required',
    );
  }

  @Get()
  @AdminAccess()
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('code') code?: string,
    @Query('email') email?: string,
    @Query('deliveryCode') deliveryCode?: string,
    @Query('isGuest') isGuest?: string,
  ) {
    return this.orderService.findAll({
      page: query.page,
      limit: query.limit,
      status: status as any,
      search,
      code,
      email,
      deliveryCode,
      isGuest,
    });
  }

  @Patch(':id/status')
  @AdminAccess()
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, updateDto);
  }

  @Get('/my-history')
  @UseGuards(JwtAuthGuard)
  async findMyOrders(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationQueryDto,
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const customer = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { customerId: true },
    });
    return this.orderService.findMyOrdersPaginated(customer.customerId, {
      page: query.page,
      limit: query.limit,
      status,
      search,
      fromDate,
      toDate,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserPayload,
  ) {
    const loggedInUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { customerId: true, role: true },
    });
    const customerIdToCheck =
      loggedInUser.role === 'ADMIN' ? undefined : loggedInUser.customerId;
    return this.orderService.findOne(id, customerIdToCheck);
  }

  @Post(':id/cancel')
  async cancelPending(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('orderCode') orderCode?: string,
    @CurrentUser() user?: UserPayload | null,
  ) {
    const order = await this.orderService.findOne(id);
    if (user) {
      const loggedInUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { customerId: true },
      });
      if (!loggedInUser || order.customerId !== loggedInUser.customerId) {
        throw new BadRequestException('You cannot cancel this order.');
      }
    } else {
      if (!orderCode || orderCode !== order.orderCode) {
        throw new BadRequestException('Invalid orderCode for cancellation.');
      }
    }
    return this.orderService.cancelPending(id);
  }

  @Patch(':id/delivery-code')
  @AdminAccess()
  updateDeliveryCode(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeliveryCodeDto: UpdateDeliveryCodeDto,
  ) {
    return this.orderService.updateDeliveryCode(
      id,
      updateDeliveryCodeDto.deliveryCode,
    );
  }
}
