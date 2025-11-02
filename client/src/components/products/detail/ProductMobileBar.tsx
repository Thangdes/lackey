"use client";

import React from "react";
import QuantityStepper from "@/components/cart/parts/QuantityStepper";

export type ProductMobileBarProps = {
  price?: number;
  compareAt?: number;
  isSale?: boolean;
  cartQty: number;
  maxStock?: number;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  formatVND: (n?: number) => string;
};

const ProductMobileBar: React.FC<ProductMobileBarProps> = ({ price, compareAt, isSale, cartQty, maxStock, onAdd, onDecrease, onIncrease, formatVND }) => {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-[60] border-t-2 border-neutral-200 bg-white/98 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          {price != null ? (
            <div className="flex items-center gap-2">
              <span className={`text-lg sm:text-xl font-bold truncate ${isSale ? "text-[#AE1C2C]" : "text-[var(--color-cod-gray-900)]"}`}>{formatVND(price)}</span>
              {isSale ? (
                <span className="inline-flex items-center rounded-full bg-[#AE1C2C] text-white px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold shadow-md shrink-0">SALE</span>
              ) : null}
            </div>
          ) : (
            <span className="text-base sm:text-lg text-neutral-700 font-semibold">Liên hệ</span>
          )}
          {compareAt != null ? (
            <span className="text-xs sm:text-sm text-neutral-400 line-through mt-0.5 sm:mt-1 truncate font-medium">{formatVND(compareAt)}</span>
          ) : null}
        </div>
        <div className="shrink-0">
          {cartQty > 0 ? (
            <QuantityStepper
              quantity={cartQty}
              maxStock={maxStock}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              qtyAriaLabel="Số lượng sản phẩm"
              decreaseLabel="Giảm số lượng"
              increaseLabel="Tăng số lượng"
              leftButtonClassName="h-11 w-11 rounded-r-none text-base"
              rightButtonClassName="h-11 w-11 rounded-l-none text-base"
              quantityWidthClassName="w-12 text-base font-bold"
            />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className={`inline-flex items-center justify-center rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 min-h-11 text-sm sm:text-base font-bold focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] bg-[var(--color-cod-gray-900)] text-white hover:bg-[var(--color-cod-gray-800)] focus-visible:ring-[var(--color-cod-gray-900)]/40 shadow-lg transition-all`}
            >
              <span className="hidden xs:inline">Thêm vào giỏ</span>
              <span className="xs:hidden">Thêm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
;

export default ProductMobileBar;
