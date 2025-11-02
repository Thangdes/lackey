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
    <div className="bg-white border-4 border-black p-4 sm:p-5">
      <div className="flex flex-col">
        {price != null ? (
          <>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-black">{formatVND(price)}</span>
              {isSale && discountPercent && (
                <span className="inline-flex items-center bg-red-600 text-white border-2 border-black px-3 py-1 text-sm font-bold uppercase">
                  -{discountPercent}%
                </span>
              )}
            </div>
            {compareAt != null && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-base text-neutral-500 line-through font-medium">{formatVND(compareAt)}</span>
                {isSale && typeof discountPercent === "number" && (
                  <span className="text-xs text-emerald-700 font-bold uppercase">Tiết kiệm {discountPercent}%</span>
                )}
              </div>
            )}
          </>
        ) : (
          <span className="text-2xl font-bold text-black uppercase">Liên hệ</span>
        )}
        <p className="mt-2 text-xs text-neutral-600">Giá đã bao gồm thuế VAT. Miễn phí vận chuyển cho đơn từ 500.000₫</p>
      </div>
    </div>
  );
};

export default ProductPricing;

