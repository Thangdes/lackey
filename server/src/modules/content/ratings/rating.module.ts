import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { RatingRepository } from './repositories/rating.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
})
export class RatingModule {}
