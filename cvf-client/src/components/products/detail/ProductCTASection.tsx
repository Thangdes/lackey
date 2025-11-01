"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { FiShoppingBag, FiPhone, FiMail } from "react-icons/fi";

const ProductCTASection: React.FC = () => {
  return (
    <div className="mt-16 mb-8">
      {/* Main CTA Banner */}
      <div className="bg-[#fff100] border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_#B5CCBC] text-center">
        <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-wider text-black mb-4">
          Bạn cần tư vấn?
        </h2>
        <p className="text-base md:text-lg text-black font-medium mb-6 max-w-2xl mx-auto">
          Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn chọn sản phẩm phù hợp nhất
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="tel:0901234567"
            className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <FiPhone className="h-5 w-5" />
            Hotline: 0901 234 567
          </a>
          <a 
            href="mailto:contact@truongxuan.vn"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <FiMail className="h-5 w-5" />
            Email tư vấn
          </a>
        </div>
      </div>

      {/* Secondary CTAs Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CTA 1 */}
        <Link 
          href={ROUTES.products}
          className="group bg-white border-4 border-black p-6 hover:bg-[#B5CCBC] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center transition-colors">
              <FiShoppingBag className="h-6 w-6 text-white group-hover:text-black transition-colors" />
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1">Xem thêm sản phẩm</h3>
              <p className="text-xs text-neutral-700">Khám phá bộ sưu tập</p>
            </div>
          </div>
        </Link>

        {/* CTA 2 */}
        <Link 
          href={ROUTES.return}
          className="group bg-white border-4 border-black p-6 hover:bg-[#B5CCBC] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center transition-colors">
              <span className="text-white group-hover:text-black text-2xl font-bold transition-colors">↩</span>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1">Chính sách đổi trả</h3>
              <p className="text-xs text-neutral-700">Đổi trả dễ dàng 7 ngày</p>
            </div>
          </div>
        </Link>

        {/* CTA 3 */}
        <Link 
          href={ROUTES.help}
          className="group bg-white border-4 border-black p-6 hover:bg-[#B5CCBC] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black group-hover:bg-white flex items-center justify-center transition-colors">
              <span className="text-white group-hover:text-black text-2xl font-bold transition-colors">?</span>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm mb-1">Trung tâm trợ giúp</h3>
              <p className="text-xs text-neutral-700">Câu hỏi thường gặp</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCTASection;
