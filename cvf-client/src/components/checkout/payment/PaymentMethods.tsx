/* eslint-disable @next/next/no-img-element */
"use client";

import type { PaymentMethod as Method } from "@/type/checkout";
import { PAYMENT_UI } from "@/constant/checkout";
import { MethodLogo, getOrderedEntries, bankManualLogos } from "./PaymentLogos";
import { WalletCards, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  method: Method;
  total: number;
  onSelect: (m: Method) => void;
  formatVND: (n: number) => string;
  bankBrandCode?: string;
  selectingDisabled?: boolean;
  pending?: boolean;
};

export const PaymentMethods = ({ method, total, onSelect, formatVND, bankBrandCode, selectingDisabled, pending }: Props) => {
  const [codOpen, setCodOpen] = useState(true);
  const [bankOpen, setBankOpen] = useState(true);
  useEffect(() => {
    try {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 639px)').matches;
      if (isMobile) {
        setCodOpen(false);
        setBankOpen(false);
      }
    } catch {}
  }, []);
  const meta: Record<Method, { label: string; desc: string; enabled: boolean }> = {
    COD: { label: PAYMENT_UI.cod.title, desc: PAYMENT_UI.cod.desc, enabled: true },
    VIETQR: { label: PAYMENT_UI.vietqr.title, desc: `${PAYMENT_UI.vietqr.descPrefix}${formatVND(total)}${PAYMENT_UI.vietqr.descSuffix}`, enabled: true },
    BANK_TRANSFER: { label: "Chuyển khoản ngân hàng (Manual)", desc: "Bạn sẽ nhận hướng dẫn chuyển khoản sau khi đặt hàng.", enabled: false },
    CARD: { label: "Thẻ tín dụng/ghi nợ", desc: "Sắp ra mắt.", enabled: false },
    MOMO: { label: "Ví MoMo", desc: "Sắp ra mắt.", enabled: false },
    ZALOPAY: { label: "ZaloPay", desc: "Sắp ra mắt.", enabled: false },
  };

  const orderedEntries: Method[] = getOrderedEntries(meta);

  return (
    <div className="relative rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base font-semibold inline-flex items-center gap-2">
            <WalletCards size={16} aria-hidden className="text-black/80" />
            {PAYMENT_UI.title}
          </div>
          <div className="text-xs text-black/60">Chọn phương thức phù hợp. Bạn có thể thay đổi trước khi đặt hàng.</div>
        </div>
        {/* No select; using clickable cards below */}
      </h2>

      {/* Flex column (all breakpoints), each card full width for equal sizing */}
      <div className="mt-2 sm:mt-3 flex flex-col gap-2 sm:gap-3">
        {orderedEntries.map((m, idx) => {
          const isActive = m === method;
          const disabled = !meta[m].enabled || !!selectingDisabled;
          return (
            <div key={m} className="h-full w-full">
              <button
                type="button"
                onClick={() => !disabled && onSelect(m)}
                disabled={disabled}
                className={[
                  "relative flex h-full w-full items-start gap-3 rounded-xl border p-3 sm:p-4 text-left transition",
                  isActive ? "border-black/60 ring-2 ring-black/10 bg-black/[0.02] shadow-sm" : "border-black/10 bg-white hover:bg-black/[0.02] hover:shadow-sm",
                  disabled ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5",
                ].join(" ")}
              >
                <div className="h-10 w-16 shrink-0 rounded-lg bg-black/[0.03] flex items-center justify-center">
                  <MethodLogo m={m} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span>{meta[m].label}</span>
                    {m === "COD" && (
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] shrink-0">Phổ biến</span>
                    )}
                    {m === "VIETQR" && (
                      <>
                        <span className="rounded-full bg-sky-100 text-sky-800 px-2 py-0.5 text-[10px] shrink-0">Nhanh</span>
                        {bankBrandCode && (
                          <span className="rounded-full bg-black/5 text-black/70 px-2 py-0.5 text-[10px] uppercase shrink-0">{bankBrandCode}</span>
                        )}
                        {pending && (
                          <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] shrink-0">Đang xử lý…</span>
                        )}
                      </>
                    )}
                    {!meta[m].enabled && (
                      <span className="rounded-full bg-black/5 text-black/60 px-2 py-0.5 text-[10px]">Sắp ra mắt</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs sm:text-sm text-black/60">{m === "VIETQR" ? `${PAYMENT_UI.vietqr.descPrefix}${formatVND(total)}${PAYMENT_UI.vietqr.descSuffix}` : meta[m].desc}</p>
                </div>
                {isActive && (
                  <span className="absolute top-2 right-2 rounded-full bg-black text-white px-2 py-0.5 text-[10px]">Đã chọn</span>
                )}
              </button>
              {/* Mobile-only subtle separator between items */}
              {idx < orderedEntries.length - 1 && (
                <div className="sm:hidden h-px bg-black/10 mx-1 my-1" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 sm:mt-3 rounded-xl border border-black/10 bg-black/[0.02] p-3 sm:p-3.5 text-xs sm:text-[13px] text-black/75">
        {method === "COD" && (
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-lg px-2 py-1 hover:bg-black/[0.03]"
              onClick={() => setCodOpen((v) => !v)}
              aria-expanded={codOpen}
            >
              <span className="font-medium">Chi tiết thanh toán khi nhận hàng (COD)</span>
              {codOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {codOpen && (
              <ul className="mt-2 list-disc pl-4 sm:pl-5 space-y-1 leading-snug">
                <li>Thanh toán tiền mặt khi nhận hàng. Vui lòng kiểm tra sản phẩm trước khi thanh toán.</li>
                <li>
                  <span className="mr-2 rounded-full bg-sky-50 text-sky-700 px-2 py-0.5 text-[10px]">Mẹo</span>
                  Chuẩn bị số tiền gần đúng để giao dịch nhanh hơn.
                </li>
              </ul>
            )}
          </div>
        )}
        {method === "VIETQR" && (
          <ul className="list-disc pl-5 space-y-1">
            <li>Hệ thống hiển thị mã QR và nội dung chuyển khoản sau khi đặt hàng.</li>
            <li>Vui lòng chuyển đúng số tiền và nội dung để đối soát nhanh chóng.</li>
          </ul>
        )}
        {method === "BANK_TRANSFER" && (
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-lg px-2 py-1 hover:bg-black/[0.03]"
              onClick={() => setBankOpen((v) => !v)}
              aria-expanded={bankOpen}
            >
              <span className="font-medium">Chi tiết chuyển khoản ngân hàng</span>
              {bankOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {bankOpen && (
              <div className="space-y-2 mt-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sau khi đặt hàng, bạn sẽ thấy thông tin STK và nội dung chuyển khoản.</li>
                  <li>Chuyển khoản xong bấm “Tôi đã chuyển khoản” để hoàn tất.</li>
                </ul>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {bankManualLogos.map((b) => (
                    <div
                      key={b.src}
                      className="relative flex flex-col items-center gap-1 rounded-lg border border-black/10 bg-white px-2 py-2 hover:ring-1 hover:ring-black/10 transition"
                    >
                      <img src="/logo/bank/check.svg" alt="checked" className="absolute -top-2 -right-2 h-4 w-4 drop-shadow" />
                      <img src={b.src} alt={b.label} className="h-7 md:h-8" />
                      <span className="text-xs text-black/70">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {pending && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/50 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
