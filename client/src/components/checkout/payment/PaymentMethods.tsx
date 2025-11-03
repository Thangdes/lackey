"use client";

import type { PaymentMethod as Method } from "@/type/checkout";
import { getOrderedEntries } from "./PaymentLogos";

type Props = {
  method: Method;
  total: number;
  onSelect: (m: Method) => void;
  formatVND: (n: number) => string;
  bankBrandCode?: string;
  selectingDisabled?: boolean;
  pending?: boolean;
};

export const PaymentMethods = ({ method, total, onSelect, formatVND, selectingDisabled, pending }: Props) => {
  const meta: Record<Method, { label: string; desc: string; enabled: boolean }> = {
    COD: { 
      label: "Thanh toán tiền mặt khi nhận hàng", 
      desc: "Thanh toán trực tiếp với shipper khi nhận hàng. Kiểm tra kỹ trước khi thanh toán. Nếu có lỗi vui lòng liên hệ hotline 0356 356 497", 
      enabled: true 
    },
    VIETQR: { 
      label: "Chuyển khoản ngân hàng (VietQR)", 
      desc: `Sau khi đặt hàng, chúng tôi sẽ hiển thị mã QR với số tiền ${formatVND(total)} và hướng dẫn chuyển khoản.`, 
      enabled: true 
    },
    BANK_TRANSFER: { label: "Chuyển khoản ngân hàng (Manual)", desc: "Bạn sẽ nhận hướng dẫn chuyển khoản sau khi đặt hàng.", enabled: false },
    CARD: { label: "Thẻ tín dụng/ghi nợ", desc: "Sắp ra mắt.", enabled: false },
    MOMO: { label: "Ví MoMo", desc: "Sắp ra mắt.", enabled: false },
    ZALOPAY: { label: "ZaloPay", desc: "Sắp ra mắt.", enabled: false },
  };

  const orderedEntries: Method[] = getOrderedEntries(meta);

  return (
    <div className="space-y-4">
      {/* Payment options */}
      <div className="flex flex-col gap-3">
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
                  "relative flex h-full w-full items-start gap-3 rounded border p-4 text-left transition",
                  isActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400",
                  disabled ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm flex flex-wrap items-center gap-2">
                    <span>{meta[m].label}</span>
                    {m === "COD" && (
                      <span className="rounded bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium">Phổ biến</span>
                    )}
                    {m === "VIETQR" && (
                      <span className="rounded bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">Nhanh</span>
                    )}
                    {!meta[m].enabled && (
                      <span className="rounded bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-medium">Sắp ra mắt</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{meta[m].desc}</p>
                </div>
                {isActive && (
                  <div className="absolute top-3 right-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
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
      {method === "COD" && (
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 mb-2">Chi tiết thanh toán khi nhận hàng (COD)</h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                  <span>Thanh toán tiền mặt khi nhận hàng. Vui lòng kiểm tra sản phẩm trước khi thanh toán.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                  <span><strong className="text-blue-600">Mẹo:</strong> Chuẩn bị số tiền gần đúng để giao dịch nhanh hơn.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {pending && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/50 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
