"use client";

import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { FiArrowRight, FiShoppingBag } from "react-icons/fi";

export type MobileCheckoutBarProps = {
  total: number;
  formatVND: (n?: number) => string;
  continueLabel: string;
  checkoutLabel: string;
};

export function MobileCheckoutBar({ total, formatVND, continueLabel, checkoutLabel }: MobileCheckoutBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-t border-black/10 p-2 sm:p-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] lg:hidden shadow-[0_-6px_16px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-screen-2xl px-1 sm:px-2 flex items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-black/60">Tổng cộng</div>
          <div className="text-sm sm:text-base font-semibold truncate">{formatVND(total)}</div>
        </div>
        <Link
          href={ROUTES.products}
          className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-black/5 gap-1 sm:gap-2 min-h-8 sm:min-h-10 shrink-0"
        >
          <FiShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline sm:inline">{continueLabel}</span>
          <span className="xs:hidden sm:hidden">Mua</span>
        </Link>
        <Link
          href={ROUTES.checkout ?? "/checkout"}
          className="inline-flex items-center justify-center rounded-full border border-black bg-black px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-black/90 gap-1 sm:gap-2 min-h-8 sm:min-h-10 shrink-0"
        >
          <span className="hidden xs:inline sm:inline">{checkoutLabel}</span>
          <span className="xs:hidden sm:hidden">Đặt</span>
          <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>
    </div>
  );
}

