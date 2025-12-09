export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function buildPagination(page = 1, limit = 10) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;
  const take = safeLimit;
  return { skip, take, page: safePage, limit: safeLimit };
}

export function buildPaginationMeta(totalItems: number, page: number, limit: number): PaginationMeta {
  const total = Number(totalItems) || 0;
  const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
  return { page, limit, totalItems: total, totalPages };
}
