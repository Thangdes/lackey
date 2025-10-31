import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from 'src/common/pagination';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiscountService {
  constructor(private prisma: PrismaService) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const data: Prisma.DiscountCreateInput = {
      ...createDiscountDto,
      code: createDiscountDto.code.toUpperCase(),
      startDate: new Date(createDiscountDto.startDate),
      endDate: createDiscountDto.endDate
        ? new Date(createDiscountDto.endDate)
        : null,
    };
    const existingCode = await this.prisma.discount.findUnique({
      where: { code: data.code },
    });
    if (existingCode) {
      throw new ConflictException(
        `Discount code '${data.code}' already exists.`,
      );
    }
    return this.prisma.discount.create({ data });
  }

  async findAll(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.discount.findMany({
        skip,
        take,
        orderBy: { startDate: 'desc' },
      }),
      this.prisma.discount.count(),
    ]);
    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const discount = await this.prisma.discount.findUnique({
      where: { id },
    });
    if (!discount) {
      throw new NotFoundException(`Discount with ID '${id}' not found.`);
    }
    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    await this.findOne(id);
    const data: Prisma.DiscountUpdateInput = {
      ...updateDiscountDto,
      code: updateDiscountDto.code
        ? updateDiscountDto.code.toUpperCase()
        : undefined,
      startDate: updateDiscountDto.startDate
        ? new Date(updateDiscountDto.startDate)
        : undefined,
      endDate: updateDiscountDto.endDate
        ? new Date(updateDiscountDto.endDate)
        : undefined,
    };
    if (data.code) {
      const existingCode = await this.prisma.discount.findFirst({
        where: { code: data.code as string, NOT: { id } },
      });
      if (existingCode) {
        throw new ConflictException(
          `Discount code '${data.code}' already exists.`,
        );
      }
    }
    return this.prisma.discount.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.discount.delete({
      where: { id },
    });
  }

  async validateCode(code: string, subtotal: number) {
    if (!code) {
      throw new BadRequestException('Discount code is required.');
    }
    const now = new Date();
    const discount = await this.prisma.discount.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });
    if (!discount) {
      throw new NotFoundException('Invalid or expired discount code.');
    }
    if (discount.minAmount && subtotal < Number(discount.minAmount)) {
      throw new BadRequestException(
        `Order subtotal must be at least ${discount.minAmount} to use this code.`,
      );
    }
    let discountAmount = 0;
    if (discount.type === 'FIXED_AMOUNT') {
      discountAmount = Number(discount.value);
    } else if (discount.type === 'PERCENTAGE') {
      discountAmount = (subtotal * Number(discount.value)) / 100;
      const maxCap = (discount as any)?.maxDiscountAmount;
      const cap = maxCap != null ? Number(maxCap) : null;
      if (cap != null && cap >= 0) {
        discountAmount = Math.min(discountAmount, cap);
      }
    }
    discountAmount = Math.min(discountAmount, subtotal);
    return {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      discountAmount: discountAmount,
    };
  }

  async findAllActive() {
    const now = new Date();

    return this.prisma.discount.findMany({
      where: {
        isActive: true,
        startDate: {
          lte: now,
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: now,
            },
          },
        ],
      },
      select: {
        id: true,
        code: true,
        description: true,
        type: true,
        value: true,
        minAmount: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async getPromoStrip() {
    const now = new Date();
    const discount = await this.prisma.discount.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      orderBy: [
        // Prefer the soonest ending promo if available, otherwise latest started
        { endDate: 'asc' },
        { startDate: 'desc' },
      ],
    });
    if (!discount) {
      return { active: false };
    }
    const valueNum = Number(discount.value);
    const fmtCurrency = (n: number) => new Intl.NumberFormat('vi-VN').format(n);
    let main = '';
    if (discount.type === 'PERCENTAGE') {
      main = `Giảm ${valueNum}%`;
    } else {
      main = `Giảm ${fmtCurrency(valueNum)}₫`;
    }
    const code = String(discount.code).toUpperCase();
    const suffix = discount.minAmount ? ` cho đơn từ ${fmtCurrency(Number(discount.minAmount))}₫` : '';
    const message = `${main}${suffix} với mã ${code}`;
    return {
      active: true,
      code,
      type: discount.type,
      value: valueNum,
      message,
      description: discount.description ?? null,
      expiresAt: discount.endDate ? discount.endDate.toISOString() : null,
      minAmount: discount.minAmount != null ? Number(discount.minAmount) : null,
      ctaHref: '/products',
      ctaLabel: 'Mua ngay',
      variant: 'brand',
      dismissible: false,
    } as const;
  }
}
