import { Module } from '@nestjs/common';
import { SiteContentService } from './site-content.service';
import { SiteContentController } from './site-content.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [SiteContentController],
  providers: [SiteContentService],
})
export class SiteContentModule {}