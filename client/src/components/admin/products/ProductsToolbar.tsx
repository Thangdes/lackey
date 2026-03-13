"use client";
import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, PackageSearch } from "lucide-react";

export type StockFilter = "all" | "out" | "low" | "in";
export type StockSort = "stockTotalAsc" | "stockTotalDesc" | "variantCountAsc" | "variantCountDesc" | "discountDesc" | "discountAsc";
export type DiscountFilter = "all" | "has" | "none";

export type ProductsToolbarProps = {
  query: string;
  stockFilter: StockFilter;
  discountFilter: DiscountFilter;
  stockSort: StockSort;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStockFilterChange: (value: StockFilter) => void;
  onDiscountFilterChange: (value: DiscountFilter) => void;
  onStockSortChange: (value: StockSort) => void;
  onResetFilters: () => void;
};

export default function ProductsToolbar({
  query,
  stockFilter,
  discountFilter,
  stockSort,
  onQueryChange,
  onStockFilterChange,
  onDiscountFilterChange,
  onStockSortChange,
  onResetFilters,
}: ProductsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-xl font-bold inline-flex items-center gap-2">
        <PackageSearch className="size-6 text-muted-foreground" aria-hidden />
        Sản phẩm
      </h1>
      <div className="flex items-center gap-2">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <Input
          placeholder="Tìm theo tên hoặc slug..."
          value={query}
          onChange={onQueryChange}
          className="w-64"
        />
        <Select value={stockFilter} onValueChange={(v) => onStockFilterChange(v as StockFilter)}>
          <SelectTrigger className="min-w-[160px] h-9">
            <SelectValue placeholder="Lọc tồn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="out">Hết hàng</SelectItem>
            <SelectItem value="low">Sắp hết (≤ 5)</SelectItem>
            <SelectItem value="in">Còn hàng</SelectItem>
          </SelectContent>
        </Select>
        <Select value={discountFilter} onValueChange={(v) => onDiscountFilterChange(v as DiscountFilter)}>
          <SelectTrigger className="min-w-[160px] h-9">
            <SelectValue placeholder="Khuyến mãi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả KM</SelectItem>
            <SelectItem value="has">Đang KM</SelectItem>
            <SelectItem value="none">Chưa KM</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockSort} onValueChange={(v) => onStockSortChange(v as StockSort)}>
          <SelectTrigger className="min-w-[160px] h-9">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stockTotalDesc">Tồn kho ↓</SelectItem>
            <SelectItem value="stockTotalAsc">Tồn kho ↑</SelectItem>
            <SelectItem value="variantCountDesc">Số biến thể ↓</SelectItem>
            <SelectItem value="variantCountAsc">Số biến thể ↑</SelectItem>
            <SelectItem value="discountDesc">KM % ↓</SelectItem>
            <SelectItem value="discountAsc">KM % ↑</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={onResetFilters}>
          Đặt lại
        </Button>
        <Button asChild className="inline-flex items-center gap-2">
          <Link href="/admin/products/new">
            <Plus className="size-4" aria-hidden />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>
    </div>
  );
}
