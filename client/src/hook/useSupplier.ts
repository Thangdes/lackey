"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/service/product.service";
import { STALE_TIME } from "@/constant/query";

export type Supplier = { id: string; name: string };

const supplierKeys = {
  root: ["suppliers"] as const,
  list: () => [...supplierKeys.root, "list"] as const,
};

export function useSupplierList() {
  return useQuery<Supplier[]>({
    queryKey: supplierKeys.list(),
    queryFn: () => productService.getSuppliers(),
    staleTime: STALE_TIME,
  });
}
