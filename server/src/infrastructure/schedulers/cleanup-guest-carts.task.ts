import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/infrastructure/database/prisma.service';

@Injectable()
export class CleanupGuestCartsTask {
  private readonly logger = new Logger(CleanupGuestCartsTask.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Chạy mỗi ngày lúc 3:00 AM để xóa guest cart items cũ hơn 30 ngày
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldGuestCarts() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.prisma.cartItem.deleteMany({
        where: {
          guestCartId: { not: null },
          customerId: null,
          createdAt: { lt: thirtyDaysAgo },
        },
      });

      this.logger.log(
        `Cleaned up ${result.count} old guest cart items (older than 30 days)`,
      );
    } catch (error) {
      this.logger.error('Failed to cleanup old guest carts', error);
    }
  }

  /**
   * Chạy mỗi giờ để xóa guest cart items bị orphaned (không có variant)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOrphanedGuestCarts() {
    try {
      // Tìm các cart items có productVariantId không tồn tại
      const orphanedItems = await this.prisma.cartItem.findMany({
        where: {
          guestCartId: { not: null },
          customerId: null,
        },
        select: {
          id: true,
          productVariantId: true,
        },
      });

      const variantIds = orphanedItems.map((item) => item.productVariantId);
      const existingVariants = await this.prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true },
      });

      const existingVariantIds = new Set(
        existingVariants.map((v) => v.id),
      );

      const orphanedIds = orphanedItems
        .filter((item) => !existingVariantIds.has(item.productVariantId))
        .map((item) => item.id);

      if (orphanedIds.length > 0) {
        const result = await this.prisma.cartItem.deleteMany({
          where: { id: { in: orphanedIds } },
        });

        this.logger.log(
          `Cleaned up ${result.count} orphaned guest cart items`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to cleanup orphaned guest carts', error);
    }
  }

  /**
   * Manual cleanup method - có thể gọi từ admin endpoint
   */
  async manualCleanup(daysOld: number = 30): Promise<{ deleted: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.cartItem.deleteMany({
      where: {
        guestCartId: { not: null },
        customerId: null,
        createdAt: { lt: cutoffDate },
      },
    });

    this.logger.log(
      `Manual cleanup: Deleted ${result.count} guest cart items older than ${daysOld} days`,
    );

    return { deleted: result.count };
  }

  /**
   * Lấy thống kê về guest carts
   */
  async getGuestCartStats() {
    const [total, oldItems, uniqueGuests] = await Promise.all([
      this.prisma.cartItem.count({
        where: {
          guestCartId: { not: null },
          customerId: null,
        },
      }),
      this.prisma.cartItem.count({
        where: {
          guestCartId: { not: null },
          customerId: null,
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      this.prisma.cartItem.findMany({
        where: {
          guestCartId: { not: null },
          customerId: null,
        },
        select: { guestCartId: true },
        distinct: ['guestCartId'],
      }),
    ]);

    return {
      totalGuestCartItems: total,
      oldGuestCartItems: oldItems,
      uniqueGuestCarts: uniqueGuests.length,
    };
  }
}
