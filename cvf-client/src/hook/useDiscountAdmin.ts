"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { discountService, type Discount } from "@/service/discount.service";
import { discountKeys as keys } from "@/constant/key/discount";
import { STALE_TIME } from "@/constant/query";

export function useDiscountList() {
  return useQuery({
    queryKey: keys.list(),
    queryFn: () => discountService.list(),
    staleTime: STALE_TIME,
  });
}

export function useDiscountById(id: string) {
  return useQuery({
    queryKey: keys.byId(id),
    queryFn: () => discountService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useCreateDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Discount>) => discountService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useUpdateDiscount(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Discount>) => discountService.update(id, payload),
    onSuccess: (updated: Discount) => {
      qc.setQueryData<Discount>(keys.byId(id), updated);
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}

export function useDeleteDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discountService.delete(id),
    onSuccess: (_res, id) => {
      qc.removeQueries({ queryKey: keys.byId(id as string) });
      qc.invalidateQueries({ queryKey: keys.list() });
    },
  });
}
