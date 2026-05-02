import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/database/prisma.service';
import { buildPagination, buildPaginationMeta, PaginatedResult } from '@/infrastructure/common/pagination';
import { Prisma } from '@prisma/client';
import { ProductCalculatorUtil } from '../utilities/product-calculator.util';

@Injectable()
export class ProductQueryService {
  constructor(private prisma: PrismaService) {}

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
      const formattedItems = items.map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p));
      return { data: formattedItems, meta: buildPaginationMeta(total, page, limit) };
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
      .map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p));

    return { data: items, meta: buildPaginationMeta(total, page, limit) };
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
    return items.map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p));
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
    return { data: rows.map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p)) };
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
    return { data: items.map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p)), meta: buildPaginationMeta(total, page, limit) };
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
    return { data: items.map(p => ProductCalculatorUtil.enrichProductWithCalculatedFields(p)), meta: buildPaginationMeta(total, page, limit) };
  }

  async findSuppliers() {
    return this.prisma.supplier.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
