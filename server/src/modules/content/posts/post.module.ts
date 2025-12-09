import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { CloudinaryModule } from '@/integrations/cloudinary/cloudinary.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
