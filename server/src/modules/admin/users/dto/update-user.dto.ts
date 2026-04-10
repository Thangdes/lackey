import { IsBoolean, IsEnum, IsOptional, IsString, MinLength, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  @IsOptional()
  customerId?: string | null;

  @IsUUID()
  @IsOptional()
  supplierId?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
