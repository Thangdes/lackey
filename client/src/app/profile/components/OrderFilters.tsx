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
    <div className="mt-4 bg-neutral-50/50 border border-neutral-200 rounded-xl p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Mã đơn, tên hoặc email..."
              className="w-full rounded-lg border border-neutral-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
              aria-label="Tìm kiếm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
            aria-label="Từ ngày"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
            aria-label="Đến ngày"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          onClick={onFilter}
        >
          <Search className="h-4 w-4" />
          <span>Lọc kết quả</span>
        </button>
        <button
          type="button"
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          <span>Xóa lọc</span>
        </button>
      </div>
    </div>
  );
}
