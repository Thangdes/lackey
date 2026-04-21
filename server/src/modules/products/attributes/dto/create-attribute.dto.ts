import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
