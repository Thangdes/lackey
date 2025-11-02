import { IsBooleanString, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  // New: support multi-category via categoryIds[]=id or categoryIds=id1,id2
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.length > 0) return value.split(',');
    return undefined;
  })
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  supplierId?: string;

  // Support multi-supplier via supplierIds[]=id or supplierIds=id1,id2
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.length > 0) return value.split(',');
    return undefined;
  })
  supplierIds?: string[];

  // New: support supplier slug(s) for nicer URLs
  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  supplierSlug?: string;

  // Accept multiple slugs via supplierSlugs[]=slug or supplierSlugs=slug1,slug2
  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.length > 0) return value.split(',');
    return undefined;
  })
  supplierSlugs?: string[];

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsBooleanString()
  inStock?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsIn(['name_asc', 'name_desc', 'buy_desc', 'rating_desc', 'price_asc', 'price_desc'])
  sort?: 'name_asc' | 'name_desc' | 'buy_desc' | 'rating_desc' | 'price_asc' | 'price_desc';
}
