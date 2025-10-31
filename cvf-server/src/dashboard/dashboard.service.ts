import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(query: DashboardQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const orderAggregates = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      _count: { id: true },
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const newCustomersCount = await this.prisma.customer.count({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    const revenue = orderAggregates._sum.totalAmount || 0;
    const totalOrders = orderAggregates._count.id || 0;
    const averageOrderValue =
      totalOrders > 0 ? Number(revenue) / totalOrders : 0;

    return {
      revenue: Number(revenue),
      totalOrders,
      newCustomersCount,
      averageOrderValue,
    };
  }

  async getRevenueOverTime(query: DashboardQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const group = (query.groupBy ?? 'day').toLowerCase();
    const granularity = group === 'week' ? 'week' : group === 'month' ? 'month' : 'day';

    const sql = `
      SELECT DATE_TRUNC('${granularity}', "created_at")::DATE as date, SUM("total_amount") as revenue
      FROM "orders"
      WHERE "status" = 'COMPLETED' AND "created_at" BETWEEN $1 AND $2
      GROUP BY date
      ORDER BY date ASC;
    `;

    const results: { date: Date; revenue: any }[] = await this.prisma.$queryRawUnsafe(sql, startDate, endDate);

    return results.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue ?? 0),
    }));
  }

  async getTopProducts(query: DashboardQueryDto) {
    const { startDate, endDate } = this.getDateRange(query);

    const topProductsByQuantity = await this.prisma.orderItem.groupBy({
      by: ['productVariantId'],
      _sum: { quantity: true },
      where: {
        order: {
          status: OrderStatus.COMPLETED,
          createdAt: { gte: startDate, lte: endDate },
        },
      },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const variantIds = topProductsByQuantity.map(
      (item) => item.productVariantId,
    );
    const variantsInfo = await this.prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { name: true, thumbnailUrl: true } } },
    });

    return topProductsByQuantity.map((item) => {
      const info = variantsInfo.find((v) => v.id === item.productVariantId);
      return {
        productName: `${info.product.name} - ${info.name}`,
        thumbnailUrl: info.product.thumbnailUrl,
        totalQuantity: item._sum.quantity,
      };
    });
  }

  private getDateRange(query: DashboardQueryDto) {
    const startDate = query.startDate
      ? dayjs(query.startDate).startOf('day').toDate()
      : dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = query.endDate
      ? dayjs(query.endDate).endOf('day').toDate()
      : dayjs().endOf('day').toDate();
    return { startDate, endDate };
  }
}
