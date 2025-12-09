import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM, {
    name: 'prepareShipments',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handlePrepareShipments() {
    this.logger.log('Running job: Prepare Shipments...');
    const result = await this.prisma.order.updateMany({
      where: {
        status: OrderStatus.CONFIRMED,
      },
      data: {
        status: OrderStatus.PREPARING_SHIPMENT,
      },
    });
    if (result.count > 0) {
      this.logger.log(`Updated ${result.count} orders to PREPARING_SHIPMENT.`);
    } else {
      this.logger.log('No orders to update.');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'autoRateCompletedOrders',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleAutoRateOrders() {
    this.logger.log('Running job: Auto-rate completed orders...');
    const threeDaysAgo = dayjs().subtract(3, 'days').toDate();

    const allEligibleItems = await this.prisma.orderItem.findMany({
      where: {
        autoRated: false,
        order: {
          status: OrderStatus.COMPLETED,
          completedAt: {
            lte: threeDaysAgo,
          },
        },
      },
      include: {
        order: { select: { customerId: true } },
        productVariant: { select: { productId: true } },
      },
    });

    const orderIds = allEligibleItems.map((item) => item.orderId);
    const existingRatings = await this.prisma.rating.findMany({
      where: {
        orderId: { in: orderIds },
      },
      select: {
        orderId: true,
        productVariantId: true,
      },
    });

    const ratedItemsSet = new Set(
      existingRatings.map((r) => `${r.orderId}-${r.productVariantId}`),
    );

    const itemsToRate = allEligibleItems.filter(
      (item) => !ratedItemsSet.has(`${item.orderId}-${item.productVariantId}`),
    );

    if (itemsToRate.length === 0) {
      this.logger.log('No items to auto-rate.');
      return;
    }

    this.logger.log(`Found ${itemsToRate.length} items to auto-rate.`);

    for (const item of itemsToRate) {
      const ratingValue = Math.random() < 0.7 ? 5 : 4;
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.rating.create({
            data: {
              customerId: item.order.customerId,
              productId: item.productVariant.productId,
              productVariantId: item.productVariantId,
              orderId: item.orderId,
              ratingValue: ratingValue,
              comment: 'Hệ thống tự động đánh giá.',
            },
          });

          await tx.orderItem.update({
            where: { id: item.id },
            data: { autoRated: true },
          });

          const aggregates = await tx.rating.aggregate({
            _avg: { ratingValue: true },
            _count: { ratingValue: true },
            where: { productId: item.productVariant.productId },
          });

          await tx.product.update({
            where: { id: item.productVariant.productId },
            data: {
              ratingAvg: aggregates._avg.ratingValue || 0,
              ratingCount: aggregates._count.ratingValue || 0,
            },
          });
        });
        this.logger.log(
          `Auto-rated item ${item.id} with ${ratingValue} stars.`,
        );
      } catch (error) {
        if (error.code !== 'P2002') {
          this.logger.error(`Failed to auto-rate item ${item.id}`, error);
        }
      }
    }
    this.logger.log('Auto-rating job finished.');
  }

  @Cron('5 0 * * *', {
    name: 'deactivateExpiredDiscounts',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleDeactivateExpiredDiscounts() {
    this.logger.log('Running job: Deactivate expired discounts...');
    const now = new Date();
    const result = await this.prisma.discount.updateMany({
      where: {
        isActive: true,
        endDate: {
          not: null,
          lt: now,
        },
      },
      data: {
        isActive: false,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Deactivated ${result.count} expired discount codes.`);
    } else {
      this.logger.log('No expired discounts to deactivate.');
    }
  }

  @Cron('*/15 * * * *', {
    name: 'autoCancelUnpaidVietQrOrders',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleAutoCancelUnpaidVietQrOrders() {
    this.logger.log('Running job: Auto-cancel unpaid VietQR orders...');
    const twoHoursAgo = dayjs().subtract(2, 'hour').toDate();
    const staleOrders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_CONFIRMATION,
        createdAt: { lt: twoHoursAgo },
        payments: {
          some: {
            status: PaymentStatus.PENDING,
            method: PaymentMethod.VIETQR,
          },
        },
      },
      select: { id: true, orderCode: true },
    });

    if (!staleOrders.length) {
      this.logger.log('No stale unpaid VietQR orders to cancel.');
      return;
    }

    const ids = staleOrders.map((o) => o.id);
    const result = await this.prisma.order.updateMany({
      where: { id: { in: ids } },
      data: { status: OrderStatus.CANCELED, canceledAt: new Date() },
    });

    this.logger.log(`Canceled ${result.count} unpaid VietQR orders.`);
  }
}
