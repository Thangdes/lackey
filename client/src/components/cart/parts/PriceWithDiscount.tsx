"use client";

import React from "react";
import { FiTag } from "react-icons/fi";

export type PriceWithDiscountProps = {
  price?: number;
  compareAt?: number;
  formatVND: (n?: number) => string;
  hideCompareOnMobile?: boolean;
};

const PriceWithDiscount: React.FC<PriceWithDiscountProps> = ({ price, compareAt, formatVND, hideCompareOnMobile }) => {
  const hasPrice = typeof price === "number";
  const hasCompare = typeof compareAt === "number" && typeof price === "number" && (compareAt as number) > (price as number);
  const discountPercent = hasCompare && compareAt
    ? Math.max(1, Math.min(90, Math.round((((compareAt as number) - (price as number)) / (compareAt as number)) * 100)))
    : null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2 flex-wrap">
        {hasPrice ? (
          <span className="text-lg font-bold text-[#AE1C2C]">
            {formatVND(price)}
          </span>
        ) : null}
        {typeof compareAt === "number" ? (
          <span className={`text-sm text-black/50 line-through ${hideCompareOnMobile ? 'hidden sm:inline' : ''}`}>
            {formatVND(compareAt)}
          </span>
        ) : null}
        {discountPercent ? (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-[#AE1C2C] text-white px-2 py-0.5 text-xs font-semibold"
            title={`Tiết kiệm ${formatVND((compareAt as number) - (price as number))}`}
          >
            <FiTag className="h-3 w-3" />
            -{discountPercent}%
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PriceWithDiscount;


