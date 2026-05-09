"use client";

import React from "react";
import { FiTruck, FiRotateCcw } from "react-icons/fi";

const ProductFeatures: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 shrink-0">
            <FiTruck className="h-6 w-6" />
          </div>
          <div className="flex-1 pt-1">
            <div className="font-semibold text-sm text-gray-900">Giao hàng nhanh</div>
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Miễn phí nội thành với đơn từ 300k</div>
          </div>
        </div>
        <div className="flex items-start gap-4 p-3 bg-white rounded-xl shadow-sm border border-gray-100/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
            <FiRotateCcw className="h-6 w-6" />
          </div>
          <div className="flex-1 pt-1">
            <div className="font-semibold text-sm text-gray-900">Đổi trả linh hoạt</div>
            <div className="text-xs text-gray-500 mt-1 leading-relaxed">Đổi trả trong 7 ngày nếu lỗi nhà sản xuất</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
