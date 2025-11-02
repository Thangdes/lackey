"use client";

import React from "react";
import { ShieldCheck, Lock, RefreshCcw } from "lucide-react";

export function CheckoutGuarantees() {
  return (
    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px] text-black/75">
        <div className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2">
          <ShieldCheck size={16} className="text-emerald-700" />
          <span>Chính hãng, đổi trả dễ dàng</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2">
          <Lock size={16} className="text-sky-700" />
          <span>Thanh toán an toàn, bảo mật</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2">
          <RefreshCcw size={16} className="text-amber-700" />
          <span>Hỗ trợ đổi/trả theo chính sách</span>
        </div>
      </div>
      <div className="text-right text-[12px] text-black/60">
        <div>Giao TP.HCM 1–2 ngày, tỉnh 2–5 ngày</div>
        <div>
          CSKH: <a href="tel:0356356497" className="underline hover:no-underline">0356 356 497</a>
        </div>
      </div>
    </div>
  );
}
