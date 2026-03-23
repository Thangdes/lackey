"use client";

import React from "react";
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
  onBuyNow: () => void;
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
  onBuyNow,
  onDecrease,
  onIncrease,
  adding,
}) => {

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-neutral-600 min-w-[70px]">Số lượng</span>
        <QuantityStepper
          quantity={cartQty || 1}
          maxStock={maxStock}
          onDecrease={cartQty > 0 ? onDecrease : () => {}}
          onIncrease={onIncrease}
          qtyAriaLabel={`Số lượng cho ${productName}`}
          decreaseLabel="Giảm số lượng"
          increaseLabel="Tăng số lượng"
          leftButtonClassName="h-8 w-8 text-sm border border-neutral-200 rounded-sm font-medium hover:bg-neutral-50"
          rightButtonClassName="h-8 w-8 text-sm border border-neutral-200 rounded-sm font-medium hover:bg-neutral-50"
          quantityWidthClassName="w-12 h-8 text-sm font-medium border-y border-neutral-200"
        />
        <span className="text-sm text-neutral-500">{maxStock != null ? `${maxStock} sản phẩm có sẵn` : ""}</span>
      </div>

      <div className="flex items-center gap-3">
        {outOfStock ? (
          <>
            <button
              type="button"
              className="flex-1 px-6 py-3.5 bg-white text-neutral-900 border border-neutral-200 rounded-sm font-medium text-sm hover:bg-neutral-50 transition-all"
            >
              Thông báo khi có hàng
            </button>
            <button
              type="button"
              disabled
              className="flex-1 px-6 py-3.5 bg-neutral-100 text-neutral-400 rounded-sm font-medium text-sm cursor-not-allowed"
            >
              Hết hàng
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onAdd}
              disabled={adding || !selectedVariant}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm sm:text-base font-medium rounded-sm border transition-all ${adding || !selectedVariant ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-[#AE1C2C]/10 border-[#AE1C2C] text-[#AE1C2C] hover:bg-[#AE1C2C]/20"}`}
            >
              <FiShoppingCart className="h-5 w-5" />
              {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
            <button
              type="button"
              onClick={onBuyNow}
              disabled={adding || !selectedVariant}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm sm:text-base font-medium rounded-sm border transition-all ${adding || !selectedVariant ? "bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed" : "bg-[#AE1C2C] border-[#AE1C2C] text-white hover:bg-[#AE1C2C]/90 shadow-sm"}`}
            >
              Mua ngay
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductAddToCart;
