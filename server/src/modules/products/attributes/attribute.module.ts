import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AttributeController],
  providers: [AttributeService],
})
export class AttributeModule {}
