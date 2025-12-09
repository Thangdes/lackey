import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class ProductVariantDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number; // Weight in grams
}
