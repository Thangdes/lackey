export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
  byId: (id: string) => [...userKeys.all, id] as const,
  list: (page: number, pageSize: number) => [...userKeys.all, "list", page, pageSize] as const,
};
