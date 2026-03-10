import { QueryClient } from "@tanstack/react-query";
import { productKeys as keys } from "@/constant/key/product";
import type { Product } from "@/type/product";
import { productService } from "@/service/product.service";

export function setProductDetail(qc: QueryClient, product: Product) {
  qc.setQueryData<Product>(keys.byId(product.id), product);
}

export function getProductDetail(qc: QueryClient, id: string) {
  return qc.getQueryData<Product>(keys.byId(id));
}

export async function prefetchProductDetail(qc: QueryClient, id: string) {
  await qc.prefetchQuery({
    queryKey: keys.byId(id),
    queryFn: () => productService.getById(id),
    staleTime: 30_000,
  });
}

export async function prefetchProductList(
  qc: QueryClient,
  page = 1,
  limit = 10,
  categoryId?: string,
) {
  await qc.prefetchQuery({
    queryKey: keys.list(page, limit, categoryId),
    queryFn: () => productService.list({ page, limit, categoryId }),
    staleTime: 15_000,
  });
}

export async function invalidateAllProducts(qc: QueryClient) {
  await qc.invalidateQueries({ queryKey: keys.all });
}

export async function invalidateProductLists(qc: QueryClient) {
  await qc.invalidateQueries({
    predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "products" && q.queryKey[1] === "list",
  });
}
