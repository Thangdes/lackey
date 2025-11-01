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
    <div className="bg-white border-4 border-black p-4 sm:p-5">
      <div className="mb-4 text-sm font-bold uppercase tracking-wide text-black">Kích cỡ: <Link href="#" className="text-xs font-normal normal-case hover:underline ml-1">Hướng dẫn chọn size</Link></div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn phiên bản">
        {variants.map((v) => {
          const disabled = (v.stockQuantity ?? 0) <= 0;
          const active = selectedVariantId === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onVariantChange(v.id)}
              disabled={disabled}
              className={`px-4 py-2.5 text-sm font-bold uppercase border-2 transition-all ${disabled ? "cursor-not-allowed text-neutral-400 border-neutral-300 bg-neutral-100 line-through" : active ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"}`}
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
