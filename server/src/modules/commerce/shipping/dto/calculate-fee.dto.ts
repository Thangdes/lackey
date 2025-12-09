import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CalculateFeeDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsOptional()
  totalWeight?: number;

  @IsOptional()
  subtotal?: number;
}
