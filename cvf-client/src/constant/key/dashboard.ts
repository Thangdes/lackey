export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  stats: (q?: { startDate?: string; endDate?: string }) =>
    ["dashboard", "stats", q?.startDate ?? null, q?.endDate ?? null] as const,
  revenueOverTime: (q?: { startDate?: string; endDate?: string }) =>
    ["dashboard", "revenueOverTime", q?.startDate ?? null, q?.endDate ?? null] as const,
  topProducts: (q?: { startDate?: string; endDate?: string }) =>
    ["dashboard", "topProducts", q?.startDate ?? null, q?.endDate ?? null] as const,
} as const;
