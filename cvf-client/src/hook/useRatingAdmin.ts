"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ratingService } from "@/service/rating.service";
import { ratingKeys as keys } from "@/constant/key/rating";
import { STALE_TIME } from "@/constant/query";

export function useAdminRatings(params: { page: number; search?: string }) {
  const { page, search } = params;
  return useQuery({
    queryKey: keys.adminList(page, search),
    queryFn: () => ratingService.admin.list({ page, limit: 20, search }),
    staleTime: STALE_TIME,
  });
}

export function useDeleteRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ratingService.admin.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
    },
  });
}
