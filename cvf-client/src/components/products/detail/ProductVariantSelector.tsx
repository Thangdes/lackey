"use client";

import React from "react";
import type { ProductVariant } from "@/type/product";

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange: (variantId: string) => void;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onVariantChange,
}) => {
  if (variants.length === 0) return null;

  return (
    <div className="rounded-xl bg-white border border-neutral-200 p-4 sm:p-5">
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-[var(--color-cod-gray-900)]">Chọn phiên bản</div>
      <div className="flex flex-wrap gap-2 sm:gap-2.5" role="radiogroup" aria-label="Chọn phiên bản">
        {variants.map((v) => {
          const disabled = (v.stockQuantity ?? 0) <= 0;
          const active = selectedVariantId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onVariantChange(v.id)}
              disabled={disabled}
              className={`rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ring-2 transition-all ${disabled ? "cursor-not-allowed text-neutral-400 ring-neutral-200 bg-neutral-50 opacity-60" : active ? "bg-[var(--color-cod-gray-900)] text-white ring-[var(--color-cod-gray-900)] shadow-md scale-105" : "bg-white text-neutral-800 ring-neutral-300 hover:ring-[var(--color-cod-gray-900)] hover:shadow-sm hover:scale-[1.02]"}`}
              aria-pressed={active}
              aria-label={`${v.name} ${disabled ? "hết hàng" : "còn hàng"}`}
              title={`SKU: ${v.sku || "—"} • Tồn kho: ${Math.max(0, Number(v.stockQuantity ?? 0))}`}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSelector;
