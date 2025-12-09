import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  applyDecorators,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../../auth/auth.gaurd';
import { AdminGuard } from '../../auth/admin.gaurd';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from '@/infrastructure/common/dto/pagination-query.dto';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @AdminAccess()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.categoryService.findAll({ page: query.page, limit: query.limit });
  }

  @Get('header')
  getHeaderCategories() {
    return this.categoryService.findTopByProductCount(7);
  }

  @Get(':id/products')
  findOneWithProducts(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOneWithProducts(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.remove(id);
  }

  @Post(':id/thumbnail')
  @AdminAccess()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @HttpCode(HttpStatus.OK)
  updateThumbnail(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
        fileIsRequired: true,
      }),
    )
    thumbnailFile: Express.Multer.File,
  ) {
    return this.categoryService.updateThumbnail(id, thumbnailFile);
  }
}
