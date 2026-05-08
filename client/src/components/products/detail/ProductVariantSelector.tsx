"use client";

import React from "react";
import Link from "next/link";
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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-600">Phiên bản</span>
        <Link href="#" className="text-sm text-[#AE1C2C] hover:underline transition-colors">
          Hướng dẫn chọn
        </Link>
      </div>
      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Chọn phiên bản">
        {variants.map((v) => {
          const disabled = (v.stockQuantity ?? 0) <= 0;
          const active = selectedVariantId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onVariantChange(v.id)}
              disabled={disabled}
              className={`px-4 py-2 text-sm font-medium rounded-sm border transition-all duration-200 ${
                disabled 
                  ? "cursor-not-allowed text-neutral-300 border-neutral-200 bg-neutral-50" 
                  : active 
                    ? "bg-white text-[#AE1C2C] border-[#AE1C2C] relative" 
                    : "bg-white text-neutral-800 border-neutral-200 hover:border-[#AE1C2C] hover:text-[#AE1C2C]"
              }`}
              aria-pressed={active}
              aria-label={`${v.name} ${disabled ? "hết hàng" : "còn hàng"}`}
              title={`SKU: ${v.sku || "—"} • Tồn kho: ${Math.max(0, Number(v.stockQuantity ?? 0))}`}
            >
              {v.name}
              {active && (
                <div className="absolute right-0 bottom-0 w-3 h-3 bg-[#AE1C2C] rounded-tl-sm clip-path-triangle"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantSelector;
