import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/auth.gaurd';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { UsersAdminService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';
import { ParseObjectIdPipe } from '@/infrastructure/common/pipes/parse-object-id.pipe';

@ApiTags('Admin - Users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersAdminService.create(dto);
  }

  @Get()
  findAll(
    @Query() query: PaginationQueryDto,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: string,
  ) {
    return this.usersAdminService.findAll({
      page: query.page,
      limit: query.limit,
      search,
      role,
      isActive,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersAdminService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersAdminService.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersAdminService.deactivate(id);
  }
}
