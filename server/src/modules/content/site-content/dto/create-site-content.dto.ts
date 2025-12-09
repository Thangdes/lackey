import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsUrl,
    IsInt,
    Min,
    ValidateIf,
  } from 'class-validator';
  import { ContentType } from '@prisma/client';
  
  export class CreateSiteContentDto {
    @IsEnum(ContentType)
    @IsNotEmpty({ message: 'Type must be one of BANNER, TESTIMONIAL, GALLERY' })
    type: ContentType;
  
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsOptional()
    content?: string;
  
    @IsUrl({}, { message: 'Thumbnail URL must be a valid URL' })
    @IsOptional()
    thumbnailUrl?: string;
  
    @IsString()
    @ValidateIf((o) => o.type === ContentType.BANNER)
    @IsOptional()
    linkUrl?: string;
  
    @IsString()
    @IsNotEmpty()
    @ValidateIf((o) => o.type === ContentType.TESTIMONIAL)
    authorName: string;
  
    @IsString()
    @IsOptional()
    @ValidateIf((o) => o.type === ContentType.TESTIMONIAL)
    authorTitle?: string;
  
    @IsInt()
    @Min(0)
    @IsOptional()
    displayOrder?: number = 0;
  
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean = false;
  }