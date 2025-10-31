import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { OrderStatus, Prisma, PaymentStatus, PaymentMethod, PaymentEventType } from '@prisma/client';
import { ShippingService } from '../shipping/shipping.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from 'src/common/pagination';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private shippingService: ShippingService,
    private mailService: MailService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
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

    const subtotalAmount = cartItems.reduce((acc, item) => {
      const price =
        item.productVariant.discountPrice || item.productVariant.price;
      return acc + Number(price) * item.quantity;
    }, 0);

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
          orderCode: `CVF-${Date.now()}`,
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
        
        const price = Number(item.productVariant.price);
        const discountPrice = item.productVariant.discountPrice 
          ? Number(item.productVariant.discountPrice) 
          : null;
        
        const effectivePrice = 
          discountPrice && discountPrice > 0 && discountPrice < price
            ? discountPrice
            : price;
        
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: effectivePrice,
          },
        });
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

      if (createOrderDto.paymentMethod === PaymentMethod.COD) {
        await tx.cartItem.deleteMany({ where: cartIdentifier });
      }

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
      await this.notificationsQueue.add(
        'send-new-order-telegram',
        { orderId: finalOrder.id },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: 1000,
        },
      );
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
    isGuest?: string; // 'true' | 'false'
  }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const { status, search, fromDate, toDate, paymentStatus, paymentMethod, customerId } = query;
    const whereClause: Prisma.OrderWhereInput = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (query.code) {
      // allow partial match for admin find
      whereClause.orderCode = { contains: query.code, mode: 'insensitive' } as any;
    }
    if (query.email) {
      whereClause.customer = { ...(whereClause.customer as any), email: { contains: query.email, mode: 'insensitive' } } as any;
    }
    if (query.deliveryCode) {
      whereClause.deliveryCode = { contains: query.deliveryCode, mode: 'insensitive' } as any;
    }
    if (typeof query.isGuest === 'string') {
      const wantGuest = query.isGuest.toLowerCase() === 'true';
      whereClause.customer = {
        ...(whereClause.customer as any),
        user: wantGuest ? { is: null } : { isNot: null },
      } as any;
    }
    if (fromDate || toDate) {
      whereClause.createdAt = {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      } as any;
    }
    if (paymentStatus) {
      whereClause.payments = { some: { status: paymentStatus } };
    }
    if (paymentMethod) {
      whereClause.payments = { some: { method: paymentMethod } };
    }
    if (customerId) {
      whereClause.customerId = customerId;
    }

    let orderBy: any = { createdAt: 'desc' };
    switch (query.sort) {
      case 'amount_desc':
        orderBy = { totalAmount: 'desc' };
        break;
      case 'amount_asc':
        orderBy = { totalAmount: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          customer: { select: { id: true, fullName: true, email: true, user: { select: { id: true } } } },
          payments: { select: { method: true, status: true, paidAt: true }, orderBy: { paidAt: 'desc' } },
        },
        orderBy,
      }),
      this.prisma.order.count({ where: whereClause }),
    ]);

    // Map extra fields for client convenience
    const mapped = orders.map((o) => {
      const primaryPayment = (o.payments || [])[0];
      const paymentMethod = primaryPayment?.method;
      const isGuest = !o.customer?.user?.id;
      return {
        ...o,
        paymentMethod,
        isGuest,
      };
    });

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
    // Rebuild where and sorting consistent with findAll
    const { status, search, fromDate, toDate, paymentStatus, paymentMethod, customerId } = query;
    const whereClause: Prisma.OrderWhereInput = {};
    if (status) whereClause.status = status;
    if (search) {
      whereClause.OR = [
        { orderCode: { contains: search, mode: 'insensitive' } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (fromDate || toDate) {
      whereClause.createdAt = {
        gte: fromDate ? new Date(fromDate) : undefined,
        lte: toDate ? new Date(toDate) : undefined,
      } as any;
    }
    if (paymentStatus) whereClause.payments = { some: { status: paymentStatus } };
    if (paymentMethod) whereClause.payments = { some: { method: paymentMethod } };
    if (customerId) whereClause.customerId = customerId;

    let orderBy: any = { createdAt: 'desc' };
    switch (query.sort) {
      case 'amount_desc':
        orderBy = { totalAmount: 'desc' };
        break;
      case 'amount_asc':
        orderBy = { totalAmount: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

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
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: {
            fullName: true,
            email: true,
            phone: true,
          },
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

    if (!order) throw new NotFoundException('Order not found');
    if (customerId && order.customerId !== customerId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByCode(orderCode: string) {
    const order = await this.prisma.order.findFirst({
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

    const orConditions: Prisma.OrderWhereInput[] = [];

    if (email) {
      orConditions.push({
        customer: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });
    }

    if (phone) {
      orConditions.push({
        customer: {
          phone: phone,
        },
      });
      orConditions.push({
        shippingAddress: {
          phoneNumber: phone,
        },
      });
    }

    const orders = await this.prisma.order.findMany({
      where: {
        OR: orConditions,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

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

    return this.prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });
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
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryCode: deliveryCode,
        status: OrderStatus.SHIPPED,
        shippedAt: new Date(),
      },
    });
    this.mailService
      .sendOrderShippedEmail(order.customer.email, {
        orderCode: updatedOrder.orderCode,
        deliveryCode: updatedOrder.deliveryCode,
        fullName: order.customer.fullName,
      })
      .catch((err) => {
        console.error(
          `Failed to send shipped notification email for order ${order.orderCode}`,
          err,
        );
      });

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

    await this.notificationsQueue.add(
      'send-new-order-telegram',
      { orderId: order.id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    );
    return { ok: true };
  }
}
