import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  applyDecorators,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { OwnershipGuard } from '@/modules/auth/ownership.guard';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

const StaffAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));
const OwnerOrAdminAccess = () =>
  applyDecorators(UseGuards(JwtAuthGuard, OwnershipGuard));

@ApiTags('Customers')
@ApiBearerAuth()
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
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @StaffAccess()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @StaffAccess()
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.customerService.remove(id);
  }

  @Post(':customerId/addresses')
  @OwnerOrAdminAccess()
  addAddress(
    @Param('customerId', ParseObjectIdPipe) customerId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.customerService.addAddress(customerId, createAddressDto);
  }

  @Get(':customerId/addresses')
  @OwnerOrAdminAccess()
  findAllAddresses(@Param('customerId', ParseObjectIdPipe) customerId: string) {
    return this.customerService.findAllAddresses(customerId);
  }

  @Patch(':customerId/addresses/:addressId')
  @OwnerOrAdminAccess()
  updateAddress(
    @Param('customerId', ParseObjectIdPipe) customerId: string,
    @Param('addressId', ParseObjectIdPipe) addressId: string,
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
    @Param('customerId', ParseObjectIdPipe) customerId: string,
    @Param('addressId', ParseObjectIdPipe) addressId: string,
  ) {
    return this.customerService.removeAddress(customerId, addressId);
  }
}
