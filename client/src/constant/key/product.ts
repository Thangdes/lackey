export const productKeys = {
  all: ["products"] as const,
  byId: (id: string) => [...productKeys.all, id] as const,
  list: (
    page: number,
    limit: number,
    categoryId?: string,
    q?: string,
    sort?: import("@/type/product").ProductSort,
    inStock?: boolean,
    minPrice?: number,
    maxPrice?: number,
  ) =>
    [
      ...productKeys.all,
      "list",
      page,
      limit,
      categoryId ?? null,
      q ?? null,
      sort ?? null,
      typeof inStock === "boolean" ? inStock : null,
      typeof minPrice === "number" ? minPrice : null,
      typeof maxPrice === "number" ? maxPrice : null,
    ] as const,
  bySlug: (slug: string) => [...productKeys.all, "slug", slug] as const,
};
