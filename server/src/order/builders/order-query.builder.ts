import { Prisma, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { QueryBuilder } from '../../common/builders/query.builder';

export interface OrderQueryParams {
  status?: OrderStatus;
  search?: string;
  code?: string;
  email?: string;
  deliveryCode?: string;
  isGuest?: string;
  fromDate?: string;
  toDate?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  customerId?: string;
  sort?: 'newest' | 'amount_desc' | 'amount_asc';
}

export class OrderQueryBuilder {
  static buildWhereClause(params: OrderQueryParams): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { orderCode: { contains: params.search, mode: 'insensitive' } },
        { customer: { fullName: { contains: params.search, mode: 'insensitive' } } },
        { customer: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.code) {
      where.orderCode = { contains: params.code, mode: 'insensitive' } as any;
    }

    if (params.email) {
      where.customer = {
        ...(where.customer as any),
        email: { contains: params.email, mode: 'insensitive' },
      } as any;
    }

    if (params.deliveryCode) {
      where.deliveryCode = { contains: params.deliveryCode, mode: 'insensitive' } as any;
    }

    if (typeof params.isGuest === 'string') {
      const wantGuest = params.isGuest.toLowerCase() === 'true';
      where.customer = {
        ...(where.customer as any),
        user: wantGuest ? { is: null } : { isNot: null },
      } as any;
    }

    const dateCondition = QueryBuilder.buildDateRangeCondition(
      'createdAt',
      params.fromDate,
      params.toDate,
    );
    if (dateCondition) {
      Object.assign(where, dateCondition);
    }

    if (params.paymentStatus) {
      where.payments = { some: { status: params.paymentStatus } };
    }

    if (params.paymentMethod) {
      where.payments = { some: { method: params.paymentMethod } };
    }

    if (params.customerId) {
      where.customerId = params.customerId;
    }

    return where;
  }

  static buildOrderBy(sort?: string): any {
    switch (sort) {
      case 'amount_desc':
        return { totalAmount: 'desc' };
      case 'amount_asc':
        return { totalAmount: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  static buildInclude(): any {
    return {
      customer: {
        select: {
          id: true,
          fullName: true,
          email: true,
          user: { select: { id: true } },
        },
      },
      payments: {
        select: { method: true, status: true, paidAt: true },
        orderBy: { paidAt: 'desc' as any },
      },
    };
  }

  static mapOrderResponse(orders: any[]) {
    return orders.map((o) => {
      const primaryPayment = (o.payments || [])[0];
      const paymentMethod = primaryPayment?.method;
      const isGuest = !o.customer?.user?.id;
      return {
        ...o,
        paymentMethod,
        isGuest,
      };
    });
  }
}
