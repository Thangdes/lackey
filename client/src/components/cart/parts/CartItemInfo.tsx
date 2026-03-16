"use client";

import Link from "next/link";
import type { SmartCartItem } from "@/type/cart";
import { buildProductDetailPath } from "@/constant/route";
import { CART_UI } from "@/constant/ui";
import StockMessage from "./StockMessage";
import RatingStars from "@/components/common/RatingStars";
import React, { useMemo } from "react";

export type CartItemInfoProps = {
  item: SmartCartItem;
  maxStock?: number | null;
  nameClampLines?: 1 | 2;
  compact?: boolean;
  hideStockOnMobile?: boolean;
  hideVariantOnMobile?: boolean;
};

export default function CartItemInfo({ item: it, maxStock, nameClampLines = 2, compact = false, hideStockOnMobile = false, hideVariantOnMobile = false }: CartItemInfoProps) {
  const reviewCountText = useMemo(() => {
    // Randomized review count: 4 * random up to 1000, capped at "1000+"
    const n = Math.floor(4 * Math.random() * 1000);
    return n >= 1000 ? "1000+" : n.toString();
  }, []);
  return (
    <div className="min-w-0 flex-1">
      <Link
        href={buildProductDetailPath(it.productId ?? it.sku)}
        className={`${nameClampLines === 1 ? 'line-clamp-1' : 'line-clamp-2'} ${compact ? 'text-sm' : ''} font-medium hover:underline`}
      >
        {it.productName}
      </Link>
      <div className={`mt-1 flex items-center gap-1 ${compact ? 'text-[11px]' : 'text-sm'} text-black/70`}>
        <RatingStars value={4} />
        <span>({reviewCountText})</span>
      </div>
      <div className={`mt-0.5 ${compact ? 'text-xs' : 'text-sm'} text-black/60 ${hideVariantOnMobile ? 'hidden sm:block' : ''}`}>
        {CART_UI.variantPrefix} {it.variantName}
      </div>
      <div className={hideStockOnMobile ? 'hidden sm:block' : ''}>
        <StockMessage maxStock={maxStock ?? undefined} quantity={it.quantity} />
      </div>
    </div>
  );
}


