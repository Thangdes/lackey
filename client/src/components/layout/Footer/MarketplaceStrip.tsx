"use client";
import React from "react";
import { Tag, Truck, Sparkles, Boxes, RotateCcw, type LucideIcon } from "lucide-react";

const features: { title: string; subtitle: string; Icon: LucideIcon }[] = [
  { title: "Giá tốt & ưu đãi", subtitle: "Đơn từ 500.000₫", Icon: Tag },
  { title: "Giao hàng miễn phí", subtitle: "Đơn từ 500.000₫", Icon: Truck },
  { title: "Deal mỗi ngày", subtitle: "Ưu đãi hấp dẫn", Icon: Sparkles },
  { title: "Danh mục đa dạng", subtitle: "Lựa chọn phong phú", Icon: Boxes },
  { title: "Đổi trả dễ dàng", subtitle: "Hỗ trợ tận tâm", Icon: RotateCcw },
];
const MarketplaceStrip = () => {
  return (
    <div className="w-full border-t-2 border-[var(--color-cod-gray-900)] bg-[var(--color-wild-sand-50)] relative">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex flex-col sm:flex-row items-stretch bg-[var(--color-wild-sand-50)] overflow-hidden">
          {features.map(({ title, subtitle, Icon }, idx) => (
            <div
              key={idx}
              className={`${idx !== 0 ? "sm:border-l-2 sm:border-[var(--color-cod-gray-900)]" : ""} flex-1 flex items-center gap-4 p-4 md:p-6 hover:bg-[var(--color-wild-sand-100)] transition-colors`}
            >
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center text-[var(--color-cod-gray-800)]">
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm md:text-base lg:text-lg font-semibold text-[var(--color-cod-gray-900)] truncate">{title}</p>
                <p className="text-xs md:text-sm text-[var(--color-cod-gray-500)] truncate">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceStrip;
