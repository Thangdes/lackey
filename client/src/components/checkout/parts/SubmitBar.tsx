"use client";

import React from "react";

export type SubmitBarProps = {
  total: number;
  formatVND: (v: number) => string;
  disabled: boolean;
  buttonText: string;
  loading?: boolean;
};

export function SubmitBar({ disabled, buttonText, loading = false }: SubmitBarProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      aria-busy={loading}
      className="w-full py-4 bg-[#fff100] hover:bg-[#ffed00] border-2 border-black text-black text-center text-base font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {loading && (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/80 border-t-transparent" />
      )}
      <span>{buttonText}</span>
    </button>
  );
}
