import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta } from '@/infrastructure/common/pagination';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAttributeDto) {
    const existing = await this.prisma.attribute.findFirst({
      where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Attribute already exists');
    return this.prisma.attribute.create({ data: { name: dto.name, slug: dto.slug, isActive: dto.isActive ?? true } });
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
      this.prisma.attribute.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { values: true } }),
      this.prisma.attribute.count({ where }),
    ]);

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const a = await this.prisma.attribute.findUnique({ where: { id }, include: { values: true } });
    if (!a) throw new NotFoundException('Attribute not found');
    return a;
  }

  async update(id: string, dto: UpdateAttributeDto) {
    await this.findOne(id);
    if (dto.name || dto.slug) {
      const existing = await this.prisma.attribute.findFirst({
        where: {
          id: { not: id },
          OR: [dto.name ? { name: dto.name } : undefined, dto.slug ? { slug: dto.slug } : undefined].filter(Boolean) as any,
        },
        select: { id: true },
      });
      if (existing) throw new ConflictException('Attribute already exists');
    }
    return this.prisma.attribute.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.attribute.delete({ where: { id } });
  }

  async addValue(attributeId: string, dto: CreateAttributeValueDto) {
    await this.prisma.attribute.findUniqueOrThrow({ where: { id: attributeId } }).catch(() => {
      throw new NotFoundException('Attribute not found');
    });

    const existing = await this.prisma.attributeValue.findFirst({
      where: { attributeId, slug: dto.slug },
      select: { id: true },
    });
    if (existing) throw new ConflictException('Attribute value already exists');

    return this.prisma.attributeValue.create({
      data: {
        attribute: { connect: { id: attributeId } },
        value: dto.value,
        slug: dto.slug,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateValue(attributeId: string, valueId: string, dto: UpdateAttributeValueDto) {
    const existing = await this.prisma.attributeValue.findFirst({ where: { id: valueId, attributeId } });
    if (!existing) throw new NotFoundException('Attribute value not found');

    if (dto.slug) {
      const dup = await this.prisma.attributeValue.findFirst({
        where: { attributeId, slug: dto.slug, id: { not: valueId } },
        select: { id: true },
      });
      if (dup) throw new ConflictException('Attribute value already exists');
    }

    return this.prisma.attributeValue.update({ where: { id: valueId }, data: dto });
  }

  async removeValue(attributeId: string, valueId: string) {
    const existing = await this.prisma.attributeValue.findFirst({ where: { id: valueId, attributeId } });
    if (!existing) throw new NotFoundException('Attribute value not found');
    return this.prisma.attributeValue.delete({ where: { id: valueId } });
  }
}
