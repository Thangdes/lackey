"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

export type PromoBannerProps = {
  className?: string;
  fullBleed?: boolean;
  mobileHidden?: boolean; 
};

const PromoBanner: React.FC<PromoBannerProps> = ({ className = "", fullBleed = false, mobileHidden = true }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <section
      aria-label="Khuyến mãi"
      className={[
        mobileHidden ? "hidden md:block" : "block",
        fullBleed
          ? "-mx-6 md:-mx-8 lg:-mx-12 xl:-mx-16 2xl:-mx-24"
          : "",
        className,
      ].join(" ")}
    >
      <div className="relative overflow-hidden border-y border-[var(--color-cod-gray-900)] bg-[var(--color-cod-gray-900)] text-white">
        <div className="relative px-3 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-3 md:py-4">
          <button
            type="button"
            aria-label="Đóng khuyến mãi"
            className="absolute right-2 top-2 md:top-1/2 md:-translate-y-1/2 inline-flex items-center justify-center rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            onClick={() => setVisible(false)}
          >
            <IoClose className="h-5 w-5" />
          </button>
          <p className="whitespace-nowrap md:whitespace-normal overflow-x-auto md:overflow-x-visible no-scrollbar text-[13px] md:text-[15px] leading-snug md:leading-normal text-center md:text-left">
            <span className="font-semibold">Giảm 25% cho đơn đầu tiên</span> • Miễn phí giao hàng không giới hạn 3 tháng •
            Nhập <span className="font-mono font-semibold tracking-wide bg-white/10 px-1.5 py-0.5 rounded whitespace-nowrap">VOU7311870</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
