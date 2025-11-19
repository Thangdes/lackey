import { http, httpSuccess } from "@/utils/http";
import { api } from "@/utils/http";
import { API } from "@/constant/api";
import type { CreateProductPayload, Product, UpdateProductPayload, ProductVariant, ProductSort } from "@/type/product";

export const productService = {
  searchQuick: (q: string, limit = 6) =>
    http.get<{ data: Array<Pick<Product, 'id' | 'name' | 'slug' | 'thumbnailUrl' | 'ratingAvg' | 'ratingCount'> & { category?: { name?: string }; supplier?: { name?: string }; minEffectivePrice?: number; totalBuyCount?: number }> }>(
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

    const mapSort = (s?: ProductSort): string | undefined => {
      switch (s) {
        case "popularity":
          return "buy_desc";
        case "rating":
          return "rating_desc";
        case "priceAsc":
          return "price_asc";
        case "priceDesc":
          return "price_desc";
        default:
          return undefined;
      }
    };

    const qp: string[] = [`page=${page}`, `limit=${limit}`];

    // Handle categorySlugs (array) - PRIORITY: Use slugs first
    const categorySlugs = params?.categorySlugs;
    if (Array.isArray(categorySlugs) && categorySlugs.length > 0) {
      const compact = categorySlugs.filter(Boolean);
      for (const slug of compact) {
        qp.push(`categorySlugs[]=${encodeURIComponent(slug)}`);
      }
    } else {
      // Fallback: Handle categoryIds (array) 
      const categoryIds = params?.categoryIds;
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const compact = categoryIds.filter(Boolean);
        for (const cid of compact) {
          qp.push(`categoryIds[]=${encodeURIComponent(cid)}`);
        }
      } else {
        // Handle single categoryId as final fallback
        const categoryId = params?.categoryId;
        if (Array.isArray(categoryId)) {
          const compact = categoryId.filter(Boolean);
          for (const cid of compact) {
            qp.push(`categoryIds[]=${encodeURIComponent(cid)}`);
          }
        } else if (categoryId) {
          qp.push(`categoryId=${encodeURIComponent(categoryId)}`);
        }
      }
    }
    const supplierId = params?.supplierId;
    if (Array.isArray(supplierId)) {
      const compactS = supplierId.filter(Boolean);
      for (const sid of compactS) {
        qp.push(`supplierIds[]=${encodeURIComponent(sid)}`);
      }
    } else if (supplierId) {
      qp.push(`supplierId=${encodeURIComponent(supplierId)}`);
    }

    // Add offers filter
    const offers = params?.offers;
    if (Array.isArray(offers)) {
      const compactOffers = offers.filter(Boolean);
      for (const offer of compactOffers) {
        qp.push(`offers[]=${encodeURIComponent(offer)}`);
      }
    }


    if (params?.q) qp.push(`q=${encodeURIComponent(params.q)}`);
    if (typeof params?.inStock === "boolean") qp.push(`inStock=${params.inStock ? "true" : "false"}`);
    if (typeof params?.minPrice === "number") qp.push(`minPrice=${params.minPrice}`);
    if (typeof params?.maxPrice === "number") qp.push(`maxPrice=${params.maxPrice}`);
    const beSort = mapSort(params?.sort);
    if (beSort) qp.push(`sort=${encodeURIComponent(beSort)}`);

    return http
      .get<{
        data: Product[];
        meta?: {
          page?: number;
          limit?: number;
          total?: number;
          totalItems?: number;
          totalPages?: number;
          currentPage?: number;
          pageSize?: number;
          perPage?: number;
        };
      }>(`${API.product.root}?${qp.join("&")}`)
      .then((res) => {
        const m = res?.meta || {};
        const normalized = {
          page: m.page ?? m.currentPage ?? page,
          limit: m.limit ?? m.pageSize ?? m.perPage ?? limit,
          total: m.total ?? m.totalItems ?? (m.totalPages && (m.totalPages * (m.limit ?? m.pageSize ?? m.perPage ?? limit))) ?? undefined,
        } as { page?: number; limit?: number; total?: number };
        return { data: res?.data ?? [], meta: normalized } as { data: Product[]; meta?: { page?: number; limit?: number; total?: number } };
      });
  },

  // GET /products/suppliers
  getSuppliers: () => http.get<Array<{ id: string; name: string }>>(API.product.suppliers),

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
    const qp: string[] = [`page=${page}`, `limit=${limit}`];
    if (params?.categoryId) qp.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    return http.get<{ data: Product[]; meta?: { page?: number; limit?: number; total?: number } }>(
      `${API.product.root}/best-sellers?${qp.join("&")}`
    );
  },

  // GET /products/top-rated?page=&limit=&categoryId=
  topRated: (params?: { page?: number; limit?: number; categoryId?: string }) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const qp: string[] = [`page=${page}`, `limit=${limit}`];
    if (params?.categoryId) qp.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    return http.get<{ data: Product[]; meta?: { page?: number; limit?: number; total?: number } }>(
      `${API.product.root}/top-rated?${qp.join("&")}`
    );
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
    })
      .then((r) => r.data);
  },

  addImages: (id: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post<Product>(API.product.images(id), form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    })
      .then((r) => r.data);
  },

  removeImage: (id: string, imageUrl: string) =>
    httpSuccess.patchData<Product>(API.product.deleteImage(id), { imageUrl }),


  listVariants: (productId: string) => http.get<ProductVariant[]>(API.product.variants(productId)),

  addVariant: (
    productId: string,
    payload: Omit<ProductVariant, "id">
  ) => {
    return httpSuccess.postData<ProductVariant>(API.product.variants(productId), payload);
  },

  updateVariant: (
    productId: string,
    variantId: string,
    payload: Partial<Omit<ProductVariant, "id">>
  ) => {
    return httpSuccess.patchData<ProductVariant>(API.product.variantById(productId, variantId), payload);
  },

  removeVariant: (productId: string, variantId: string) =>
    httpSuccess.deleteData<{ id: string }>(API.product.variantById(productId, variantId)),
};
