"use client";

import React from "react";

export type SubmitBarProps = {
  total: number;
  formatVND: (v: number) => string;
  disabled: boolean;
  buttonText: string;
  loading?: boolean;
};

export function SubmitBar({ total, formatVND, disabled, buttonText, loading = false }: SubmitBarProps) {
  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <div className="text-red-700 font-medium">Tổng thanh toán</div>
          <div className="text-lg font-semibold text-red-700">{formatVND(total)}</div>
        </div>
        <button
          type="submit"
          disabled={disabled || loading}
          aria-busy={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-700 bg-red-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-red-200 transition-transform hover:scale-[1.02] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
          )}
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
