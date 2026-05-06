import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async add(customerId: string, productId: string) {
    await this.prisma.product
      .findUniqueOrThrow({ where: { id: productId } })
      .catch(() => {
        throw new NotFoundException('Product not found');
      });

    const item = await this.prisma.wishlistItem.upsert({
      where: { customerId_productId: { customerId, productId } },
      update: {},
      create: { customerId, productId },
      include: { product: true },
    });

    return item;
  }

  async remove(customerId: string, productId: string) {
    await this.prisma.wishlistItem
      .delete({ where: { customerId_productId: { customerId, productId } } })
      .catch(() => {
        throw new NotFoundException('Wishlist item not found');
      });

    return { ok: true };
  }

  async list(customerId: string, params: { page?: number; limit?: number }) {
    const { page, limit, skip, take } = buildPagination(params.page, params.limit);

    const where = { customerId } as const;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wishlistItem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            include: {
              category: true,
              supplier: { select: { id: true, name: true } },
              brand: true,
            },
          },
        },
      }),
      this.prisma.wishlistItem.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async isWishlisted(customerId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: { customerId_productId: { customerId, productId } },
      select: { id: true },
    });
    return { isWishlisted: Boolean(item) };
  }
}
