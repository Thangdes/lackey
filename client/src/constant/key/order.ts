export const orderKeys = {
  all: ["orders"] as const,
  list: (
    page?: number,
    limit?: number,
    status?: string | null,
    search?: string | null,
    code?: string | null,
    email?: string | null,
    deliveryCode?: string | null,
  ) =>
    [
      ...orderKeys.all,
      "list",
      page ?? null,
      limit ?? null,
      status ?? null,
      search ?? null,
      code ?? null,
      email ?? null,
      deliveryCode ?? null,
    ] as const,
  byId: (id: string) => [...orderKeys.all, id] as const,
  myHistory: () => [...orderKeys.all, "my-history"] as const,
  myList: (page?: number, limit?: number, status?: string | null) =>
    [...orderKeys.all, "my-list", page ?? null, limit ?? null, status ?? null] as const,
};
