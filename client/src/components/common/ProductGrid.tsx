"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/type/product";
import type { ProductQuery } from "@/type/product";
import { productService } from "@/service/product.service";
import ProductGridSkeleton from "@/components/common/ProductGridSkeleton";
import { productGridClass } from "@/components/common/grid";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

export type ProductGridProps = {
  title?: string;
  query?: ProductQuery;
  limit?: number;
  compact?: boolean;
  initialProducts?: Product[];
  className?: string;
  enableInfinite?: boolean;
  pageSize?: number;
  scrollRootRef?: React.RefObject<HTMLElement | null>;
};
 
const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  query,
  limit = 24,
  compact = false,
  initialProducts,
  className = "",
  enableInfinite = true,
  pageSize,
  scrollRootRef,
}) => {
  const effectivePageSize = pageSize ?? limit;
  const [items, setItems] = useState<Product[]>(initialProducts ?? []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState<boolean>(!initialProducts);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    try {
      setToastMsg(msg);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 4000);
    } catch {
    }
  };

  const uniqueById = (arr: Product[]) => {
    const seen = new Set<string>();
    const out: Product[] = [];
    for (const p of arr) {
      const k = p.id || p.slug || "";
      if (!k) { out.push(p); continue; }
      if (!seen.has(k)) { seen.add(k); out.push(p); }
    }
    return out;
  };

  const infinite = useInfiniteQuery({
    queryKey: [
      "products",
      "infinite",
      {
        q: query?.q ?? null,
        category: query?.category ?? null,
        categoryId: query?.categoryId ?? null,
        categoryIds: Array.isArray(query?.categoryIds) ? query?.categoryIds : [],
        supplierIds: Array.isArray(query?.supplierIds) ? query?.supplierIds : [],
        offers: Array.isArray(query?.offers) ? query?.offers : [],
        categorySlugs: Array.isArray(query?.categorySlugs) ? query?.categorySlugs : [],
        sort: query?.sort ?? null,
        pageSize: effectivePageSize,
      },
    ],
    enabled: !initialProducts,
    initialPageParam: 1 as number,
    queryFn: async ({ pageParam }) => {
      const res = await productService.list({
        page: pageParam as number,
        limit: effectivePageSize,
        categorySlugs: query?.categorySlugs && query.categorySlugs.length > 0 
          ? query.categorySlugs 
          : undefined,
        categoryIds: query?.categoryIds && query.categoryIds.length > 0 
          ? query.categoryIds 
          : undefined,
        categoryId: (!query?.categorySlugs || query.categorySlugs.length === 0) && 
                   (!query?.categoryIds || query.categoryIds.length === 0)
          ? query?.categoryId ?? query?.category
          : undefined,
        supplierId: query?.supplierIds,
        offers: query?.offers,
        q: query?.q,
        sort: query?.sort,
      });
      return res;
    },
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.meta?.total ?? 0;
      const loaded = allPages.reduce((sum, p) => sum + (p.data?.length ?? 0), 0);
      const hasNext = total > 0 ? loaded < total : (lastPage.data?.length ?? 0) === effectivePageSize;
      if (!hasNext) return undefined;
      return (allPages.length + 1);
    },
  });

  useEffect(() => {
    if (initialProducts) return;
    setLoading(infinite.isLoading || infinite.isFetching && !infinite.isFetchingNextPage);
  }, [initialProducts, infinite.isLoading, infinite.isFetching, infinite.isFetchingNextPage]);

  const infiniteItems = useMemo(() => {
    if (initialProducts) return [] as Product[];
    const flat = uniqueById((infinite.data?.pages ?? []).flatMap((p) => p.data ?? []));
    return flat;
  }, [initialProducts, infinite.data?.pages]);

  useEffect(() => {
    if (initialProducts) return;
    setItems(infiniteItems);
    const total = infinite.data?.pages?.[0]?.meta?.total;
    if (typeof total === "number" && total > 0) {
      setHasMore(infiniteItems.length < total);
    } else {
      const lastLen = infinite.data?.pages?.[infinite.data.pages.length - 1]?.data?.length ?? 0;
      setHasMore(lastLen === effectivePageSize);
    }
  }, [initialProducts, infiniteItems, infinite.data?.pages, effectivePageSize]);

  const slicedItems = useMemo(() => {
    if (!initialProducts) return items;
    const maxItems = typeof limit === "number" && limit > 0 ? Math.min(limit, initialProducts.length) : initialProducts.length;
    const end = Math.min(page * effectivePageSize, maxItems);
    return initialProducts.slice(0, end);
  }, [initialProducts, page, effectivePageSize, items, limit]);

  useEffect(() => {
    if (!initialProducts) return;
    setPage(1);
    const maxItems = typeof limit === "number" && limit > 0 ? Math.min(limit, initialProducts.length) : initialProducts.length;
    setHasMore(maxItems > 1 * effectivePageSize);
  }, [initialProducts, effectivePageSize, limit]);

  useEffect(() => {
    if (!enableInfinite) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (initialProducts) {
          if (!hasMore || loadingMore) return;
          setLoadingMore(true);
          setTimeout(() => {
            setPage((p) => {
              const next = p + 1;
              const total = initialProducts.length;
              const maxItems = typeof limit === "number" && limit > 0 ? Math.min(limit, total) : total;
              const nextCount = Math.min(next * effectivePageSize, maxItems);
              setHasMore(nextCount < maxItems);
              return next;
            });
            setLoadingMore(false);
          }, 0);
        } else {
          if (!hasMore || infinite.isFetchingNextPage) return;
          infinite.fetchNextPage().catch((e: unknown) => {
            console.error("[ProductGrid] infinite fetch error", e);
            showToast(`Lỗi mạng: ${(e as Error)?.message || "Request failed"}`);
          });
        }
      },
      { root: (scrollRootRef?.current as Element | null) ?? null, rootMargin: "300px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enableInfinite, initialProducts, hasMore, loadingMore, limit, effectivePageSize, infinite, scrollRootRef]);


  return (
    <section className={className} aria-label={title ?? "Danh sách sản phẩm"}>
      {toastMsg ? (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-red-600 text-white shadow-lg ring-1 ring-black/10 px-4 py-2 text-sm">
          {toastMsg}
        </div>
      ) : null}
      {title ? (
        <h2 className="mb-3 text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">{title}</h2>
      ) : null}
      {loading ? (
        initialProducts ? null : (
          <ProductGridSkeleton count={6} />
        )
      ) : (initialProducts ? slicedItems.length === 0 : items.length === 0) ? (
        <div className="text-sm text-neutral-600">Không có sản phẩm phù hợp.</div>
      ) : (
        <div className={productGridClass}>
          {(initialProducts ? slicedItems : items).map((p, i) => (
            <ProductCard key={`${p.id || p.slug || 'item'}-${i}`} product={p} index={i} variant={compact ? "compact" : "default"} className="!w-full"/>
          ))}
        </div>
      )}
      {enableInfinite ? (
        <div ref={sentinelRef} className="h-12 flex items-center justify-center">
          {initialProducts ? (
            loadingMore ? (
              <div className="inline-flex items-center gap-2 text-sm text-neutral-600">
                <span className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-neutral-600 animate-spin" />
                Đang tải thêm…
              </div>
            ) : null
          ) : infinite.isFetchingNextPage ? (
            <div className="inline-flex items-center gap-2 text-sm text-neutral-600">
              <span className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-neutral-600 animate-spin" />
              Đang tải thêm…
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
;

export default ProductGrid;
