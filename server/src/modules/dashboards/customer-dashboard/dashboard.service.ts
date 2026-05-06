import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
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

    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
    });

    const bucket = (d: Date) => {
      const base = dayjs(d);
      if (granularity === 'week') return base.startOf('week').toDate();
      if (granularity === 'month') return base.startOf('month').toDate();
      return base.startOf('day').toDate();
    };

    const revenueByDate = new Map<number, number>();
    for (const o of orders) {
      const k = bucket(o.createdAt).getTime();
      const prev = revenueByDate.get(k) ?? 0;
      revenueByDate.set(k, prev + Number(o.totalAmount ?? 0));
    }

    return Array.from(revenueByDate.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([ts, revenue]) => ({
        date: new Date(ts),
        revenue,
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
