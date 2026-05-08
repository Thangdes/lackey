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
    <div className="bg-neutral-50 px-5 py-4 rounded-sm flex flex-col">
      {price != null ? (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            {compareAt != null && compareAt > price && (
              <span className="text-sm sm:text-base text-neutral-400 line-through">{formatVND(compareAt)}</span>
            )}
            <span className="text-2xl sm:text-3xl font-medium text-[#AE1C2C]">{formatVND(price)}</span>
            {isSale && discountPercent && (
              <span className="inline-flex items-center bg-[#AE1C2C] text-white px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider">
                Giảm {discountPercent}%
              </span>
            )}
          </div>
        </>
      ) : (
        <span className="text-2xl sm:text-3xl font-medium text-neutral-900">Liên hệ</span>
      )}
      <p className="mt-2 text-xs text-neutral-500">Giá đã bao gồm thuế VAT. Miễn phí vận chuyển cho đơn từ 500.000₫</p>
    </div>
  );
};

export default ProductPricing;
