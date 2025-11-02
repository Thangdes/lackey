import { Module } from '@nestjs/common';
import { CmspageService } from './cmspage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CmspageController } from './cmspage.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CmspageController],
  providers: [CmspageService],
})
export class CmspageModule {}
