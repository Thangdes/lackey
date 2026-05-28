import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { JwtAuthGuard } from '../../auth/auth.gaurd';
import { AdminGuard } from '../../auth/admin.gaurd';
import { CreateSupplierUserDto } from './dto/create-supplier-user.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

@ApiTags('Admin - Suppliers')
@ApiBearerAuth()
@Controller('admin/suppliers')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Post('users')
  createSupplierUser(@Body() createSupplierUserDto: CreateSupplierUserDto) {
    return this.supplierService.createSupplierUser(createSupplierUserDto);
  }

  @Get()
  findAll() {
    return this.supplierService.findAllSuppliers();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.findSupplierDetails(id);
  }

  @Patch(':id')
  updateSupplier(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(id, dto);
  }

  @Delete(':id')
  deleteSupplier(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.deleteSupplier(id);
  }

  @Patch(':id/activate')
  activateSupplier(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.activateSupplier(id);
  }

  @Patch('activate/:id')
  activateSupplierAlt(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.activateSupplier(id);
  }

  @Patch('deactivate/:id')
  deactivateSupplier(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.deactivateSupplierUser(id);
  }

  @Patch('reactivate/:id')
  reactivateSupplier(@Param('id', ParseObjectIdPipe) id: string) {
    return this.supplierService.reactivateSupplierUser(id);
  }

  @Patch('users/:id/password')
  resetSupplierUserPassword(
    @Param('id', ParseObjectIdPipe) userId: string,
    @Body('password') password: string,
  ) {
    return this.supplierService.resetSupplierUserPassword(userId, password);
  }

  @Delete('users/:id')
  deleteSupplierUser(@Param('id', ParseObjectIdPipe) userId: string) {
    return this.supplierService.deleteSupplierUser(userId);
  }
}
