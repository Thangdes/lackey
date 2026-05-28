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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @AdminAccess()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.tagService.findAll({
      page: query.page,
      limit: query.limit,
      search,
      isActive,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateTagDto,
  ) {
    return this.tagService.update(id, dto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.tagService.remove(id);
  }
}
