"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "@/service/rating.service";
import { ratingKeys as keys } from "@/constant/key/rating";
import type { Review } from "@/type/review";
import { STALE_TIME } from "@/constant/query";

export function useRatingsByProduct(productId: string) {
  return useQuery<Review[]>({
    queryKey: keys.byProduct(productId),
    queryFn: () => ratingService.listByProduct(productId),
    enabled: !!productId,
    staleTime: STALE_TIME,
  });
}

export function useCreateRating(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { orderId: string; productVariantId: string; ratingValue: number; comment?: string }) =>
      ratingService.create({ ...payload, productId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.byProduct(productId) });
    },
  });
}
