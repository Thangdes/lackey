import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, OrderStatus, UserRole } from '@prisma/client';
import * as dayjs from 'dayjs';
import { GetSupplierOrdersDto } from './dto/get-supplier-orders.dto';

@Injectable()
export class SupplierDashboardService {
  constructor(private prisma: PrismaService) {}

  private getSupplierId(user: User): string | null {
    return user.supplierId ?? null;
  }

  async ordersCountLastNDays(user: User, days: number) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return { count: 0 };
    }
    const start = dayjs().startOf('day').subtract(days - 1, 'day').toDate();
    const count = await this.prisma.order.count({
      where: {
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING_SHIPMENT, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },
        OR: [
          { completedAt: { gte: start } },
          { createdAt: { gte: start } },
        ],
        orderItems: { some: { productVariant: { product: supplierId ? { supplierId } : {} } } },
      },
    });
    return { count };
  }

  async getSupplierProfile(user: User) {
    const supplierId = this.getSupplierId(user);
    if (!supplierId && user.role !== UserRole.ADMIN) {
      return null;
    }
    const s = await this.prisma.supplier.findUnique({
      where: { id: supplierId ?? undefined },
      select: {
        id: true,
        name: true,
        contactName: true,
        email: true,
        phone: true,
        address: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return s;
  }

  async revenueOverTime(user: User, days: number) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return [] as { date: string; revenue: number }[];
    }
    const start = dayjs().startOf('day').subtract(days - 1, 'day').toDate();
    const items = await this.prisma.orderItem.findMany({
      where: {
        order: {
          status: { in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING_SHIPMENT, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },
          OR: [
            { completedAt: { gte: start } },
            { createdAt: { gte: start } },
          ],
        },
        productVariant: { product: supplierId ? { supplierId } : {} },
      },
      select: {
        quantity: true,
        priceAtPurchase: true,
        order: { select: { createdAt: true, completedAt: true } },
      },
    });
    const map = new Map<string, number>();
    for (const it of items) {
      const d = dayjs(it.order.completedAt ?? it.order.createdAt).format('YYYY-MM-DD');
      const v = (map.get(d) || 0) + it.quantity * Number(it.priceAtPurchase);
      map.set(d, v);
    }
    const out: { date: string; revenue: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = dayjs(start).add(i, 'day').format('YYYY-MM-DD');
      out.push({ date: d, revenue: map.get(d) || 0 });
    }
    return out;
  }

  async restockCandidates(user: User, limit: number, lowThreshold: number) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return [] as { productId: string; variantId: string; productName: string; variantName: string; sku: string; stockQuantity: number; totalSold30d: number }[];
    }
    const variants = await this.prisma.productVariant.findMany({
      where: {
        product: supplierId ? { supplierId } : {},
        stockQuantity: { lte: lowThreshold },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        product: { select: { id: true, name: true } },
      },
      take: limit * 3,
    });
    if (variants.length === 0) return [];
    const start = dayjs().subtract(30, 'day').toDate();
    const sales = await this.prisma.orderItem.groupBy({
      by: ['productVariantId'],
      where: {
        productVariantId: { in: variants.map((v) => v.id) },
        order: { status: OrderStatus.COMPLETED, completedAt: { gte: start } },
      },
      _sum: { quantity: true },
    });
    const withSales = variants.map((v) => {
      const s = sales.find((x) => x.productVariantId === v.id);
      return {
        productId: v.product.id,
        variantId: v.id,
        productName: v.product.name,
        variantName: v.name,
        sku: v.sku,
        stockQuantity: v.stockQuantity ?? 0,
        totalSold30d: Number(s?._sum?.quantity || 0),
      };
    });
    return withSales
      .sort((a, b) => b.totalSold30d - a.totalSold30d)
      .slice(0, limit);
  }

  async getSummaryStats(user: User) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return { totalRevenue: 0, revenueThisMonth: 0, totalProducts: 0, pendingOrdersCount: 0 };
    }
    const startOfMonth = dayjs().startOf('month').toDate();

    const completedOrderItems = await this.prisma.orderItem.findMany({
      where: {
        productVariant: { product: supplierId ? { supplierId } : {} },
        order: { status: OrderStatus.COMPLETED },
      },
      select: {
        quantity: true,
        priceAtPurchase: true,
        order: { select: { completedAt: true } },
      },
    });

    let totalRevenue = 0;
    let revenueThisMonth = 0;

    for (const item of completedOrderItems) {
      const itemRevenue = item.quantity * Number(item.priceAtPurchase);
      totalRevenue += itemRevenue;
      if (dayjs(item.order.completedAt).isAfter(startOfMonth)) {
        revenueThisMonth += itemRevenue;
      }
    }

    const totalProducts = await this.prisma.product.count({
      where: supplierId ? { supplierId } : {},
    });
    const pendingOrdersCount = await this.prisma.order.count({
      where: {
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING_SHIPMENT] },
        orderItems: { some: { productVariant: { product: supplierId ? { supplierId } : {} } } },
      },
    });

    return {
      totalRevenue,
      revenueThisMonth,
      totalProducts,
      pendingOrdersCount,
    };
  }

  async getTopSellingProducts(user: User) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return [];
    }

    const productsSold = await this.prisma.orderItem.groupBy({
      by: ['productVariantId'],
      where: {
        productVariant: { product: supplierId ? { supplierId } : {} },
        order: { status: OrderStatus.COMPLETED },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topVariants = await this.prisma.productVariant.findMany({
      where: { id: { in: productsSold.map((p) => p.productVariantId) } },
      include: { product: { select: { name: true, thumbnailUrl: true } } },
    });

    return productsSold.map((p) => {
      const variantInfo = topVariants.find((v) => v.id === p.productVariantId);
      return {
        productName: variantInfo.product.name,
        variantName: variantInfo.name,
        totalSold: p._sum.quantity,
        thumbnailUrl: variantInfo.product.thumbnailUrl,
      };
    });
  }

  async getRecentOrders(user: User) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return [];
    }

    const orders = await this.prisma.order.findMany({
      where: {
        orderItems: { some: { productVariant: { product: supplierId ? { supplierId } : {} } } },
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderCode: true,
        status: true,
        createdAt: true,
        totalAmount: true,
        orderItems: {
          where: { productVariant: { product: supplierId ? { supplierId } : {} } },
          select: {
            quantity: true,
            priceAtPurchase: true,
            productVariant: {
              select: {
                name: true,
                product: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    // Compute supplier-only revenue and item count per order
    return orders.map((o) => {
      const supplierRevenue = (o.orderItems || []).reduce((sum, it) => sum + it.quantity * Number(it.priceAtPurchase), 0);
      const supplierItemCount = (o.orderItems || []).reduce((sum, it) => sum + it.quantity, 0);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orderItems, ...rest } = o;
      return {
        ...rest,
        supplierRevenue,
        supplierItemCount,
      } as any;
    });
  }

  async getInventoryReport(user: User) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return [];
    }

    return this.prisma.product.findMany({
      where: supplierId ? { supplierId } : {},
      select: {
        id: true,
        name: true,
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
          },
          orderBy: { stockQuantity: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getAllOrders(user: User, query: GetSupplierOrdersDto) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      return { data: [], meta: { total: 0, page: query.page, limit: query.limit, lastPage: 0 } };
    }
    const { page, limit, status, from, to } = query;

    const gte = from ? dayjs(from).startOf('day').toDate() : undefined;
    const lte = to ? dayjs(to).endOf('day').toDate() : undefined;

    const whereClause = {
      orderItems: {
        some: { productVariant: { product: supplierId ? { supplierId } : {} } },
      },
      status: status ? status : undefined,
      createdAt: gte || lte ? { gte, lte } : undefined,
    } as const;

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderCode: true,
          status: true,
          createdAt: true,
          orderItems: {
            where: { productVariant: { product: supplierId ? { supplierId } : {} } },
            select: {
              quantity: true,
              priceAtPurchase: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    const data = orders.map((order) => {
      const supplierRevenue = order.orderItems.reduce(
        (sum, item) => sum + item.quantity * Number(item.priceAtPurchase),
        0,
      );
      const supplierItemCount = order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { orderItems, ...rest } = order;
      return {
        ...rest,
        supplierRevenue,
        supplierItemCount,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getOrderDetails(user: User, orderId: string) {
    const supplierId = this.getSupplierId(user);
    if (supplierId === null && user.role !== UserRole.ADMIN) {
      throw new NotFoundException(`Order with ID ${orderId} not found or you don't have permission to view it.`);
    }

    const order = await this.prisma.order
      .findFirstOrThrow({
        where: {
          id: orderId,
          orderItems: {
            some: { productVariant: { product: supplierId ? { supplierId } : {} } },
          },
        },
        select: {
          id: true,
          orderCode: true,
          status: true,
          deliveryCode: true,
          notes: true,
          createdAt: true,
          confirmedAt: true,
          shippedAt: true,
          completedAt: true,
          canceledAt: true,
          shippingAddress: {
            select: {
              city: true,
              district: true,
              ward: true,
            },
          },
          payments: {
            select: {
              status: true,
              method: true,
            },
          },
          orderItems: {
            where: { productVariant: { product: supplierId ? { supplierId } : {} } },
            select: {
              quantity: true,
              priceAtPurchase: true,
              productVariant: {
                select: {
                  name: true,
                  sku: true,
                  product: {
                    select: {
                      name: true,
                      thumbnailUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException(
          `Order with ID ${orderId} not found or you don't have permission to view it.`,
        );
      });

    return order;
  }
}
