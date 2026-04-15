import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CmspageService } from './cmspage.service';
import { CreateCmspageDto } from './dto/create-cmspage.dto';
import { UpdateCmspageDto } from './dto/update-cmspage.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '@/modules/auth/admin.gaurd';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('CMS Pages')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('cms-pages')
export class CmspageController {
  constructor(private readonly cmspageService: CmspageService) {}

  @Post()
  create(@Body() createCmspageDto: CreateCmspageDto) {
    return this.cmspageService.create(createCmspageDto);
  }

  @Get()
  findAll() {
    return this.cmspageService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.cmspageService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmspageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCmspageDto: UpdateCmspageDto,
  ) {
    return this.cmspageService.update(id, updateCmspageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmspageService.remove(id);
  }
}
