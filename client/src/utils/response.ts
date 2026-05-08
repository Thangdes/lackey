/**
 * Shared response normalization utilities for service layer.
 * Centralizes common patterns for unwrapping API responses and building query strings.
 */

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

// ---------------------------------------------------------------------------
// Response unwrapping helpers
// ---------------------------------------------------------------------------

/**
 * Unwraps a `{ data: T }` envelope if present, otherwise returns the raw value.
 * @example
 * const order = unwrapData<OrderDetail>(await http.get(url));
 */
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

/**
 * Unwraps a `{ data: T[] }` envelope if present.
 * Falls back to `T[]` if the raw value is already an array.
 * Returns `[]` if neither.
 * @example
 * const items = unwrapDataArray<OrderSummary>(await http.get(url));
 */
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

// ---------------------------------------------------------------------------
// Pagination meta normalization
// ---------------------------------------------------------------------------

export interface NormalizedMeta {
  page: number;
  limit: number;
  total?: number;
}

/**
 * Normalizes pagination meta from various backend response shapes into a
 * consistent `{ page, limit, total }` object.
 *
 * Supported meta field aliases:
 *  - page: `page`, `currentPage`
 *  - limit: `limit`, `pageSize`, `perPage`
 *  - total: `total`, `totalItems`, derived from `totalPages * limit`
 */
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

// ---------------------------------------------------------------------------
// Query string builder
// ---------------------------------------------------------------------------

type QueryValue = string | number | boolean | string[] | number[] | undefined | null;

/**
 * Builds a URL query string from a params object.
 * - Skips `undefined`, `null`, and empty string (`""`) values.
 * - Array values are serialized as repeated keys with `[]` suffix (e.g., `ids[]=1&ids[]=2`).
 * - Boolean values are serialized as `"true"` / `"false"`.
 * @example
 * buildQueryString({ page: 1, limit: 10, categoryIds: ["a", "b"] })
 * // => "page=1&limit=10&categoryIds[]=a&categoryIds[]=b"
 */
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
