import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Brand already exists');

    return this.prisma.brand.create({ data: { name: dto.name, slug: dto.slug, isActive: dto.isActive ?? true } });
  }

  async findAll(params: { page?: number; limit?: number; search?: string; isActive?: string }) {
    const { page, limit, skip, take } = buildPagination(params.page, params.limit);
    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.isActive === '1') where.isActive = true;
    if (params.isActive === '0') where.isActive = false;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.brand.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const b = await this.prisma.brand.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Brand not found');
    return b;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    if (dto.name || dto.slug) {
      const existing = await this.prisma.brand.findFirst({
        where: {
          id: { not: id },
          OR: [dto.name ? { name: dto.name } : undefined, dto.slug ? { slug: dto.slug } : undefined].filter(Boolean) as any,
        },
        select: { id: true },
      });
      if (existing) throw new ConflictException('Brand already exists');
    }
    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.delete({ where: { id } });
  }
}
