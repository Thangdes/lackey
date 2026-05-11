import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { PaymentService } from '@/modules/commerce/payments/payment.service';
import { OrderService } from '@/modules/commerce/orders/order.service';

@Processor('notifications')
export class NotificationsWorkerService extends WorkerHost {
  private readonly logger = new Logger(NotificationsWorkerService.name);

  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
    private orderService: OrderService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data:`,
      job.data,
    );

    this.logger.warn(`Unknown job name: ${job.name}`);
    throw new Error(`Unknown job name: ${job.name}`);
  }
}
