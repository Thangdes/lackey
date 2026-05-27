import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantDto } from './product-variant.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  categoryId: string;

  @IsMongoId({ message: 'supplierId must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'supplierId should not be empty' })
  supplierId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  initialBuyCount?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất 1 biến thể' })
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants: ProductVariantDto[];
}
