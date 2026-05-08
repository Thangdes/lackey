import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { InventoryMovementType, OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';
import { CreateInventoryMovementDto } from './dto/create-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(dto: CreateInventoryMovementDto, actorUserId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: dto.productVariantId } });
    if (!variant) throw new NotFoundException('Product variant not found');

    const updatedVariant = await this.prisma.$transaction(async (tx) => {
      // Apply stock change
      if (dto.type === InventoryMovementType.IN) {
        await tx.productVariant.update({
          where: { id: dto.productVariantId },
          data: { stockQuantity: { increment: dto.quantity } },
        });
      } else if (dto.type === InventoryMovementType.OUT) {
        // Sử dụng atomic operation với check để tránh race condition
        const updateResult = await tx.productVariant.updateMany({
          where: { 
            id: dto.productVariantId,
            stockQuantity: { gte: dto.quantity }
          },
          data: { stockQuantity: { decrement: dto.quantity } },
        });
        
        if (updateResult.count === 0) {
          const current = await tx.productVariant.findUnique({
            where: { id: dto.productVariantId },
            select: { stockQuantity: true }
          });
          throw new BadRequestException(
            `Not enough stock. Available: ${current?.stockQuantity || 0}, Requested: ${dto.quantity}`
          );
        }
      } else {
        // ADJUST: interpret quantity as delta (+/-)
        if (variant.stockQuantity + dto.quantity < 0) {
          throw new BadRequestException('Stock cannot become negative');
        }
        await tx.productVariant.update({
          where: { id: dto.productVariantId },
          data: { stockQuantity: { increment: dto.quantity } },
        });
      }

      await tx.inventoryMovement.create({
        data: {
          productVariantId: dto.productVariantId,
          type: dto.type,
          quantity: dto.quantity,
          note: dto.note,
          createdByUserId: actorUserId,
        },
      });

      return tx.productVariant.findUnique({ where: { id: dto.productVariantId }, include: { product: true } });
    });

    return updatedVariant;
  }

  async listMovements(params: { page?: number; limit?: number; productVariantId?: string }) {
    const { page, limit, skip, take } = buildPagination(params.page, params.limit);

    const where: any = {};
    if (params.productVariantId) where.productVariantId = params.productVariantId;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.inventoryMovement.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          productVariant: { include: { product: true } },
          createdByUser: { select: { id: true, username: true, role: true } },
        },
      }),
      this.prisma.inventoryMovement.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async getReservedStock(productVariantId: string) {
    // Reserved = sum quantities for VIETQR pending payments where order still pending confirmation
    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_CONFIRMATION,
        payments: {
          some: {
            method: PaymentMethod.VIETQR,
            status: PaymentStatus.PENDING,
          },
        },
        orderItems: { some: { productVariantId } },
      },
      include: { orderItems: true },
    });

    const reserved = orders.reduce((sum, o) => {
      const line = (o.orderItems || []).filter((i) => i.productVariantId === productVariantId);
      const q = line.reduce((s, i) => s + (i.quantity || 0), 0);
      return sum + q;
    }, 0);

    return { productVariantId, reservedStock: reserved };
  }

  async getVariantSummary(productVariantId: string) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: productVariantId }, include: { product: true } });
    if (!variant) throw new NotFoundException('Product variant not found');

    const reserved = await this.getReservedStock(productVariantId);
    const available = Math.max(0, (variant.stockQuantity || 0) - reserved.reservedStock);

    return {
      productVariantId,
      productId: variant.productId,
      stockQuantity: variant.stockQuantity,
      reservedStock: reserved.reservedStock,
      availableStock: available,
    };
  }
}
