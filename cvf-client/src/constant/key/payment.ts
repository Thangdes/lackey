export const paymentKeys = {
  all: ["payments"] as const,
  link: (orderId: string) => [...paymentKeys.all, "link", orderId] as const,
  pending: (page?: number, limit?: number) => {
    // Stringify to keep key stable across undefined/null
    const p = typeof page === "number" ? page : undefined;
    const l = typeof limit === "number" ? limit : undefined;
    return [...paymentKeys.all, "pending", { page: p, limit: l }] as const;
  },
};
