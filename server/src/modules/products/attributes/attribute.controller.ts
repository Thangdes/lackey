import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@ApiTags('Attributes')
@ApiBearerAuth()
@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @AdminAccess()
  create(@Body() dto: CreateAttributeDto) {
    return this.attributeService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.attributeService.findAll({
      page: query.page,
      limit: query.limit,
      search,
      isActive,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.attributeService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateAttributeDto,
  ) {
    return this.attributeService.update(id, dto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.attributeService.remove(id);
  }

  @Post(':id/values')
  @AdminAccess()
  addValue(
    @Param('id', ParseObjectIdPipe) attributeId: string,
    @Body() dto: CreateAttributeValueDto,
  ) {
    return this.attributeService.addValue(attributeId, dto);
  }

  @Patch(':id/values/:valueId')
  @AdminAccess()
  updateValue(
    @Param('id', ParseObjectIdPipe) attributeId: string,
    @Param('valueId', ParseObjectIdPipe) valueId: string,
    @Body() dto: UpdateAttributeValueDto,
  ) {
    return this.attributeService.updateValue(attributeId, valueId, dto);
  }

  @Delete(':id/values/:valueId')
  @AdminAccess()
  removeValue(
    @Param('id', ParseObjectIdPipe) attributeId: string,
    @Param('valueId', ParseObjectIdPipe) valueId: string,
  ) {
    return this.attributeService.removeValue(attributeId, valueId);
  }
}
