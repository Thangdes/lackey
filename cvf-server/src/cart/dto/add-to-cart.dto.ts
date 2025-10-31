import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productVariantId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
