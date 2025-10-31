"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/service/category.service";
import type { Category } from "@/service/category.service";
import { categoryKeys as keys } from "@/constant/key/category";
import { STALE_TIME } from "@/constant/query";
import { DEFAULT_CATEGORY_IMAGE } from "@/constant/image";

export type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string | null;
};

export function useCategoryList() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => categoryService.list(),
    staleTime: STALE_TIME,
  });
}

export function useHeaderTopCategories() {
  return useQuery<Category[]>({
    queryKey: keys.headerTop(),
    queryFn: async () => {
      try {
        const items = await categoryService.headerTop();
        return items ?? [];
      } catch {
        const items = await categoryService.list();
        return items ?? [];
      }
    },
    staleTime: STALE_TIME,
  });
}

export function useHomeCategories() {
  return useQuery<HomeCategory[]>({
    queryKey: keys.list(),
    queryFn: async () => {
      const items = await categoryService.list();
      return items.map((c: Category): HomeCategory => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: DEFAULT_CATEGORY_IMAGE,
        description: c.description ?? null,
      }));
    },
    staleTime: STALE_TIME,
  });
}

export function useCategoryById(id: string) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useCategoryProducts(id: string) {
  return useQuery({
    queryKey: keys.products(id),
    queryFn: () => categoryService.getWithProducts(id),
    enabled: !!id,
  });
}

export function useCategoryWithProducts(id: string) {
  return useQuery({
    queryKey: keys.products(id),
    queryFn: async () => {
      const data = await categoryService.getWithProducts(id);
      if (data && data.category && !data.category.image) {
        data.category.image = DEFAULT_CATEGORY_IMAGE;
      }
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoryService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => categoryService.update(id, payload),
    onSuccess: (updated: Category) => {
      qc.setQueryData<Category>(keys.byId(id), updated);
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: keys.byId(id as string) });
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUploadCategoryThumbnail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => categoryService.uploadThumbnail(id, file),
    onSuccess: (_res, variables) => {
      const id = variables.id;
      qc.invalidateQueries({ queryKey: keys.list() });
      qc.invalidateQueries({ queryKey: keys.byId(id) });
    },
  });
}
