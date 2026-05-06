import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const existing = await this.prisma.tag.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Tag already exists');

    return this.prisma.tag.create({ data: { name: dto.name, slug: dto.slug, isActive: dto.isActive ?? true } });
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
      this.prisma.tag.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.tag.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const t = await this.prisma.tag.findUnique({ where: { id } });
    if (!t) throw new NotFoundException('Tag not found');
    return t;
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);
    if (dto.name || dto.slug) {
      const existing = await this.prisma.tag.findFirst({
        where: {
          id: { not: id },
          OR: [dto.name ? { name: dto.name } : undefined, dto.slug ? { slug: dto.slug } : undefined].filter(Boolean) as any,
        },
        select: { id: true },
      });
      if (existing) throw new ConflictException('Tag already exists');
    }
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.tag.delete({ where: { id } });
  }
}
