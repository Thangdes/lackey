import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { BaseRepository } from '@/infrastructure/common/base/base.repository';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(prisma: PrismaService) {
    super(prisma, 'order');
  }

  async findByCode(orderCode: string) {
    return this.model.findFirst({
      where: { orderCode },
      include: {
        customer: { select: { fullName: true, email: true } },
        shippingAddress: true,
        orderItems: {
          include: {
            productVariant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
        payments: true,
      },
    });
  }

  async findByCustomer(
    customerId: string,
    where?: Prisma.OrderWhereInput,
    skip?: number,
    take?: number,
  ) {
    return this.model.findMany({
      where: { ...where, customerId },
      skip,
      take,
      include: { orderItems: { include: { productVariant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmailOrPhone(email?: string, phone?: string) {
    const orConditions: Prisma.OrderWhereInput[] = [];

    if (email) {
      orConditions.push({
        customer: { email: { equals: email, mode: 'insensitive' } },
      });
    }

    if (phone) {
      orConditions.push({ customer: { phone } });
      orConditions.push({ shippingAddress: { phoneNumber: phone } });
    }

    return this.model.findMany({
      where: { OR: orConditions },
      include: {
        customer: { select: { fullName: true, email: true, phone: true } },
        shippingAddress: true,
        orderItems: {
          include: {
            productVariant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async findOneWithDetails(orderId: string, customerId?: string) {
    const where: any = { id: orderId };
    if (customerId) {
      where.customerId = customerId;
    }

    return this.model.findUnique({
      where,
      include: {
        customer: {
          select: { fullName: true, email: true, phone: true },
        },
        shippingAddress: true,
        orderItems: {
          include: {
            productVariant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
        payments: true,
        discount: true,
      },
    });
  }

  async updateStatus(orderId: string, statusData: any) {
    return this.model.update({
      where: { id: orderId },
      data: statusData,
    });
  }

  async updateDeliveryInfo(orderId: string, deliveryCode: string) {
    return this.model.update({
      where: { id: orderId },
      data: {
        deliveryCode,
        status: 'SHIPPED',
        shippedAt: new Date(),
      },
    });
  }
}
