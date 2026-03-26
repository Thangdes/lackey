export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  byId: (id: string) => [...categoryKeys.all, id] as const,
  products: (id: string) => [...categoryKeys.all, id, "products"] as const,
  headerTop: () => [...categoryKeys.all, "headerTop"] as const,
};
