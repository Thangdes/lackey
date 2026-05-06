import { http, httpSuccess, api } from "@/utils/http";
import { buildQueryString, normalizePaginationMeta, unwrapDataArray } from "@/utils/response";
import { API } from "@/constant/api";
import type { CreateProductPayload, Product, UpdateProductPayload, ProductVariant, ProductSort } from "@/type/product";

export type ProductQuickSearchResult = Pick<Product, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'ratingAvg' | 'ratingCount'> & {
  category?: { name?: string };
  supplier?: { name?: string };
  minEffectivePrice?: number;
  totalBuyCount?: number;
};

const mapSort = (s?: ProductSort): string | undefined => {
  switch (s) {
    case "popularity": return "buy_desc";
    case "rating":     return "rating_desc";
    case "priceAsc":   return "price_asc";
    case "priceDesc":  return "price_desc";
    default:           return undefined;
  }
};

export const productService = {
  searchQuick: (q: string, limit = 6) =>
    http.get<{ data: ProductQuickSearchResult[] }>(
      `${API.product.search}?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(String(limit))}`
    ),

  list: (params?: {
    page?: number;
    limit?: number;
    categoryId?: string | string[];
    categoryIds?: string[];
    categorySlugs?: string[];
    supplierId?: string | string[];
    offers?: string[];
    q?: string;
    sort?: ProductSort;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    // Build category params — priority: categorySlugs > categoryIds > categoryId
    const categoryParams: Record<string, unknown> = {};
    const categorySlugs = params?.categorySlugs;
    if (Array.isArray(categorySlugs) && categorySlugs.length > 0) {
      categoryParams["categorySlugs"] = categorySlugs.filter(Boolean);
    } else {
      const categoryIds = params?.categoryIds;
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        categoryParams["categoryIds"] = categoryIds.filter(Boolean);
      } else {
        const categoryId = params?.categoryId;
        if (Array.isArray(categoryId)) {
          categoryParams["categoryIds"] = categoryId.filter(Boolean);
        } else if (categoryId) {
          categoryParams["categoryId"] = categoryId;
        }
      }
    }

    // Build supplierId params
    const supplierParams: Record<string, unknown> = {};
    const supplierId = params?.supplierId;
    if (Array.isArray(supplierId)) {
      supplierParams["supplierIds"] = supplierId.filter(Boolean);
    } else if (supplierId) {
      supplierParams["supplierId"] = supplierId;
    }

    const qs = buildQueryString({
      page,
      limit,
      ...categoryParams,
      ...supplierParams,
      offers: params?.offers,
      q: params?.q,
      inStock: params?.inStock,
      minPrice: params?.minPrice,
      maxPrice: params?.maxPrice,
      sort: mapSort(params?.sort),
    });

    return http
      .get<
        | { data: Product[]; meta?: Record<string, unknown> }
        | { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } }
      >(`${API.product.root}?${qs}`)
      .then((res) => {
        const wrapped = res as { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } };
        const unwrapped = (wrapped?.data && !Array.isArray(wrapped.data))
          ? wrapped.data
          : (res as { data?: Product[]; meta?: Record<string, unknown> });
        const data = (unwrapped as { data?: Product[] })?.data ?? [];
        const meta = normalizePaginationMeta((unwrapped as { meta?: Record<string, unknown> })?.meta, { page, limit });
        return { data, meta } as { data: Product[]; meta?: { page?: number; limit?: number; total?: number } };
      });
  },

  // GET /products/suppliers
  getSuppliers: () =>
    http.get<unknown>(API.product.suppliers).then((raw) => unwrapDataArray<{ id: string; name: string }>(raw)),

  // GET /products/:id
  getById: (id: string) => http.get<Product>(API.product.byId(id)),

  // GET /products/slug/:slug
  getBySlug: (slug: string) => http.get<Product>(API.product.bySlug(slug)),

  // GET /products/:id/related?limit=
  related: (productId: string, limit = 8) =>
    http.get<Product[]>(`${API.product.byId(productId)}/related?limit=${encodeURIComponent(String(limit))}`),

  bestSellers: (params?: { page?: number; limit?: number; categoryId?: string }) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const qs = buildQueryString({ page, limit, categoryId: params?.categoryId });
    return http
      .get<
        | { data: Product[]; meta?: Record<string, unknown> }
        | { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } }
      >(`${API.product.root}/best-sellers?${qs}`)
      .then((res) => {
        const wrapped = res as { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } };
        const unwrapped = (wrapped?.data && !Array.isArray(wrapped.data)) ? wrapped.data : (res as { data?: Product[]; meta?: Record<string, unknown> });
        const data = (unwrapped as { data?: Product[] })?.data ?? [];
        const meta = normalizePaginationMeta((unwrapped as { meta?: Record<string, unknown> })?.meta, { page, limit });
        return { data, meta } as { data: Product[]; meta?: { page?: number; limit?: number; total?: number } };
      });
  },

  topRated: (params?: { page?: number; limit?: number; categoryId?: string }) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const qs = buildQueryString({ page, limit, categoryId: params?.categoryId });
    return http
      .get<
        | { data: Product[]; meta?: Record<string, unknown> }
        | { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } }
      >(`${API.product.root}/top-rated?${qs}`)
      .then((res) => {
        const wrapped = res as { success?: boolean; data?: { data?: Product[]; meta?: Record<string, unknown> } };
        const unwrapped = (wrapped?.data && !Array.isArray(wrapped.data)) ? wrapped.data : (res as { data?: Product[]; meta?: Record<string, unknown> });
        const data = (unwrapped as { data?: Product[] })?.data ?? [];
        const meta = normalizePaginationMeta((unwrapped as { meta?: Record<string, unknown> })?.meta, { page, limit });
        return { data, meta } as { data: Product[]; meta?: { page?: number; limit?: number; total?: number } };
      });
  },

  create: (payload: CreateProductPayload) => http.post<Product>(API.product.root, payload),

  update: (id: string, payload: UpdateProductPayload) => http.patch<Product>(API.product.byId(id), payload),

  delete: (id: string) => httpSuccess.deleteData<{ id: string }>(API.product.byId(id)),

  updateThumbnail: (id: string, file: File) => {
    const form = new FormData();
    form.append("thumbnail", file);
    return api.post<Product>(API.product.thumbnail(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }).then((r) => r.data);
  },

  addImages: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post<Product>(API.product.images(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    }).then((r) => r.data);
  },

  removeImage: (id: string, imageUrl: string) =>
    httpSuccess.patchData<Product>(API.product.deleteImage(id), { imageUrl }),

  listVariants: (productId: string) => http.get<ProductVariant[]>(API.product.variants(productId)),

  addVariant: (productId: string, payload: Omit<ProductVariant, "id">) =>
    httpSuccess.postData<ProductVariant>(API.product.variants(productId), payload),

  updateVariant: (productId: string, variantId: string, payload: Partial<Omit<ProductVariant, "id">>) =>
    httpSuccess.patchData<ProductVariant>(API.product.variantById(productId, variantId), payload),

  removeVariant: (productId: string, variantId: string) =>
    httpSuccess.deleteData<{ id: string }>(API.product.variantById(productId, variantId)),
};
