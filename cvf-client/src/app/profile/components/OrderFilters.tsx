"use client";

import { Search, X } from "lucide-react";

export default function OrderFilters({
  q,
  fromDate,
  toDate,
  onQChange,
  onFromDateChange,
  onToDateChange,
  onFilter,
  onClear,
}: {
  q: string;
  fromDate: string;
  toDate: string;
  onQChange: (v: string) => void;
  onFromDateChange: (v: string) => void;
  onToDateChange: (v: string) => void;
  onFilter: () => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl border border-black/10 bg-neutral-50 p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-black/70 mb-1.5">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Mã đơn, tên hoặc email..."
              className="w-full rounded-lg border border-black/15 pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 bg-white transition-all"
              aria-label="Tìm kiếm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-black/70 mb-1.5">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 bg-white transition-all"
            aria-label="Từ ngày"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-black/70 mb-1.5">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full rounded-lg border border-black/15 px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 bg-white transition-all"
            aria-label="Đến ngày"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-black/90 transition-colors"
          onClick={onFilter}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Lọc</span>
        </button>
        <button
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/15 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-black/5 transition-colors"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
          <span>Xóa lọc</span>
        </button>
      </div>
    </div>
  );
}
