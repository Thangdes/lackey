"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductSort } from "@/type/product";

export type FilterBarProps = {
  productCount?: number;
  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  sort?: ProductSort;
  onSortChange?: (value: ProductSort) => void;
};

export default function ProductsFilterBar({
  productCount = 0,
  minPrice = "",
  maxPrice = "",
  onMinPriceChange,
  onMaxPriceChange,
  sort,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] py-4 bg-[#f5f1e8]">
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm font-mono tracking-wider text-[#2d2d2d] uppercase">Filter:</span>
        <Select
          value={sort ?? "priceAsc"}
          onValueChange={(value) => onSortChange?.(value as ProductSort)}
        >
          <SelectTrigger className="w-[210px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
            <SelectItem value="priceAsc" className="text-sm">Price: Low to High</SelectItem>
            <SelectItem value="priceDesc" className="text-sm">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            value={minPrice}
            onChange={(e) => onMinPriceChange?.(e.target.value)}
            inputMode="numeric"
            placeholder="Từ (₫)"
            className="w-[140px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none"
          />
          <span className="text-[#2d2d2d]">–</span>
          <Input
            value={maxPrice}
            onChange={(e) => onMaxPriceChange?.(e.target.value)}
            inputMode="numeric"
            placeholder="Đến (₫)"
            className="w-[140px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none"
          />
        </div>
      </div>

      <div className="hidden md:block text-sm font-mono text-[#2d2d2d]/70">
        {productCount} {productCount === 1 ? "product" : "products"}
      </div>
      
      <div className="md:hidden text-sm font-mono text-[#2d2d2d]/70">
        {productCount} sản phẩm
      </div>
    </div>
  );
}
