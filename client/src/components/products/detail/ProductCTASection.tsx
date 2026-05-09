"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { FiShoppingBag, FiPhone, FiMail } from "react-icons/fi";
import { HelpCircle, RefreshCcw } from "lucide-react";

const ProductCTASection: React.FC = () => {
  return (
    <div className="mt-16 mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main CTA Banner */}
      <div className="bg-blue-50 rounded-3xl p-8 md:p-12 text-center shadow-sm border border-blue-100">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Bạn cần tư vấn?
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp nhất
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="tel:0901234567"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-blue-700 w-full sm:w-auto"
          >
            <FiPhone className="h-5 w-5" />
            <span>0901 234 567</span>
          </a>
          <a 
            href="mailto:contact@truongxuan.vn"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-base transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50 w-full sm:w-auto"
          >
            <FiMail className="h-5 w-5 text-gray-500" />
            <span>Email tư vấn</span>
          </a>
        </div>
      </div>

      {/* Secondary CTAs Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CTA 1 */}
        <Link 
          href={ROUTES.products}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <FiShoppingBag className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Xem thêm sản phẩm</h3>
            <p className="text-sm text-gray-500">Khám phá bộ sưu tập</p>
          </div>
        </Link>

        {/* CTA 2 */}
        <Link 
          href={ROUTES.return}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <RefreshCcw className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">Chính sách đổi trả</h3>
            <p className="text-sm text-gray-500">Đổi trả dễ dàng 7 ngày</p>
          </div>
        </Link>

        {/* CTA 3 */}
        <Link 
          href={ROUTES.help}
          className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <HelpCircle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">Trung tâm trợ giúp</h3>
            <p className="text-sm text-gray-500">Câu hỏi thường gặp</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCTASection;
