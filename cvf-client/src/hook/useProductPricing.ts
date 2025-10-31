import { useMemo } from "react";
import type { ProductVariant } from "@/type/product";

export type ProductPricing = {
  price?: number;
  compareAt?: number;
  isSale: boolean;
  discountPercent?: number;
};

export function useProductPricing(variant?: Pick<ProductVariant, "price" | "discountPrice"> | null): ProductPricing {
  return useMemo(() => {
    const price = variant?.discountPrice ?? variant?.price ?? undefined;
    const compareAt = variant?.discountPrice ? variant?.price : undefined;
    const isSale = !!variant?.discountPrice && (variant?.price ?? 0) > (variant?.discountPrice ?? 0);
    const discountPercent = isSale && variant?.price
      ? Math.max(1, Math.min(90, Math.round(((variant.price - (variant.discountPrice ?? 0)) / variant.price) * 100)))
      : undefined;
    return { price, compareAt, isSale, discountPercent } as const;
  }, [variant?.price, variant?.discountPrice]);
}

export default useProductPricing;
