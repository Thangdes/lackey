import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAttributeValueDto {
  @IsString()
  @IsOptional()
  value?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
