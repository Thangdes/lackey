import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { buildPagination, buildPaginationMeta, PaginatedResult } from 'src/common/pagination';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, createRatingDto: CreateRatingDto) {
    const { orderId, productId, productVariantId, ratingValue, comment } =
      createRatingDto;

    const validOrder = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        status: OrderStatus.COMPLETED,
        orderItems: {
          some: { productVariantId: productVariantId },
        },
      },
    });

    if (!validOrder) {
      throw new BadRequestException(
        'You can only rate products you have purchased and received.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const newRating = await tx.rating.create({
        data: {
          customerId,
          productId,
          productVariantId,
          orderId,
          ratingValue,
          comment,
        },
      });

      const aggregates = await tx.rating.aggregate({
        _avg: { ratingValue: true },
        _count: { ratingValue: true },
        where: { productId },
      });

      await tx.product.update({
        where: { id: productId },
        data: {
          ratingAvg: aggregates._avg.ratingValue || 0,
          ratingCount: aggregates._count.ratingValue || 0,
        },
      });

      return newRating;
    });
  }

  async findForProduct(productId: string) {
    return this.prisma.rating.findMany({
      where: { productId },
      include: {
        customer: {
          select: {
            fullName: true,
            user: { select: { avatar: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findForProductPaginated(
    productId: string,
    query: { page?: number; limit?: number; minRating?: number; sort?: 'newest' | 'highest' | 'lowest' },
  ): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where: Prisma.RatingWhereInput = {
      productId,
      ratingValue: query.minRating ? { gte: query.minRating } : undefined,
    };
    let orderBy: any = { createdAt: 'desc' };
    switch (query.sort) {
      case 'highest':
        orderBy = [{ ratingValue: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'lowest':
        orderBy = [{ ratingValue: 'asc' }, { createdAt: 'desc' }];
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.rating.findMany({
        where,
        include: {
          customer: {
            select: {
              fullName: true,
              user: { select: { avatar: true } },
            },
          },
          productVariant: { select: { name: true, sku: true } },
        },
        orderBy,
        skip,
        take,
      }),
      this.prisma.rating.count({ where }),
    ]);
    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findAllAdmin(params: { page: number; limit: number; search: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(params.page, params.limit);
    const search = params.search?.trim();
    const where: Prisma.RatingWhereInput | undefined = search
      ? {
          OR: [
            { comment: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { product: { is: { name: { contains: search, mode: Prisma.QueryMode.insensitive } } } },
            { customer: { is: { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } } } },
          ],
        }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.rating.findMany({
        where,
        include: {
          customer: { select: { fullName: true, id: true } },
          product: { select: { name: true, id: true, slug: true } },
          productVariant: { select: { name: true, id: true, sku: true } },
          order: { select: { id: true, orderCode: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.rating.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const rating = await tx.rating.delete({ where: { id } });

      const aggregates = await tx.rating.aggregate({
        _avg: { ratingValue: true },
        _count: { ratingValue: true },
        where: { productId: rating.productId },
      });

      await tx.product.update({
        where: { id: rating.productId },
        data: {
          ratingAvg: aggregates._avg.ratingValue || 0,
          ratingCount: aggregates._count.ratingValue || 0,
        },
      });

      return { success: true };
    });
  }
}
