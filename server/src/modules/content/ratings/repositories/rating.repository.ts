import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { BaseRepository } from '@/infrastructure/common/base/base.repository';
import { Rating, Prisma } from '@prisma/client';

@Injectable()
export class RatingRepository extends BaseRepository<Rating> {
  constructor(prisma: PrismaService) {
    super(prisma, 'rating');
  }

  async findForProduct(productId: string) {
    return this.model.findMany({
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
    where: Prisma.RatingWhereInput,
    orderBy: any,
    skip: number,
    take: number,
  ) {
    return this.prisma.$transaction([
      this.model.findMany({
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
      this.model.count({ where }),
    ]);
  }

  async findAllAdminPaginated(
    where: Prisma.RatingWhereInput | undefined,
    skip: number,
    take: number,
  ) {
    return this.prisma.$transaction([
      this.model.findMany({
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
      this.model.count({ where }),
    ]);
  }

  async aggregateForProduct(productId: string) {
    return this.model.aggregate({
      _avg: { ratingValue: true },
      _count: { ratingValue: true },
      where: { productId },
    });
  }

  async createRating(data: Prisma.RatingCreateInput) {
    return this.model.create({ data });
  }

  async updateProductRating(productId: string, ratingAvg: number, ratingCount: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { ratingAvg, ratingCount },
    });
  }
}
