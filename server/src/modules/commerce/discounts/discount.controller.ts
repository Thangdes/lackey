import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  applyDecorators,
  Query,
  ParseFloatPipe,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@ApiTags('Discounts')
@ApiBearerAuth()
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @AdminAccess()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @AdminAccess()
  findAll(@Query() query: PaginationQueryDto) {
    return this.discountService.findAll({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('validate/:code')
  validateCode(
    @Param('code') code: string,
    @Query('subtotal', ParseFloatPipe) subtotal: number,
  ) {
    return this.discountService.validateCode(code, subtotal);
  }

  @Get('active-list')
  findAllActive() {
    return this.discountService.findAllActive();
  }

  @Get('promo-strip')
  getPromoStrip() {
    return this.discountService.getPromoStrip();
  }

  @Get(':id')
  @AdminAccess()
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.discountService.remove(id);
  }
}
