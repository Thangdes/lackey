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
    <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-100">
      <div className="flex flex-col">
        {price != null ? (
          <>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900">{formatVND(price)}</span>
              {isSale && discountPercent && (
                <span className="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{discountPercent}%
                </span>
              )}
            </div>
            {compareAt != null && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-base text-neutral-400 line-through">{formatVND(compareAt)}</span>
                {isSale && typeof discountPercent === "number" && (
                  <span className="text-xs text-emerald-600 font-semibold">Tiết kiệm {discountPercent}%</span>
                )}
              </div>
            )}
          </>
        ) : (
          <span className="text-2xl font-bold text-neutral-900">Liên hệ</span>
        )}
        <p className="mt-3 text-xs text-neutral-400">Giá đã bao gồm thuế VAT. Miễn phí vận chuyển cho đơn từ 500.000₫</p>
      </div>
    </div>
  );
};

export default ProductPricing;

