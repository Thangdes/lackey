import { Module } from '@nestjs/common';
import { GuestCartAdminController } from './guest-cart-admin.controller';
import { TasksModule } from '@/infrastructure/schedulers/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [GuestCartAdminController],
})
export class GuestCartAdminModule {}
