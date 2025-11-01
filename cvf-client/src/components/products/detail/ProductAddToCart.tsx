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
    <div className="bg-white border-4 border-black p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        {showQuantityStepper ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase text-black">Số lượng:</span>
              <QuantityStepper
                quantity={cartQty}
                maxStock={maxStock}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
                qtyAriaLabel={`Số lượng cho ${productName}`}
                decreaseLabel="Giảm số lượng"
                increaseLabel="Tăng số lượng"
                leftButtonClassName="h-12 w-12 text-base border-2 border-black font-bold"
                rightButtonClassName="h-12 w-12 text-base border-2 border-black font-bold"
                quantityWidthClassName="w-16 text-base font-bold border-y-2 border-black"
              />
            </div>
            <div className="p-3 bg-emerald-100 border-2 border-emerald-600">
              <p className="text-sm font-bold text-emerald-900 text-center">✓ {cartQty} sản phẩm trong giỏ hàng</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {outOfStock ? (
              <>
                <button
                  type="button"
                  className="w-full px-6 py-4 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-all"
                >
                  Thông báo khi có hàng
                </button>
                <button
                  type="button"
                  disabled
                  className="w-full px-6 py-4 bg-[#fff100] text-black border-2 border-black font-bold uppercase text-base tracking-wider cursor-not-allowed"
                >
                  Hết hàng
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                disabled={adding || !selectedVariant}
                className={`w-full inline-flex items-center gap-3 justify-center px-6 py-4 text-base font-bold uppercase tracking-wider border-2 transition-all ${adding || !selectedVariant ? "bg-neutral-200 text-neutral-500 border-neutral-400 cursor-not-allowed" : "bg-[#fff100] text-black border-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"}`}
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
