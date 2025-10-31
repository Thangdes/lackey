"use client";

import React from "react";
import { FiTruck, FiRotateCcw } from "react-icons/fi";

const ProductFeatures: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div className="flex items-start gap-3 sm:gap-4 rounded-lg border border-neutral-200 bg-white p-3 sm:p-4">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 shrink-0">
          <FiTruck className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="leading-relaxed">
          <div className="font-semibold text-sm text-[var(--color-cod-gray-900)]">Giao hàng nhanh</div>
          <div className="text-xs text-neutral-600 mt-0.5">Miễn phí nội thành với đơn từ 300k</div>
        </div>
      </div>
      <div className="flex items-start gap-3 sm:gap-4 rounded-lg border border-neutral-200 bg-white p-3 sm:p-4">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 shrink-0">
          <FiRotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="leading-relaxed">
          <div className="font-semibold text-sm text-[var(--color-cod-gray-900)]">Đổi trả linh hoạt</div>
          <div className="text-xs text-neutral-600 mt-0.5">Đổi trả trong 7 ngày nếu lỗi nhà sản xuất</div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
