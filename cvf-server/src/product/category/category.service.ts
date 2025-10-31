import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from 'src/common/pagination';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        OR: [
          { name: createCategoryDto.name },
          { slug: createCategoryDto.slug },
        ],
      },
    });

    if (existingCategory) {
      throw new ConflictException('Category name or slug already exists.');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(query: { page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count(),
    ]);
    return { data: items, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOneWithProducts(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          OR: [
            { name: updateCategoryDto.name },
            { slug: updateCategoryDto.slug },
          ],
          NOT: {
            id: id,
          },
        },
      });
      if (existingCategory) {
        throw new ConflictException('Category name or slug already exists.');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    const productsInCategory = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsInCategory > 0) {
      throw new ConflictException(
        `Cannot delete category with ID '${id}' because it has associated products.`,
      );
    }

    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async findTopByProductCount(limit = 7) {
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

    const categories = await this.prisma.category.findMany({
      where: { id: { in: ids } },
    });

    const orderMap = new Map<string, number>(ids.map((id, idx) => [id, idx]));
    categories.sort((a, b) => (orderMap.get(a.id)! - orderMap.get(b.id)!));
    return categories;
  }

  async updateThumbnail(
    categoryId: string,
    thumbnailFile: Express.Multer.File,
  ) {
    const category = await this.findOne(categoryId);
    const uploadResult = await this.cloudinaryService.uploadFile(thumbnailFile);
    if (category.thumbnailUrl) {
      try {
        const publicId = category.thumbnailUrl.split('/').pop().split('.')[0];
        await this.cloudinaryService.deleteFile(`folder_name/${publicId}`);
      } catch (error) {
        console.error('Failed to delete old thumbnail:', error);
      }
    }
    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        thumbnailUrl: uploadResult.secure_url,
      },
    });
  }
}
