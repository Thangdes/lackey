export const ratingKeys = {
  all: ["ratings"] as const,
  byProduct: (productId: string) => [...ratingKeys.all, "product", productId] as const,
  adminList: (page: number, search?: string) => [...ratingKeys.all, "admin", { page, search: search || "" }] as const,
  byId: (id: string) => [...ratingKeys.all, "id", id] as const,
};
