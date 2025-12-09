import { PartialType } from '@nestjs/swagger';
import { CreateSiteContentDto } from './create-site-content.dto';

export class UpdateSiteContentDto extends PartialType(CreateSiteContentDto) {}