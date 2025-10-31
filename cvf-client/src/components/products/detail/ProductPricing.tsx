"use client";

import React from "react";

interface ProductPricingProps {
  price?: number;
  compareAt?: number;
  isSale: boolean;
  discountPercent?: number;
  formatVND: (amount: number) => string;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  price,
  compareAt,
  isSale,
  discountPercent,
  formatVND,
}) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 p-4 sm:p-5">
      <div className="flex flex-col">
        {price != null ? (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className={`text-lg sm:text-xl md:text-xl leading-tight font-bold ${isSale ? "text-[#AE1C2C]" : "text-[var(--color-cod-gray-900)]"}`}>{formatVND(price)}</span>
            {isSale && discountPercent ? (
              <span className="inline-flex items-center rounded-full bg-[#AE1C2C] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold shadow-md">
                -{discountPercent}%
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-lg sm:text-xl text-neutral-700 font-semibold">Liên hệ</span>
        )}
        {compareAt != null ? (
          <span className="text-sm sm:text-base text-neutral-400 line-through mt-1.5 sm:mt-2 font-medium">{formatVND(compareAt)}</span>
        ) : null}
        {isSale && typeof discountPercent === "number" ? (
          <span className="mt-2 sm:mt-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 font-semibold">
            <span className="text-sm sm:text-base">✨</span> Tiết kiệm {discountPercent}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductPricing;

