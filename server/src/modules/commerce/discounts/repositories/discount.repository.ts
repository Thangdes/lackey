import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { BaseRepository } from '@/infrastructure/common/base/base.repository';
import { Discount, Prisma } from '@prisma/client';

@Injectable()
export class DiscountRepository extends BaseRepository<Discount> {
  constructor(prisma: PrismaService) {
    super(prisma, 'discount');
  }

  async findByCode(code: string) {
    return this.model.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async findByCodeExcluding(code: string, excludeId: string) {
    return this.model.findFirst({
      where: { 
        code: code.toUpperCase(), 
        NOT: { id: excludeId } 
      },
    });
  }

  async findActiveByCode(code: string) {
    const now = new Date();
    return this.model.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
    });
  }

  async findAllActive() {
    const now = new Date();
    return this.model.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
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

  async findActiveForPromoStrip() {
    const now = new Date();
    return this.model.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      orderBy: [
        { endDate: 'asc' },
        { startDate: 'desc' },
      ],
    });
  }
}
