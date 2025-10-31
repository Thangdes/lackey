"use client";

import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import QuantityStepper from "@/components/cart/parts/QuantityStepper";
import type { ProductVariant } from "@/type/product";

interface ProductAddToCartProps {
  cartQty: number;
  maxStock?: number;
  selectedVariant?: ProductVariant;
  outOfStock: boolean;
  productName: string;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  adding?: boolean;
}

const ProductAddToCart: React.FC<ProductAddToCartProps> = ({
  cartQty,
  maxStock,
  selectedVariant,
  outOfStock,
  productName,
  onAdd,
  onDecrease,
  onIncrease,
  adding,
}) => {
  // Fix hydration mismatch by ensuring consistent rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and before hydration, always show the "Add to Cart" button
  // This ensures server and client render the same initial HTML
  const showQuantityStepper = mounted && cartQty > 0;

  return (
    <div className="rounded-xl bg-gradient-to-br from-white to-neutral-50 border-2 border-neutral-200 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {showQuantityStepper ? (
          <>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-600">Số lượng</span>
              <QuantityStepper
                quantity={cartQty}
                maxStock={maxStock}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                qtyAriaLabel={`Số lượng cho ${productName}`}
                decreaseLabel="Giảm số lượng"
                increaseLabel="Tăng số lượng"
                leftButtonClassName="h-11 sm:h-12 w-11 sm:w-12 rounded-r-none text-base"
                rightButtonClassName="h-11 sm:h-12 w-11 sm:w-12 rounded-l-none text-base"
                quantityWidthClassName="w-14 sm:w-16 text-sm sm:text-base font-bold"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-600">Trong giỏ</span>
              <div className="h-11 sm:h-12 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm sm:text-base">
                {cartQty} sản phẩm
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={adding || outOfStock || !selectedVariant}
            className={`w-full inline-flex items-center gap-2.5 justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] transition-all ${adding || outOfStock || !selectedVariant ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-[var(--color-cod-gray-900)] text-white hover:bg-[var(--color-cod-gray-800)] shadow-lg hover:shadow-xl focus-visible:ring-[var(--color-cod-gray-900)]/40"}`}
          >
            <FiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {adding ? "Đang thêm…" : "Thêm vào giỏ hàng"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductAddToCart;
