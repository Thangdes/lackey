"use client";

import { useQuery } from "@tanstack/react-query";
import { siteContentService } from "@/service/site-content.service";
import { siteContentKeys as keys } from "@/constant/key/site-content";
import { STALE_TIME } from "@/constant/query";
import type { BannerItem, TestimonialItem, ValuePropItem, HeroSlide } from "@/service/site-content.service";

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

export function useValueProps() {
  return useQuery<ValuePropItem[]>({
    queryKey: ["site-content", "value-props"],
    queryFn: () => siteContentService.getValueProps(),
    staleTime: STALE_TIME,
  });
}

export function useHeroSlides() {
  return useQuery<HeroSlide[]>({
    queryKey: ["site-content", "hero-slides"],
    queryFn: () => siteContentService.getHeroSlides(),
    staleTime: STALE_TIME,
  });
}
