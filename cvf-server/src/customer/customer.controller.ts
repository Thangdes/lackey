import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  applyDecorators,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/auth.gaurd';
import { AdminGuard } from '../auth/admin.gaurd';
import { OwnershipGuard } from '../auth/ownership.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

const StaffAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));
const OwnerOrAdminAccess = () =>
  applyDecorators(UseGuards(JwtAuthGuard, OwnershipGuard));

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @StaffAccess()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @StaffAccess()
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('search') search?: string,
  ) {
    return this.customerService.findAll({ page: query.page, limit: query.limit, search });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    const customerId: string | undefined = req?.user?.customerId;
    if (!customerId) return null;
    return this.customerService.findOne(customerId);
  }

  @Get(':id')
  @StaffAccess()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @StaffAccess()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @StaffAccess()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.remove(id);
  }

  @Post(':customerId/addresses')
  @OwnerOrAdminAccess()
  addAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.customerService.addAddress(customerId, createAddressDto);
  }

  @Get(':customerId/addresses')
  @OwnerOrAdminAccess()
  findAllAddresses(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.customerService.findAllAddresses(customerId);
  }

  @Patch(':customerId/addresses/:addressId')
  @OwnerOrAdminAccess()
  updateAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.customerService.updateAddress(
      customerId,
      addressId,
      updateAddressDto,
    );
  }

  @Delete(':customerId/addresses/:addressId')
  @OwnerOrAdminAccess()
  removeAddress(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Param('addressId', ParseUUIDPipe) addressId: string,
  ) {
    return this.customerService.removeAddress(customerId, addressId);
  }
}
