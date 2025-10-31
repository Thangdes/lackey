import { PartialType } from '@nestjs/mapped-types';
import { CreateCmspageDto } from './create-cmspage.dto';

export class UpdateCmspageDto extends PartialType(CreateCmspageDto) {}
