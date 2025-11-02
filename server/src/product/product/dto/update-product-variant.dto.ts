import { PartialType } from '@nestjs/mapped-types';
import { ProductVariantDto } from './product-variant.dto';

export class UpdateProductVariantDto extends PartialType(ProductVariantDto) {
  id?: never;
}
