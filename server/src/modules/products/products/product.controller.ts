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
  applyDecorators,
  UseGuards,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductQueryService } from './services/product-query.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/auth.gaurd';
import { AdminGuard } from '../../auth/admin.gaurd';
import { ProductVariantDto } from './dto/product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProductQueryDto } from './dto/product-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const AdminAccess = () => applyDecorators(UseGuards(JwtAuthGuard, AdminGuard));

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productQueryService: ProductQueryService,
  ) {}

  @Post()
  @AdminAccess()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('suppliers')
  getSuppliers() {
    return this.productQueryService.findSuppliers();
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
    return this.productService.updateThumbnail(id, thumbnailFile);
  }
  @Get('best-sellers')
  findBestSellers(
    @Query() query: ProductQueryDto,
  ) {
    return this.productQueryService.findBestSellers({ page: query.page, limit: query.limit, categoryId: query.categoryId });
  }

  @Get('top-rated')
  findTopRated(
    @Query() query: ProductQueryDto,
  ) {
    return this.productQueryService.findTopRated({ page: query.page, limit: query.limit, categoryId: query.categoryId });
  }
  
  @Get('search')
  searchQuick(
    @Query('q') q: string,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
  ) {
    return this.productQueryService.searchQuick({ q, limit });
  }
  @Get()
  findAll(
    @Query() query: ProductQueryDto,
  ) {
    return this.productQueryService.findAll({
      page: query.page,
      limit: query.limit,
      categoryId: query.categoryId,
      categoryIds: query.categoryIds,
      supplierId: query.supplierId,
      supplierIds: query.supplierIds,
      supplier: query.supplier,
      supplierSlug: query.supplierSlug,
      supplierSlugs: query.supplierSlugs,
      q: query.q,
      inStock: query.inStock,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
    });
  }

  @Get(':id/related')
  findRelated(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ) {
    return this.productQueryService.findRelated(id, limit);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @AdminAccess()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @AdminAccess()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }

  @Get(':productId/variants')
  @AdminAccess()
  findAllVariants(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productService.findAllVariants(productId);
  }

  @Post(':productId/variants')
  @AdminAccess()
  addVariant(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() variantData: ProductVariantDto,
  ) {
    delete variantData.id;
    return this.productService.addVariant(productId, variantData);
  }

  @Patch(':productId/variants/:variantId')
  @AdminAccess()
  updateVariant(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('variantId', ParseUUIDPipe) variantId: string,
    @Body() variantData: UpdateProductVariantDto,
  ) {
    return this.productService.updateVariant(productId, variantId, variantData);
  }

  @Delete(':productId/variants/:variantId')
  @AdminAccess()
  removeVariant(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('variantId', ParseUUIDPipe) variantId: string,
  ) {
    return this.productService.removeVariant(productId, variantId);
  }

  @Post(':id/images')
  @AdminAccess()
  @UseInterceptors(FilesInterceptor('images', 10))
  addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/(jpeg|png|webp)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.productService.addImages(id, files);
  }

  @Patch(':id/images/delete')
  @AdminAccess()
  removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.productService.removeImage(id, imageUrl);
  }
}
