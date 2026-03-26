export const blogKeys = {
  root: () => ["blog"] as const,
  list: (page: number, limit: number) => ["blog", "list", page, limit] as const,
  detail: (slug: string) => ["blog", "detail", slug] as const,
};
