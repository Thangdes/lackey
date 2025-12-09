import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '@/infrastructure/common/pagination';
import { RatingRepository } from './repositories/rating.repository';

@Injectable()
export class RatingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratingRepository: RatingRepository,
  ) {}

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
      const newRating = await this.ratingRepository.createRating({
        customer: { connect: { id: customerId } },
        product: { connect: { id: productId } },
        productVariant: { connect: { id: productVariantId } },
        order: { connect: { id: orderId } },
        ratingValue,
        comment,
      });

      const aggregates = await this.ratingRepository.aggregateForProduct(productId);

      await this.ratingRepository.updateProductRating(
        productId,
        aggregates._avg.ratingValue || 0,
        aggregates._count.ratingValue || 0,
      );

      return newRating;
    });
  }

  async findForProduct(productId: string) {
    return this.ratingRepository.findForProduct(productId);
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
    const [items, total] = await this.ratingRepository.findForProductPaginated(
      productId,
      where,
      orderBy,
      skip,
      take,
    );
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

    const [items, total] = await this.ratingRepository.findAllAdminPaginated(
      where,
      skip,
      take,
    );

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const rating = await this.ratingRepository.delete(id);

      const aggregates = await this.ratingRepository.aggregateForProduct(
        rating.productId,
      );

      await this.ratingRepository.updateProductRating(
        rating.productId,
        aggregates._avg.ratingValue || 0,
        aggregates._count.ratingValue || 0,
      );

      return { success: true };
    });
  }
}
