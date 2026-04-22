import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductQueryService } from './services/product-query.service';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductQueryService],
})
export class ProductModule {}
