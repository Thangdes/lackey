import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductVariantDto } from './dto/product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CloudinaryService } from '@/integrations/cloudinary/cloudinary.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '@/infrastructure/common/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}
  private addTotalBuyCountToProduct(product) {
    if (!product) {
      return null;
    }
    const totalBuyCount = product.buyCount + product.initialBuyCount;
    return { ...product, totalBuyCount };
  }
  async create(createProductDto: CreateProductDto) {
    const { variants, categoryId, supplierId, ...productData } = createProductDto;
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });
    if (existingProduct) {
      throw new ConflictException(
        `Product with slug '${productData.slug}' already exists.`,
      );
    }
    await this.prisma.category
      .findUniqueOrThrow({
        where: { id: categoryId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Category with ID '${categoryId}' not found.`,
        );
      });
    await this.prisma.supplier
      .findUniqueOrThrow({
        where: { id: supplierId },
      })
      .catch(() => {
        throw new NotFoundException(
          `Supplier with ID '${supplierId}' not found.`,
        );
      });
    return this.prisma.product.create({
      data: {
        ...productData,
        category: { connect: { id: categoryId } },
        supplier: { connect: { id: supplierId } },
        variants: {
          create: variants,
        },
      },
      include: { variants: true },
    });
  }

  async findAll(query: { page?: number; limit?: number; categoryId?: string; categoryIds?: string[]; supplierId?: string; supplierIds?: string[]; supplier?: string; supplierSlug?: string; supplierSlugs?: string[]; q?: string; inStock?: string | boolean; minPrice?: string; maxPrice?: string; sort?: 'name_asc' | 'name_desc' | 'buy_desc' | 'rating_desc' | 'price_asc' | 'price_desc' }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const search = query.q?.trim();
    const minPriceNum = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPriceNum = query.maxPrice ? Number(query.maxPrice) : undefined;
    const wantInStock = typeof query.inStock === 'string' ? query.inStock === 'true' : !!query.inStock;

    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const providedSlugList: string[] = [];
    if (query.supplier) providedSlugList.push(query.supplier);
    if (query.supplierSlug) providedSlugList.push(query.supplierSlug);
    if (Array.isArray(query.supplierSlugs)) providedSlugList.push(...query.supplierSlugs);
    let normalizedSupplierIds: string[] | undefined = undefined;
    if (Array.isArray(query.supplierIds) && query.supplierIds.length > 0) {
      normalizedSupplierIds = query.supplierIds;
    } else if (query.supplierId) {
      normalizedSupplierIds = [query.supplierId];
    }
    if (providedSlugList.length > 0) {
      const slugSet = new Set(providedSlugList.map((s) => toSlug(String(s))));
      if (slugSet.size > 0) {
        const suppliers = await this.prisma.supplier.findMany({
          where: { isActive: true },
          select: { id: true, name: true },
        });
        const matchedIds = suppliers
          .filter((s) => slugSet.has(toSlug(s.name || '')))
          .map((s) => s.id);
        if (matchedIds.length > 0) {
          normalizedSupplierIds = Array.from(new Set([...(normalizedSupplierIds ?? []), ...matchedIds]));
        }
      }
    }

    const variantAndFilters: Prisma.ProductVariantWhereInput[] = [];
    if (minPriceNum !== undefined) {
      variantAndFilters.push({ price: { gte: new Prisma.Decimal(minPriceNum) } });
    }
    if (maxPriceNum !== undefined) {
      variantAndFilters.push({ price: { lte: new Prisma.Decimal(maxPriceNum) } });
    }
    if (wantInStock) {
      variantAndFilters.push({ stockQuantity: { gt: 0 } });
    }
    const variantsFilter: Prisma.ProductVariantWhereInput | undefined =
      variantAndFilters.length > 0 ? { AND: variantAndFilters } : undefined;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(Array.isArray(query.categoryIds) && query.categoryIds.length > 0
        ? { categoryId: { in: query.categoryIds } }
        : query.categoryId
        ? { categoryId: query.categoryId }
        : {}),
      ...(Array.isArray(normalizedSupplierIds) && normalizedSupplierIds.length > 0
        ? { supplierId: { in: normalizedSupplierIds } }
        : {}),
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        variantsFilter ? { variants: { some: variantsFilter } } : {},
      ],
    };

    if (query.sort !== 'price_asc' && query.sort !== 'price_desc') {
      let orderBy: any = { name: 'asc' };
      switch (query.sort) {
        case 'name_desc':
          orderBy = { name: 'desc' };
          break;
        case 'buy_desc':
          orderBy = { buyCount: 'desc' };
          break;
        case 'rating_desc':
          orderBy = [{ ratingAvg: 'desc' }, { ratingCount: 'desc' }];
          break;
        default:
          orderBy = { name: 'asc' };
      }
      const [items, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          skip,
          take,
          where,
          include: {
            category: { select: { name: true } },
            supplier: { select: { name: true } },
            variants: true,
          },
          orderBy,
        }),
        this.prisma.product.count({ where }),
      ]);
      const withMinPrice = items.map((p) => {
        const eff = (p.variants || [])
          .map((v) => {
            const price = v.price != null ? Number(v.price) : undefined;
            const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
            if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) {
              return Math.min(price, disc);
            }
            if (typeof price === 'number' && !Number.isNaN(price)) return price;
            if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
            return undefined;
          })
          .filter((x): x is number => typeof x === 'number');
        const minEffectivePrice = eff.length ? Math.min(...eff) : null;
        return { ...p, minEffectivePrice };
      });
      const productsWithTotalBuyCount = withMinPrice.map((product) => {
        const buy = Number((product as any).buyCount ?? 0);
        const initial = Number((product as any).initialBuyCount ?? 0);
        const totalBuyCount = buy + initial;
        return { ...product, totalBuyCount };
      });
      return { data: productsWithTotalBuyCount, meta: buildPaginationMeta(total, page, limit) };
    }

    const variantGroupingAnd: Prisma.ProductVariantWhereInput[] = [];
    if (minPriceNum !== undefined) {
      variantGroupingAnd.push({ price: { gte: new Prisma.Decimal(minPriceNum) } });
    }
    if (maxPriceNum !== undefined) {
      variantGroupingAnd.push({ price: { lte: new Prisma.Decimal(maxPriceNum) } });
    }
    if (wantInStock) {
      variantGroupingAnd.push({ stockQuantity: { gt: 0 } });
    }

    const productWhereForGrouping: Prisma.ProductWhereInput = {
      isActive: true,
      ...(Array.isArray(query.categoryIds) && query.categoryIds.length > 0
        ? { categoryId: { in: query.categoryIds } }
        : query.categoryId
        ? { categoryId: query.categoryId }
        : {}),
      ...(Array.isArray(normalizedSupplierIds) && normalizedSupplierIds.length > 0
        ? { supplierId: { in: normalizedSupplierIds } }
        : {}),
      ...(search
        ? {
            AND: [
              {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { slug: { contains: search, mode: 'insensitive' } },
                ],
              },
            ],
          }
        : {}),
    };

    const variantWhereForGrouping: Prisma.ProductVariantWhereInput = {
      ...(variantGroupingAnd.length > 0 ? { AND: variantGroupingAnd } : {}),
      product: productWhereForGrouping,
    };

    const orderByGroup = Prisma.validator<
      Prisma.ProductVariantOrderByWithAggregationInput | Prisma.ProductVariantOrderByWithAggregationInput[]
    >()(
      query.sort === 'price_asc' ? { _min: { price: 'asc' } } : { _max: { price: 'desc' } },
    );

    const groupArgs = Prisma.validator<Prisma.ProductVariantGroupByArgs>()({
      by: ['productId'],
      where: variantWhereForGrouping,
      orderBy: orderByGroup,
      skip,
      take,
      _min: { price: true },
      _max: { price: true },
    });
    const [grouped, total] = await this.prisma.$transaction([
      this.prisma.productVariant.groupBy(groupArgs),
      this.prisma.product.count({ where }),
    ]);

    const idsInOrder = grouped.map((g) => g.productId);
    if (idsInOrder.length === 0) {
      return { data: [], meta: buildPaginationMeta(total, page, limit) };
    }

    const products = await this.prisma.product.findMany({
      where: { id: { in: idsInOrder } },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } },
        variants: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    type GroupedRow = {
      productId: string;
      _min: { price: Prisma.Decimal | null } | null;
      _max: { price: Prisma.Decimal | null } | null;
    };
    const rows = grouped as unknown as GroupedRow[];
    const priceLookup = new Map(
      rows.map((g) => [
        g.productId,
        { min: g._min?.price ?? null, max: g._max?.price ?? null },
      ]),
    );

    const items = idsInOrder
      .map((id) => productMap.get(id))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .sort((a, b) => {
        const pa = priceLookup.get(a.id);
        const pb = priceLookup.get(b.id);
        if (!pa || !pb) return a.name.localeCompare(b.name);
        const dToNum = (d: Prisma.Decimal | null | undefined) =>
          d == null ? Number.NaN : Number(d.toString());
        const va = dToNum(query.sort === 'price_asc' ? pa.min : pa.max);
        const vb = dToNum(query.sort === 'price_asc' ? pb.min : pb.max);
        if (Number.isNaN(va) && Number.isNaN(vb)) {
          return a.name.localeCompare(b.name);
        }
        if (Number.isNaN(va)) return 1;
        if (Number.isNaN(vb)) return -1;
        const cmp = va - vb;
        if (cmp !== 0) {
          return query.sort === 'price_asc' ? (cmp > 0 ? 1 : -1) : (cmp > 0 ? -1 : 1);
        }
        return a.name.localeCompare(b.name);
      })
      .map((p) => {
        const eff = (p.variants || [])
          .map((v) => {
            const price = v.price != null ? Number(v.price) : undefined;
            const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
            if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) {
              return Math.min(price, disc);
            }
            if (typeof price === 'number' && !Number.isNaN(price)) return price;
            if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
            return undefined;
          })
          .filter((x): x is number => typeof x === 'number');
        const minEffectivePrice = eff.length ? Math.min(...eff) : null;
        return { ...p, minEffectivePrice };
      });

    const productsWithTotalBuyCount = items.map((product) => {
      const buy = Number((product as any).buyCount ?? 0);
      const initial = Number((product as any).initialBuyCount ?? 0);
      const totalBuyCount = buy + initial;
      return { ...product, totalBuyCount };
    });

    return { data: productsWithTotalBuyCount, meta: buildPaginationMeta(total, page, limit) };
  }

  async findRelated(productId: string, limit = 8) {
    const base = await this.prisma.product.findUnique({ where: { id: productId }, select: { id: true, categoryId: true } });
    if (!base) {
      throw new NotFoundException(`Product with ID '${productId}' not found`);
    }
    const items = await this.prisma.product.findMany({
      where: { isActive: true, categoryId: base.categoryId, NOT: { id: productId } },
      include: {
        category: { select: { name: true } },
        supplier: { select: { name: true } },
        variants: true,
        _count: { select: { variants: true } },
      },
      orderBy: { buyCount: 'desc' },
      take: limit,
    });
    return items.map((p) => {
      const eff = (p.variants || [])
        .map((v) => {
          const price = v.price != null ? Number(v.price) : undefined;
          const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
          if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) return Math.min(price, disc);
          if (typeof price === 'number' && !Number.isNaN(price)) return price;
          if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
          return undefined;
        })
        .filter((x): x is number => typeof x === 'number');
      const minEffectivePrice = eff.length ? Math.min(...eff) : null;
      const variantCount = (p as any)._count?.variants ?? (Array.isArray(p.variants) ? p.variants.length : 0);
      const { _count, ...rest } = p as any;
      const buy = Number((p as any).buyCount ?? 0);
      const initial = Number((p as any).initialBuyCount ?? 0);
      const totalBuyCount = buy + initial;
      return { ...rest, minEffectivePrice, variantCount, totalBuyCount };
    });
  }

  async searchQuick(params: { q?: string; limit?: number }) {
    const q = params.q?.trim();
    const limit = Math.max(1, Math.min(50, params.limit ?? 6));
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { slug: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const rows = await this.prisma.product.findMany({
      where,
      take: limit,
      orderBy: [{ buyCount: 'desc' }, { ratingAvg: 'desc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        slug: true,
        thumbnailUrl: true,
        ratingAvg: true,
        ratingCount: true,
        category: { select: { name: true } },
        supplier: { select: { name: true } },
        variants: { select: { price: true, discountPrice: true, stockQuantity: true } },
        _count: { select: { variants: true } },
      },
    });
    type QuickVariant = { price: Prisma.Decimal | number | null; discountPrice: Prisma.Decimal | number | null; stockQuantity: number | Prisma.Decimal | null };
    type QuickRow = {
      id: string;
      name: string;
      slug: string;
      thumbnailUrl: string | null;
      ratingAvg: number | null;
      ratingCount: number;
      category: { name: string | null } | null;
      supplier: { name: string | null } | null;
      variants: QuickVariant[];
      _count: { variants: number };
    };
    const items = (rows as QuickRow[]).map((p) => {
      const eff = (p.variants || [])
        .map((v) => {
          const price = v.price != null ? Number(v.price) : undefined;
          const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
          if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) return Math.min(price, disc);
          if (typeof price === 'number' && !Number.isNaN(price)) return price;
          if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
          return undefined;
        })
        .filter((x): x is number => typeof x === 'number');
      const minEffectivePrice = eff.length ? Math.min(...eff) : null;
      const inStock = (p.variants || []).some((v) => {
        const q = v.stockQuantity != null ? Number(v.stockQuantity) : 0;
        return typeof q === 'number' && !Number.isNaN(q) && q > 0;
      });
      const { variants, _count, ...rest } = p as Omit<QuickRow, 'variants' | '_count'> & { variants?: QuickVariant[]; _count?: { variants: number } };
      const variantCount = _count?.variants ?? 0;
      const buy = Number((p as any).buyCount ?? 0);
      const initial = Number((p as any).initialBuyCount ?? 0);
      const totalBuyCount = buy + initial;
      return { ...rest, minEffectivePrice, inStock, variantCount, totalBuyCount };
    });
    return { data: items };
  }

  async findBestSellers(query: { page?: number; limit?: number; categoryId?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where = {
      isActive: true,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    } as const;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        include: {
          category: { select: { name: true } },
          supplier: { select: { name: true } },
          variants: { select: { price: true, discountPrice: true, stockQuantity: true } },
          _count: { select: { variants: true } },
        },
        orderBy: [
          { buyCount: 'desc' },
          { ratingAvg: 'desc' },
          { name: 'asc' },
        ],
      }),
      this.prisma.product.count({ where }),
    ]);
    const withMin = items.map((p) => {
      const eff = (p.variants || [])
        .map((v) => {
          const price = v.price != null ? Number(v.price) : undefined;
          const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
          if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) {
            return Math.min(price, disc);
          }
          if (typeof price === 'number' && !Number.isNaN(price)) return price;
          if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
          return undefined;
        })
        .filter((x): x is number => typeof x === 'number');
      const minEffectivePrice = eff.length ? Math.min(...eff) : null;
      const variantCount = (p as any)._count?.variants ?? (Array.isArray(p.variants) ? p.variants.length : 0);
      const { _count, ...rest } = p as any;
      const buy = Number((p as any).buyCount ?? 0);
      const initial = Number((p as any).initialBuyCount ?? 0);
      const totalBuyCount = buy + initial;
      return { ...rest, minEffectivePrice, variantCount, totalBuyCount };
    });
    return { data: withMin, meta: buildPaginationMeta(total, page, limit) };
  }

  async findTopRated(query: { page?: number; limit?: number; categoryId?: string }): Promise<PaginatedResult<any>> {
    const { page, limit, skip, take } = buildPagination(query.page, query.limit);
    const where = {
      isActive: true,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    } as const;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        include: {
          category: { select: { name: true } },
          supplier: { select: { name: true } },
          variants: { select: { price: true, discountPrice: true } },
          _count: { select: { variants: true } },
        },
        orderBy: [
          { ratingAvg: 'desc' },
          { ratingCount: 'desc' },
          { name: 'asc' },
        ],
      }),
      this.prisma.product.count({ where }),
    ]);
    const withMin = items.map((p) => {
      const eff = (p.variants || [])
        .map((v) => {
          const price = v.price != null ? Number(v.price) : undefined;
          const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;
          if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) {
            return Math.min(price, disc);
          }
          if (typeof price === 'number' && !Number.isNaN(price)) return price;
          if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
          return undefined;
        })
        .filter((x): x is number => typeof x === 'number');
      const minEffectivePrice = eff.length ? Math.min(...eff) : null;
      const variantCount = (p as any)._count?.variants ?? (Array.isArray(p.variants) ? p.variants.length : 0);
      const { _count, ...rest } = p as any;
      const buy = Number((p as any).buyCount ?? 0);
      const initial = Number((p as any).initialBuyCount ?? 0);
      const totalBuyCount = buy + initial;
      return { ...rest, minEffectivePrice, variantCount, totalBuyCount };
    });
    return { data: withMin, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: { select: { id: true, name: true, email: true, phone: true, address: true, description: true, contactName: true } },
        variants: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return this.addTotalBuyCountToProduct(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        supplier: { select: { id: true, name: true, email: true, phone: true, address: true, description: true, contactName: true } },
        variants: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }
    return this.addTotalBuyCountToProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { variants, ...productData } = updateProductDto;
    return this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: productData,
      });
      if (variants) {
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });
        const existingVariantIds = new Set(existingVariants.map((v) => v.id));
        const variantsToCreate = variants.filter((v) => !v.id);
        const variantsToUpdate = variants.filter(
          (v) => v.id && existingVariantIds.has(v.id),
        );
        const variantIdsToUpdate = new Set(variantsToUpdate.map((v) => v.id));
        const variantIdsToDelete = [...existingVariantIds].filter(
          (id) => !variantIdsToUpdate.has(id),
        );
        if (variantsToCreate.length > 0) {
          await tx.productVariant.createMany({
            data: variantsToCreate.map((v) => ({ ...v, productId: id })),
          });
        }
        for (const variant of variantsToUpdate) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: variant,
          });
        }
        if (variantIdsToDelete.length > 0) {
          const referencedCount = await tx.orderItem.count({
            where: { productVariantId: { in: variantIdsToDelete } },
          });
          if (referencedCount > 0) {
            throw new ConflictException(
              'Cannot delete one or more variants because they are associated with existing orders.',
            );
          }
          await tx.productVariant.deleteMany({
            where: { id: { in: variantIdsToDelete } },
          });
        }
      }
      return tx.product.findUnique({
        where: { id },
        include: { variants: true },
      });
    });
  }

  async updateThumbnail(productId: string, thumbnailFile: Express.Multer.File) {
    const product = await this.findOne(productId);
    const uploadResult = await this.cloudinaryService.uploadFile(thumbnailFile);
    if (product.thumbnailUrl) {
      try {
        const publicId = product.thumbnailUrl.split('/').pop().split('.')[0];
        await this.cloudinaryService.deleteFile(`folder_name/${publicId}`);
      } catch (error) {
        console.error('Failed to delete old thumbnail:', error);
      }
    }
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        thumbnailUrl: uploadResult.secure_url,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    // Prevent deleting a product if any of its variants are referenced by order items
    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productVariant: { productId: id } },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        'Cannot delete product because one or more variants are associated with existing orders.',
      );
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
  async findAllVariants(productId: string) {
    await this.findOne(productId);
    return this.prisma.productVariant.findMany({
      where: { productId },
      orderBy: { name: 'asc' },
    });
  }
  async addVariant(productId: string, variantData: ProductVariantDto) {
    await this.findOne(productId);
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: variantData.sku },
    });
    if (existingSku) {
      throw new ConflictException(`SKU '${variantData.sku}' already exists.`);
    }

    return this.prisma.productVariant.create({
      data: {
        ...variantData,
        productId,
      },
    });
  }
  async updateVariant(
    productId: string,
    variantId: string,
    variantData: UpdateProductVariantDto,
  ) {
    const variant = await this.prisma.productVariant
      .findFirstOrThrow({
        where: {
          id: variantId,
          productId: productId,
        },
      })
      .catch(() => {
        throw new NotFoundException(
          `Variant with ID '${variantId}' not found on product '${productId}'`,
        );
      });
    if (variantData.sku && variantData.sku !== variant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: variantData.sku },
      });
      if (existingSku) {
        throw new ConflictException(`SKU '${variantData.sku}' already exists.`);
      }
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: variantData,
    });
  }
  async removeVariant(productId: string, variantId: string) {
    await this.prisma.productVariant
      .findFirstOrThrow({
        where: {
          id: variantId,
          productId: productId,
        },
      })
      .catch(() => {
        throw new NotFoundException(
          `Variant with ID '${variantId}' not found on product '${productId}'`,
        );
      });
    const orderItemsCount = await this.prisma.orderItem.count({
      where: { productVariantId: variantId },
    });

    if (orderItemsCount > 0) {
      throw new ConflictException(
        'Cannot delete variant because it is associated with existing orders.',
      );
    }

    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  async addImages(productId: string, files: Express.Multer.File[]) {
    const product = await this.findOne(productId);
    const uploadPromises = files.map((file) =>
      this.cloudinaryService.uploadFile(file),
    );
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);
    const updatedImages = [...product.images, ...imageUrls];
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });
  }

  async removeImage(productId: string, imageUrl: string) {
    const product = await this.findOne(productId);

    if (!product.images.includes(imageUrl)) {
      throw new NotFoundException(
        `Image URL not found in product with ID '${productId}'`,
      );
    }

    try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await this.cloudinaryService.deleteFile(`folder_name/${publicId}`);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }

    const updatedImages = product.images.filter((img) => img !== imageUrl);

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        images: updatedImages,
      },
    });
  }

  async findSuppliers() {
    return this.prisma.supplier.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
