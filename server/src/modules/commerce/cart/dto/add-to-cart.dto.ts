import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class AddToCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productVariantId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
