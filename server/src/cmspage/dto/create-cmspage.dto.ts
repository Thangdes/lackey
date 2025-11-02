import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCmspageDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  contentHtml?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
