import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderShippedEvent } from '@/infrastructure/events/commerce.events';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus, PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';
import { ShippingService } from '../shipping/shipping.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '@/infrastructure/common/pagination';

import { OrderRepository } from './repositories/order.repository';
import { OrderCalculator } from './calculators/order.calculator';
import { OrderQueryBuilder } from './builders/order-query.builder';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderRepository: OrderRepository,
    private readonly shippingService: ShippingService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerId, guestCartId, discountCode } = createOrderDto;
    const cartIdentifier = customerId ? { customerId } : { guestCartId };
    const cartItems = await this.prisma.cartItem.findMany({
      where: cartIdentifier,
      include: { productVariant: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    let finalCustomerId: string;
    if (customerId) {
      finalCustomerId = customerId;
    } else {
      const { email, fullName, phone } = createOrderDto;
      if (!email || !fullName || !phone) {
        throw new BadRequestException(
          'Guest customer information is required.',
        );
      }
      const customer = await this.prisma.customer.upsert({
        where: { email },
        update: {},
        create: { email, fullName, phone },
      });
      finalCustomerId = customer.id;
    }

    let addressForFeeCalc: { city: string; district: string; ward: string };

    if (createOrderDto.shippingAddressId) {
      const existingAddress = await this.prisma.address.findUnique({
        where: { id: createOrderDto.shippingAddressId },
      });
      if (!existingAddress) {
        throw new NotFoundException('Saved address not found.');
      }
      addressForFeeCalc = {
        city: existingAddress.city,
        district: existingAddress.district,
        ward: existingAddress.ward,
      };
    } else {
      const { city, district, ward } = createOrderDto;
      if (!city || !district || !ward) {
        throw new BadRequestException(
          'City, District, and Ward are required for a new address.',
        );
      }
      addressForFeeCalc = { city, district, ward };
    }

    const subtotalAmount = OrderCalculator.calculateSubtotal(cartItems);

    const shippingFee = createOrderDto.shippingFee;

    const finalOrder = await this.prisma.$transaction(async (tx) => {
      let finalAddressId: string;

      if (createOrderDto.shippingAddressId) {
        const address = await tx.address
          .findFirstOrThrow({
            where: {
              id: createOrderDto.shippingAddressId,
              customerId: finalCustomerId,
            },
          })
          .catch(() => {
            throw new NotFoundException(
              'Saved address not found for this customer.',
            );
          });
        finalAddressId = address.id;
      } else {
        const { recipientName, phoneNumber, street, ward, district, city } =
          createOrderDto;
        if (
          !recipientName ||
          !phoneNumber ||
          !street ||
          !ward ||
          !district ||
          !city
        ) {
          throw new BadRequestException(
            'Full new address information is required.',
          );
        }
        const newAddress = await tx.address.create({
          data: {
            customerId: finalCustomerId,
            recipientName,
            phoneNumber,
            street,
            ward,
            district,
            city,
            fullAddress: `${street}, ${ward}, ${district}, ${city}`,
          },
        });
        finalAddressId = newAddress.id;
      }

      let discountAmount = 0;
      let discountId: string | null = null;
      if (discountCode) {
        const now = new Date();
        const discount = await tx.discount.findFirst({
          where: {
            code: discountCode,
            isActive: true,
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        });

        if (!discount) {
          throw new BadRequestException('Invalid or expired discount code.');
        }
        if (discount.minAmount && subtotalAmount < Number(discount.minAmount)) {
          throw new BadRequestException(
            `Order subtotal must be at least ${discount.minAmount} to use this code.`,
          );
        }
        if (discount.type === 'FIXED_AMOUNT') {
          discountAmount = Number(discount.value);
        } else if (discount.type === 'PERCENTAGE') {
          discountAmount = (subtotalAmount * Number(discount.value)) / 100;
        }
        discountAmount = Math.min(discountAmount, subtotalAmount);
        discountId = discount.id;
      }

      const totalAmount = subtotalAmount + shippingFee - discountAmount;

      const order = await tx.order.create({
        data: {
          customerId: finalCustomerId,
          shippingAddressId: finalAddressId,
          orderCode: `LK-${Date.now()}`,
          status: OrderStatus.PENDING_CONFIRMATION,
          subtotalAmount,
          shippingFee,
          totalAmount,
          notes: createOrderDto.notes,
          discountId,
          discountAmount,
        },
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          method: createOrderDto.paymentMethod,
          amount: totalAmount,
          status: PaymentStatus.PENDING,
        },
      });

      for (const item of cartItems) {
        if (item.productVariant.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${item.productVariant.name}`,
          );
        }
        
        const effectivePrice = OrderCalculator.getEffectivePrice(
          item.productVariant.price,
          item.productVariant.discountPrice,
        );
        
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: effectivePrice,
          },
        });
        
        // Giảm stock cho COD ngay lập tức
        if (createOrderDto.paymentMethod === PaymentMethod.COD) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Xóa cart items sau khi tạo order thành công (cho cả COD và VIETQR)
      await tx.cartItem.deleteMany({ where: cartIdentifier });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          customer: true,
          shippingAddress: true,
          orderItems: { include: { productVariant: true } },
          payments: true,
        },
      });
    });

    if (finalOrder) {
      this.eventEmitter.emit('order.created', new OrderCreatedEvent(finalOrder.id));
    }

    return finalOrder;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
    fromDate?: string;
    toDate?: string;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    customerId?: string;
    sort?: 'newest' | 'amount_desc' | 'amount_asc';
    code?: string;
    email?: string;
    deliveryCode?: string;
    isGuest?: string;
  }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const whereClause = OrderQueryBuilder.buildWhereClause(query);
    const orderBy = OrderQueryBuilder.buildOrderBy(query.sort);
    const include = OrderQueryBuilder.buildInclude();

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip,
        take,
        where: whereClause,
        include,
        orderBy,
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    const mapped = OrderQueryBuilder.mapOrderResponse(orders);
    return { data: mapped, meta: buildPaginationMeta(total, page, limit) };
  }

  async exportOrdersCsv(query: {
    status?: OrderStatus;
    search?: string;
    fromDate?: string;
    toDate?: string;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    customerId?: string;
    sort?: 'newest' | 'amount_desc' | 'amount_asc';
  }): Promise<string> {
    const whereClause = OrderQueryBuilder.buildWhereClause(query);
    const orderBy = OrderQueryBuilder.buildOrderBy(query.sort);

    const items = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        customer: { select: { fullName: true, email: true } },
        payments: { select: { status: true, method: true, amount: true, paidAt: true } },
      },
      orderBy,
    });

    const headers = [
      'Order Code',
      'Status',
      'Customer Name',
      'Customer Email',
      'Subtotal',
      'Shipping Fee',
      'Discount Amount',
      'Total Amount',
      'Payment Method(s)',
      'Payment Status(es)',
      'Created At',
    ];
    const lines = [headers.join(',')];
    for (const o of items) {
      const paymentMethods = (o.payments || []).map((p) => p.method).join('|');
      const paymentStatuses = (o.payments || []).map((p) => p.status).join('|');
      const row = [
        o.orderCode,
        o.status,
        o.customer?.fullName ?? '',
        o.customer?.email ?? '',
        String(o.subtotalAmount),
        String(o.shippingFee),
        String(o.discountAmount ?? 0),
        String(o.totalAmount),
        paymentMethods,
        paymentStatuses,
        o.createdAt.toISOString(),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',');
      lines.push(row);
    }
    return lines.join('\n');
  }

  async findMyOrdersPaginated(
    customerId: string,
    query: { page?: number; limit?: number; status?: OrderStatus; search?: string; fromDate?: string; toDate?: string },
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where: Prisma.OrderWhereInput = { customerId, status: query.status || undefined };
    if (query.search) {
      where.OR = [
        { orderCode: { contains: query.search, mode: 'insensitive' } },
        { customer: { fullName: { contains: query.search, mode: 'insensitive' } } },
        { customer: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }
    if (query.fromDate || query.toDate) {
      where.createdAt = {
        gte: query.fromDate ? new Date(query.fromDate) : undefined,
        lte: query.toDate ? new Date(query.toDate) : undefined,
      } as any;
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: { orderItems: { include: { productVariant: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(orderId: string, customerId?: string) {
    const order = await this.orderRepository.findOneWithDetails(orderId, customerId);
    if (!order) throw new NotFoundException('Order not found');
    if (customerId && order.customerId !== customerId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByCode(orderCode: string) {
    const order = await this.orderRepository.findByCode(orderCode);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async lookupOrders(params: { email?: string; phone?: string }) {
    const { email, phone } = params;

    if (!email && !phone) {
      throw new BadRequestException(
        'Email or phone number is required for lookup.',
      );
    }

    const orders = await this.orderRepository.findByEmailOrPhone(email, phone);

    if (orders.length === 0) {
      throw new NotFoundException(
        'No orders found with the provided information.',
      );
    }

    return orders;
  }

  async updateStatus(orderId: string, updateDto: UpdateOrderStatusDto) {
    await this.findOne(orderId);
    const { status } = updateDto;
    if (status === OrderStatus.SHIPPED) {
      throw new BadRequestException(
        'Use the update delivery code endpoint to mark an order as shipped.',
      );
    }
    const updateData: any = { status };

    switch (status) {
      case OrderStatus.CONFIRMED:
        updateData.confirmedAt = new Date();
        break;
      case OrderStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
      case OrderStatus.CANCELED:
        updateData.canceledAt = new Date();
        break;
    }

    if (status === OrderStatus.COMPLETED) {
      const orderItems = await this.prisma.orderItem.findMany({
        where: { orderId },
        include: { productVariant: true },
      });
      await this.prisma.$transaction(
        orderItems.map((item) =>
          this.prisma.product.update({
            where: { id: item.productVariant.productId },
            data: {
              buyCount: {
                increment: item.quantity,
              },
            },
          }),
        ),
      );
      updateData.completedAt = new Date();
    }

    return this.orderRepository.updateStatus(orderId, updateData);
  }
  async updateDeliveryCode(orderId: string, deliveryCode: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID '${orderId}' not found.`);
    }
    if (
      order.status !== OrderStatus.CONFIRMED &&
      order.status !== OrderStatus.PREPARING_SHIPMENT
    ) {
      throw new BadRequestException(
        `Order must be in CONFIRMED or PREPARING_SHIPMENT status to add a delivery code.`,
      );
    }
    const updatedOrder = await this.orderRepository.updateDeliveryInfo(
      orderId,
      deliveryCode,
    );
    this.eventEmitter.emit(
      'order.shipped',
      new OrderShippedEvent(
        order.customer.email,
        updatedOrder.orderCode,
        updatedOrder.deliveryCode,
        order.customer.fullName,
      )
    );

    return updatedOrder;
  }

  async prepareForShipment(orderId: string) {
    const order = await this.findOne(orderId);

    if (order.status !== OrderStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('Order is not pending confirmation.');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PREPARING_SHIPMENT,
        confirmedAt: new Date(),
      },
    });
  }

  async cancelPending(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING_CONFIRMATION) {
      throw new BadRequestException('Only orders pending confirmation can be canceled.');
    }
    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CANCELED, canceledAt: new Date() },
    });
    await this.prisma.payment.updateMany({
      where: { orderId, status: PaymentStatus.PENDING },
      data: { status: PaymentStatus.FAILED },
    });
    return updated;
  }

  // For VIETQR flow: user presses submit after creating an order earlier.
  // We notify Telegram at this point (idempotent from queue consumer side).
  async markPlaced(orderId: string): Promise<{ ok: boolean }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, payments: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    this.eventEmitter.emit('order.created', new OrderCreatedEvent(order.id));
    return { ok: true };
  }
}
