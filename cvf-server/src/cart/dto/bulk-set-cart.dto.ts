import { ArrayNotEmpty, IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkCartItemDto {
  @IsUUID()
  productVariantId!: string;

  @IsInt()
  @Min(0)
  quantity!: number; // 0 means remove
}

export class BulkSetCartDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BulkCartItemDto)
  items!: BulkCartItemDto[];
}
