import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { InventoryMovementType } from '@prisma/client';

export class CreateInventoryMovementDto {
  @IsUUID()
  productVariantId: string;

  @IsEnum(InventoryMovementType)
  type: InventoryMovementType;

  @IsInt()
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}
