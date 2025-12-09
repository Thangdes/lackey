import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { BaseRepository } from '@/infrastructure/common/base/base.repository';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(prisma: PrismaService) {
    super(prisma, 'category');
  }

  async findByNameOrSlug(name?: string, slug?: string) {
    if (!name && !slug) return null;
    
    const where: any = { OR: [] };
    if (name) where.OR.push({ name });
    if (slug) where.OR.push({ slug });
    
    return this.model.findFirst({ where });
  }

  async findByNameOrSlugExcluding(id: string, name?: string, slug?: string) {
    if (!name && !slug) return null;
    
    const where: any = { NOT: { id }, OR: [] };
    if (name) where.OR.push({ name });
    if (slug) where.OR.push({ slug });
    
    return this.model.findFirst({ where });
  }

  async findOneWithProducts(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async countProductsInCategory(categoryId: string) {
    return this.prisma.product.count({
      where: { categoryId },
    });
  }

  async findTopByProductCount(limit: number) {
    const rows: Array<{ category_id: string; cnt: number }> = await this.prisma.$queryRaw`
      SELECT "category_id", COUNT(*) AS cnt
      FROM "products"
      WHERE "is_active" = true AND "category_id" IS NOT NULL
      GROUP BY "category_id"
      ORDER BY cnt DESC
      LIMIT ${limit}
    `;

    const ids = rows.map((r) => String(r.category_id)).filter(Boolean);
    if (ids.length === 0) return [];

    const categories = await this.model.findMany({
      where: { id: { in: ids } },
    });

    const orderMap = new Map<string, number>(ids.map((id, idx) => [id, idx]));
    categories.sort((a, b) => (orderMap.get(a.id)! - orderMap.get(b.id)!));
    return categories;
  }

  async updateThumbnail(categoryId: string, thumbnailUrl: string) {
    return this.model.update({
      where: { id: categoryId },
      data: { thumbnailUrl },
    });
  }
}
