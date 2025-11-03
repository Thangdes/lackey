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
    <div className="mt-3 sm:mt-4 border-2 border-black bg-white p-3 sm:p-4 shadow-[4px_4px_0px_0px_#B5CCBC]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-black mb-2">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => onQChange(e.target.value)}
              placeholder="Mã đơn, tên hoặc email..."
              className="w-full border-2 border-black pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#AE1C2C] focus:shadow-[4px_4px_0px_0px_rgba(174,28,44,0.2)] bg-white transition-all"
              aria-label="Tìm kiếm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-black mb-2">Từ ngày</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full border-2 border-black px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#AE1C2C] focus:shadow-[4px_4px_0px_0px_rgba(174,28,44,0.2)] bg-white transition-all"
            aria-label="Từ ngày"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-black mb-2">Đến ngày</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full border-2 border-black px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#AE1C2C] focus:shadow-[4px_4px_0px_0px_rgba(174,28,44,0.2)] bg-white transition-all"
            aria-label="Đến ngày"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border-2 border-black bg-black text-white px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-[#AE1C2C] hover:border-[#AE1C2C] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          onClick={onFilter}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Lọc</span>
        </button>
        <button
          type="button"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
          <span>Xóa lọc</span>
        </button>
      </div>
    </div>
  );
}
