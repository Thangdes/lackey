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
    <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3">
        {showQuantityStepper ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-600">Số lượng:</span>
              <QuantityStepper
                quantity={cartQty}
                maxStock={maxStock}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                qtyAriaLabel={`Số lượng cho ${productName}`}
                decreaseLabel="Giảm số lượng"
                increaseLabel="Tăng số lượng"
                leftButtonClassName="h-10 w-10 text-base border border-neutral-200 rounded-l-xl font-medium"
                rightButtonClassName="h-10 w-10 text-base border border-neutral-200 rounded-r-xl font-medium"
                quantityWidthClassName="w-14 text-base font-semibold border-y border-neutral-200"
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-sm font-medium text-emerald-700">✓ {cartQty} sản phẩm trong giỏ hàng</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {outOfStock ? (
              <>
                <button
                  type="button"
                  className="w-full px-6 py-3.5 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-medium text-sm hover:bg-neutral-50 transition-all"
                >
                  Thông báo khi có hàng
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full px-6 py-3.5 bg-neutral-100 text-neutral-400 rounded-xl font-medium text-sm cursor-not-allowed"
                >
                  Hết hàng
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                disabled={adding || !selectedVariant}
                className={`w-full inline-flex items-center gap-2 justify-center px-6 py-4 text-base font-semibold rounded-xl transition-all ${adding || !selectedVariant ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/10"}`}
              >
                <FiShoppingCart className="h-5 w-5" />
                {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAddToCart;
