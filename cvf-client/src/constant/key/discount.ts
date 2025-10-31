export const discountKeys = {
  all: ["discounts"] as const,
  list: () => [...discountKeys.all, "list"] as const,
  byId: (id: string) => [...discountKeys.all, id] as const,
};
