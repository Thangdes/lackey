"use client";

import { useQuery } from "@tanstack/react-query";
import { siteContentService } from "@/service/site-content.service";
import { siteContentKeys as keys } from "@/constant/key/site-content";
import { STALE_TIME } from "@/constant/query";
import type { BannerItem, TestimonialItem } from "@/service/site-content.service";

export function useBanners() {
  return useQuery<BannerItem[]>({
    queryKey: keys.banners(),
    queryFn: () => siteContentService.getBanners(),
    staleTime: STALE_TIME,
  });
}

export function useTestimonials() {
  return useQuery<TestimonialItem[]>({
    queryKey: keys.testimonials(),
    queryFn: () => siteContentService.getTestimonials(),
    staleTime: STALE_TIME,
  });
}
