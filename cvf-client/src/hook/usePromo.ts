"use client";

import { useQuery } from "@tanstack/react-query";
import { discountService } from "@/service/discount.service";
import { STALE_TIME } from "@/constant/query";

export type PromoPayload = {
  active: boolean;
  code?: string;
  type?: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  value?: number;
  message?: string;
  description?: string | null;
  expiresAt?: string | null;
  minAmount?: number | null;
  ctaHref?: string;
  ctaLabel?: string;
  variant?: string;
  dismissible?: boolean;
  fullBleed?: boolean;
};

const promoKeys = {
  root: ["promo"] as const,
  strip: () => [...promoKeys.root, "strip"] as const,
};

export function usePromoStrip() {
  return useQuery<PromoPayload | null>({
    queryKey: promoKeys.strip(),
    queryFn: async () => {
      const res = await discountService.promoStrip();
      if (!res || !res.active) return null;
      return res;
    },
    staleTime: STALE_TIME,
  });
}
