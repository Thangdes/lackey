








function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}










export function unwrapData<T>(raw: unknown): T {
  if (!isObject(raw) || !("data" in raw)) return raw as T;
  const d = (raw as Record<string, unknown>).data;
  if (d === undefined) return raw as T;
  if (isObject(d) && "data" in d) {
    const nested = (d as Record<string, unknown>).data;
    if (nested !== undefined) return nested as T;
  }
  return d as T;
}








export function unwrapDataArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (!isObject(raw) || !("data" in raw)) return [];
  const d = (raw as Record<string, unknown>).data;
  if (Array.isArray(d)) return d as T[];
  if (isObject(d) && Array.isArray((d as Record<string, unknown>).data)) {
    return (d as { data: T[] }).data;
  }
  return [];
}





export interface NormalizedMeta {
  page: number;
  limit: number;
  total?: number;
}










export function normalizePaginationMeta(
  meta: unknown,
  defaults: { page: number; limit: number }
): NormalizedMeta {
  const m: Record<string, unknown> = isObject(meta) ? (meta as Record<string, unknown>) : {};

  const page = (m.page as number) ?? (m.currentPage as number) ?? defaults.page;
  const limit =
    (m.limit as number) ??
    (m.pageSize as number) ??
    (m.perPage as number) ??
    defaults.limit;
  const total: number | undefined =
    (m.total as number) ??
    (m.totalItems as number) ??
    (typeof m.totalPages === "number"
      ? (m.totalPages as number) * limit
      : undefined);

  return { page, limit, total };
}





type QueryValue = string | number | boolean | string[] | number[] | undefined | null;










export function buildQueryString(params: Record<string, QueryValue>): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      const compact = value.filter((v) => v !== undefined && v !== null && v !== "");
      for (const item of compact) {
        parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(String(item))}`);
      }
    } else if (typeof value === "boolean") {
      parts.push(`${encodeURIComponent(key)}=${value ? "true" : "false"}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  return parts.join("&");
}
