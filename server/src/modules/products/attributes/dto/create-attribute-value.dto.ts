import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAttributeValueDto {
  @IsString()
  value: string;

  @IsString()
  slug: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
