import { dehydrate, QueryClient, type DehydratedState } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/queryClient";
import { prefetchProductDetail, prefetchProductList } from "@/cache/product.cache";

export async function buildDehydratedState(prefetcher: (qc: QueryClient) => Promise<void>): Promise<{ state: DehydratedState; queryClient: QueryClient }> {
  const qc = createQueryClient();
  await prefetcher(qc);
  const state = dehydrate(qc);
  return { state, queryClient: qc };
}

export async function prefetchProductDetailState(id: string) {
  return buildDehydratedState(async (qc) => {
    await prefetchProductDetail(qc, id);
  });
}

export async function prefetchProductListState(page = 1, limit = 10, categoryId?: string) {
  return buildDehydratedState(async (qc) => {
    await prefetchProductList(qc, page, limit, categoryId);
  });
}
