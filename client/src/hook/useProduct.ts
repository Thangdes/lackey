"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/service/product.service";
import type { CreateProductPayload, Product, UpdateProductPayload } from "@/type/product";
import { productKeys as keys } from "@/constant/key/product";
import { STALE_TIME } from "@/constant/query";

export function useProductList(
  page = 1,
  limit = 10,
  categoryId?: string,
  q?: string,
  options?: { sort?: import("@/type/product").ProductSort; inStock?: boolean; minPrice?: number; maxPrice?: number }
) {
  const sort = options?.sort;
  const inStock = options?.inStock;
  const minPrice = options?.minPrice;
  const maxPrice = options?.maxPrice;
  return useQuery({
    queryKey: keys.list(page, limit, categoryId, q, sort, inStock, minPrice, maxPrice),
    queryFn: () => productService.list({ page, limit, categoryId, q, sort, inStock, minPrice, maxPrice }),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: keys.bySlug(slug),
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
    staleTime: STALE_TIME,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productService.create(payload),
    onSuccess: (created: Product) => {
      qc.setQueryData<Product>(keys.byId(created.id), created);
    },
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "products" && q.queryKey[1] === "list",
      });
    },
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProductPayload) => productService.update(id, payload),
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: keys.byId(id) });
      const prev = qc.getQueryData<Product>(keys.byId(id));
      if (prev) {
        const next: Product = { ...prev, ...payload } as Product;
        qc.setQueryData<Product>(keys.byId(id), next);
      }
      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) qc.setQueryData<Product | undefined>(keys.byId(id), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: keys.byId(id) });
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "products" && q.queryKey[1] === "list",
      });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.byId(id) });
      const prev = qc.getQueryData<Product>(keys.byId(id));
      qc.removeQueries({ queryKey: keys.byId(id) });
      return { id, prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData<Product | undefined>(keys.byId(ctx.id), ctx.prev);
    },
    onSettled: (_res, _err, id) => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "products" && q.queryKey[1] === "list",
      });
      qc.invalidateQueries({ queryKey: keys.byId(id) });
    },
  });
}

export function useBestSellers(limit = 10, categoryId?: string) {
  return useQuery({
    queryKey: ["products", "best-sellers", limit, categoryId],
    queryFn: () => productService.bestSellers({ page: 1, limit, categoryId }),
    staleTime: STALE_TIME,
  });
}
