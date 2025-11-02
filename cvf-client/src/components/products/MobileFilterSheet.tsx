"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiFilter, FiX } from "react-icons/fi";

type MobileFilterSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSize: string;
  selectedType: string;
  selectedColor: string;
  onSizeChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onColorChange: (value: string) => void;
  productCount?: number;
};

const SIZES = [
  { value: "all", label: "Tất cả kích cỡ" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

const TYPES = [
  { value: "all", label: "Tất cả loại" },
  { value: "anime", label: "Anime" },
  { value: "kpop", label: "Kpop" },
  { value: "cartoon", label: "Cartoon" },
  { value: "custom", label: "Custom" },
];

const COLORS = [
  { value: "all", label: "Tất cả màu" },
  { value: "black", label: "Đen" },
  { value: "white", label: "Trắng" },
  { value: "red", label: "Đỏ" },
  { value: "blue", label: "Xanh dương" },
  { value: "multi", label: "Nhiều màu" },
];

export default function MobileFilterSheet({
  open,
  onOpenChange,
  selectedSize,
  selectedType,
  selectedColor,
  onSizeChange,
  onTypeChange,
  onColorChange,
  productCount = 0,
}: MobileFilterSheetProps) {
  const handleClearAll = () => {
    onSizeChange("all");
    onTypeChange("all");
    onColorChange("all");
  };

  const activeFiltersCount = [selectedSize, selectedType, selectedColor].filter(
    (val) => val !== "all"
  ).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <SheetTitle className="text-left flex items-center gap-2">
              <FiFilter className="w-5 h-5" />
              Bộ lọc
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Product Count and Clear */}
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-sm text-gray-600">
              {productCount} sản phẩm
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-[#AE1C2C] hover:text-[#AE1C2C]/80 h-8"
              >
                Xóa tất cả ({activeFiltersCount})
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            {/* Size Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 block">
                Kích cỡ
              </label>
              <Select value={selectedSize} onValueChange={onSizeChange}>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="Chọn kích cỡ" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 block">
                Loại sản phẩm
              </label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="Chọn loại sản phẩm" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-900 block">
                Màu sắc
              </label>
              <Select value={selectedColor} onValueChange={onColorChange}>
                <SelectTrigger className="w-full border-gray-300 bg-white">
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bottom spacing for safe scrolling */}
          <div className="h-4" />
        </div>

        {/* Fixed Bottom Action Button */}
        <div className="shrink-0 border-t border-gray-200 p-4 bg-white">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#AE1C2C] hover:bg-[#AE1C2C]/90 text-white h-12 rounded-lg font-semibold"
          >
            Áp dụng bộ lọc
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
