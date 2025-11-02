import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/service/product.service";
import type { Product, ProductSort } from "@/type/product";

export type UseProductsParams = {
  page?: number;
  limit?: number;
  categoryId?: string;
  category?: string;
  isActive?: boolean;
  q?: string;
  sort?: ProductSort;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  fallback?: Product[];
  infinite?: boolean;
  supplierIds?: string[];
};

export type UseProductsResult = {
  items: Product[];
  loading: boolean;
  error: boolean;
  page: number;
  limit: number;
  refetch: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;
  fetchNext?: () => void;
};

export function useProducts(params: UseProductsParams = {}): UseProductsResult {
  const { page = 1, limit = 10, categoryId, category, isActive, q, sort, inStock, minPrice, maxPrice, fallback, infinite = false, supplierIds } = params;

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const reloadFlag = useRef(0);

  const deps = useMemo(
    () => ({ page, limit, categoryId, category, isActive, q, sort, inStock, minPrice, maxPrice }),
    [page, limit, categoryId, category, isActive, q, sort, inStock, minPrice, maxPrice]
  );

  const fetchData = useCallback(async () => {
    if (infinite) return;
    setLoading(true);
    setError(false);
    let mounted = true;
    try {
      const res = await productService.list({
        page: deps.page,
        limit: deps.limit,
        categoryId: deps.categoryId ?? deps.category,
        supplierId: supplierIds,
        q: deps.q,
        sort: deps.sort,
        inStock: deps.inStock,
        minPrice: deps.minPrice,
        maxPrice: deps.maxPrice,
      });
      if (!mounted) return;
      setItems(res.data || []);
    } catch {
      if (!mounted) return;
      setError(true);
      setItems(fallback ?? []);
    } finally {
      if (mounted) setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [deps, fallback, infinite, supplierIds]);

  useEffect(() => {
    if (!infinite) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, reloadFlag.current, infinite]);

  const refetch = useCallback(() => {
    reloadFlag.current += 1;
    fetchData();
  }, [fetchData]);

  const inf = useInfiniteQuery({
    queryKey: [
      "products",
      "infinite",
      {
        q: q ?? null,
        category: category ?? null,
        categoryId: categoryId ?? null,
        supplierIds: Array.isArray(supplierIds) ? supplierIds : [],
        sort: sort ?? null,
        pageSize: limit,
      },
    ],
    enabled: !!infinite,
    initialPageParam: 1 as number,
    queryFn: async ({ pageParam }) => {
      return productService.list({
        page: pageParam as number,
        limit,
        categoryId: Array.isArray(supplierIds) && supplierIds.length > 0 ? (categoryId ?? category) : (categoryId ?? category),
        supplierId: supplierIds,
        q,
        sort,
        inStock,
        minPrice,
        maxPrice,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.meta?.total ?? 0;
      const loaded = allPages.reduce((sum, p) => sum + (p.data?.length ?? 0), 0);
      const hasNext = total > 0 ? loaded < total : (lastPage.data?.length ?? 0) === limit;
      if (!hasNext) return undefined;
      return (allPages.length + 1);
    },
  });

  const infiniteItems = useMemo(() => {
    if (!infinite) return [] as Product[];
    return (inf.data?.pages ?? []).flatMap((p) => p.data ?? []);
  }, [inf.data?.pages, infinite]);

  return {
    items: infinite ? infiniteItems : items,
    loading: infinite ? (inf.isLoading || (inf.isFetching && !inf.isFetchingNextPage)) : loading,
    error: infinite ? !!inf.error : error,
    page,
    limit,
    refetch,
    hasMore: infinite
      ? (() => {
          if (!inf.data?.pages?.length) return undefined;
          const total = inf.data.pages[0]?.meta?.total;
          if (typeof total === "number" && total > 0) return infiniteItems.length < total;
          const lastLen = inf.data.pages[inf.data.pages.length - 1]?.data?.length ?? 0;
          return lastLen === limit;
        })()
      : undefined,
    isFetchingNextPage: infinite ? inf.isFetchingNextPage : undefined,
    fetchNext: infinite ? (() => { void inf.fetchNextPage(); }) : undefined,
  };
}
