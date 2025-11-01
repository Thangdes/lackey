"use client";

import React from "react";
import { FiTruck, FiRotateCcw } from "react-icons/fi";

const ProductFeatures: React.FC = () => {
  return (
    <div className="bg-[#B5CCBC] border-4 border-black p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 bg-white border-2 border-black p-3">
          <div className="flex h-10 w-10 items-center justify-center bg-black text-white shrink-0">
            <FiTruck className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm uppercase text-black">Giao hàng nhanh</div>
            <div className="text-xs text-neutral-700 mt-1">Miễn phí nội thành với đơn từ 300k</div>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white border-2 border-black p-3">
          <div className="flex h-10 w-10 items-center justify-center bg-black text-white shrink-0">
            <FiRotateCcw className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-sm uppercase text-black">Đổi trả linh hoạt</div>
            <div className="text-xs text-neutral-700 mt-1">Đổi trả trong 7 ngày nếu lỗi nhà sản xuất</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
