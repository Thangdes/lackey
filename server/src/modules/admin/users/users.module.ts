import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersAdminController } from './users.controller';
import { UsersAdminService } from './users.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersAdminController],
  providers: [UsersAdminService],
})
export class UsersAdminModule {}
