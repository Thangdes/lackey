"use client";

import React from "react";
import { CheckCircle2, Eye, Home, X } from "lucide-react";

export type OrderSuccessModalProps = {
  open: boolean;
  lastOrderCode?: string;
  successCountdown: number;
  noAutoDismiss: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onToggleNoAutoDismiss: (checked: boolean) => void;
  onViewOrder: () => void;
  onClose: () => void;
  onGoHome: () => void;
};

export function OrderSuccessModal({
  open,
  lastOrderCode,
  successCountdown,
  noAutoDismiss,
  onMouseEnter,
  onMouseLeave,
  onToggleNoAutoDismiss,
  onViewOrder,
  onClose,
  onGoHome,
}: OrderSuccessModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 sm:p-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl sm:rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center gap-2 sm:gap-3 border-b border-black/5 bg-gradient-to-r from-emerald-50 to-emerald-100/60 px-4 sm:px-5 py-3 sm:py-4">
          <span className="shrink-0 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
          </span>
          <div className="text-sm sm:text-base font-semibold text-emerald-800 truncate">Đặt hàng thành công!</div>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 sm:pt-4">
          <p className="text-sm text-black/75">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận và giao hàng trong thời gian sớm nhất.
          </p>

          {lastOrderCode && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2">
              <span className="text-xs text-black/60">Mã đơn hàng</span>
              <span className="rounded-md bg-white px-2 py-1 font-mono text-sm font-semibold text-black/80 shadow-sm">
                {lastOrderCode}
              </span>
            </div>
          )}

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] sm:text-[12px] text-black/60">
            {!noAutoDismiss ? (
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-black/[0.04] px-2 py-1 text-[11px]">
                  Tự đóng sau <span className="mx-1 font-semibold">{successCountdown}s</span>
                </span>
                <span className="hidden sm:inline">và về trang chủ</span>
              </div>
            ) : <div />}
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="accent-emerald-600"
                checked={noAutoDismiss}
                onChange={(e) => onToggleNoAutoDismiss(e.target.checked)}
              />
              Không tự đóng lần sau
            </label>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap justify-end gap-2">
            <button
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
              onClick={onViewOrder}
            >
              <Eye size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Xem đơn hàng</span>
              <span className="xs:hidden">Xem</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-black/10 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-black/80 shadow-sm transition-colors hover:bg-black/[0.03]"
              onClick={onGoHome}
            >
              <Home size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Về trang chủ</span>
              <span className="xs:hidden">Trang chủ</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-black/10 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm text-black/70 transition-colors hover:bg-black/[0.03]"
              onClick={onClose}
            >
              <X size={14} className="sm:w-4 sm:h-4" />
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
