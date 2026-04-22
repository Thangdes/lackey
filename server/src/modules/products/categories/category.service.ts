import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '@/infrastructure/common/pagination';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryRepository: CategoryRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findByNameOrSlug(
      createCategoryDto.name,
      createCategoryDto.slug,
    );

    if (existingCategory) {
      throw new ConflictException('Category name or slug already exists.');
    }

    return this.categoryRepository.create(createCategoryDto);
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
    const category = await this.categoryRepository.findOneWithProducts(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findById(id).catch(() => null);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const existingCategory = await this.categoryRepository.findByNameOrSlugExcluding(
        id,
        updateCategoryDto.name,
        updateCategoryDto.slug,
      );
      if (existingCategory) {
        throw new ConflictException('Category name or slug already exists.');
      }
    }

    return this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: string) {
    const productsInCategory = await this.categoryRepository.countProductsInCategory(id);

    if (productsInCategory > 0) {
      throw new ConflictException(
        `Cannot delete category with ID '${id}' because it has associated products.`,
      );
    }

    await this.findOne(id);
    return this.categoryRepository.delete(id);
  }

  async findTopByProductCount(limit = 7) {
    return this.categoryRepository.findTopByProductCount(limit);
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
    return this.categoryRepository.updateThumbnail(categoryId, uploadResult.secure_url);
  }
}
