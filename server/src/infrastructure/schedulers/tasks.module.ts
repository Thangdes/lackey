import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from '@/infrastructure/database/prisma.module';
import { CleanupGuestCartsTask } from './cleanup-guest-carts.task';

@Module({
  imports: [PrismaModule],
  providers: [TasksService, CleanupGuestCartsTask],
  exports: [CleanupGuestCartsTask],
})
export class TasksModule {}
