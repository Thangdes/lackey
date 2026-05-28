"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductSort } from "@/type/product";
import { SlidersHorizontal, Loader2 } from "lucide-react";

export type FilterBarProps = {
  productCount?: number;
  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  sort?: ProductSort;
  onSortChange?: (value: ProductSort) => void;
  loading?: boolean;
};

export default function ProductsFilterBar({
  productCount = 0,
  minPrice = "",
  maxPrice = "",
  onMinPriceChange,
  onMaxPriceChange,
  sort,
  onSortChange,
  loading = false,
}: FilterBarProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-neutral-200 py-4 backdrop-blur-sm bg-white/95">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-neutral-700">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Bộ lọc</span>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <Select
              defaultValue="priceAsc"
              value={sort || "priceAsc"}
              onValueChange={(value) => onSortChange?.(value as ProductSort)}
            >
              <SelectTrigger className="w-[180px] h-9 border border-neutral-200 bg-white text-sm rounded-lg hover:border-neutral-300 transition-colors">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-neutral-200 rounded-lg shadow-lg">
                <SelectItem value="priceAsc" className="text-sm rounded-md">Giá: Tăng dần</SelectItem>
                <SelectItem value="priceDesc" className="text-sm rounded-md">Giá: Giảm dần</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                value={minPrice}
                onChange={(e) => onMinPriceChange?.(e.target.value)}
                inputMode="numeric"
                placeholder="Từ (₫)"
                className="w-[120px] h-9 border border-neutral-200 bg-white text-sm rounded-lg focus:border-neutral-400 transition-colors"
              />
              <span className="text-neutral-400">–</span>
              <Input
                value={maxPrice}
                onChange={(e) => onMaxPriceChange?.(e.target.value)}
                inputMode="numeric"
                placeholder="Đến (₫)"
                className="w-[120px] h-9 border border-neutral-200 bg-white text-sm rounded-lg focus:border-neutral-400 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="text-sm text-neutral-500 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              <>
                <span className="font-medium text-neutral-900">{productCount}</span> sản phẩm
              </>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="md:hidden mt-4 space-y-3">
        <Select
          defaultValue="priceAsc"
          value={sort || "priceAsc"}
          onValueChange={(value) => onSortChange?.(value as ProductSort)}
        >
          <SelectTrigger className="w-full h-10 border border-neutral-200 bg-white text-sm rounded-lg">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-neutral-200 rounded-lg shadow-lg">
            <SelectItem value="priceAsc" className="text-sm rounded-md">Giá: Tăng dần</SelectItem>
            <SelectItem value="priceDesc" className="text-sm rounded-md">Giá: Giảm dần</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            value={minPrice}
            onChange={(e) => onMinPriceChange?.(e.target.value)}
            inputMode="numeric"
            placeholder="Từ (₫)"
            className="flex-1 h-10 border border-neutral-200 bg-white text-sm rounded-lg"
          />
          <span className="text-neutral-400">–</span>
          <Input
            value={maxPrice}
            onChange={(e) => onMaxPriceChange?.(e.target.value)}
            inputMode="numeric"
            placeholder="Đến (₫)"
            className="flex-1 h-10 border border-neutral-200 bg-white text-sm rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
