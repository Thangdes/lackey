import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
