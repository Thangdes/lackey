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

const MATERIALS = [
  { value: "all", label: "Tất cả chất liệu" },
  { value: "acrylic", label: "Acrylic" },
  { value: "metal", label: "Kim loại" },
  { value: "leather", label: "Da" },
  { value: "wood", label: "Gỗ" },
  { value: "rubber", label: "Nhựa" },
];

const STYLES = [
  { value: "all", label: "Tất cả phong cách" },
  { value: "anime", label: "Anime" },
  { value: "kpop", label: "Kpop" },
  { value: "cartoon", label: "Cartoon" },
  { value: "minimalist", label: "Tối giản" },
  { value: "cute", label: "Dễ thương" },
  { value: "custom", label: "Tùy chỉnh" },
];

const COLORS = [
  { value: "all", label: "Tất cả màu sắc" },
  { value: "black", label: "Đen" },
  { value: "white", label: "Trắng" },
  { value: "red", label: "Đỏ" },
  { value: "blue", label: "Xanh" },
  { value: "yellow", label: "Vàng" },
  { value: "pink", label: "Hồng" },
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
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col bg-[#f5f1e8] rounded-none">
        <SheetHeader className="shrink-0 border-b-2 border-[#2d2d2d]">
          <div className="flex items-center justify-between px-4 py-4">
            <SheetTitle className="text-left flex items-center gap-2 font-mono tracking-wider text-[#2d2d2d] uppercase">
              <FiFilter className="w-5 h-5" />
              Bộ lọc
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-[#2d2d2d]/10 border border-[#2d2d2d] transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between px-4 pb-3">
            <span className="text-sm font-mono text-[#2d2d2d]/70">
              {productCount} sản phẩm
            </span>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-[#2d2d2d] hover:bg-[#2d2d2d]/10 h-8 font-mono border border-[#2d2d2d] rounded-none"
              >
                Xóa tất cả ({activeFiltersCount})
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-mono tracking-wider text-[#2d2d2d] block uppercase">
                Chất liệu
              </label>
              <Select value={selectedSize} onValueChange={onSizeChange}>
                <SelectTrigger className="w-full border-2 border-[#2d2d2d] bg-[#f5f1e8] rounded-none">
                  <SelectValue placeholder="Chọn chất liệu" />
                </SelectTrigger>
                <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
                  {MATERIALS.map((material) => (
                    <SelectItem key={material.value} value={material.value}>
                      {material.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono tracking-wider text-[#2d2d2d] block uppercase">
                Phong cách
              </label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full border-2 border-[#2d2d2d] bg-[#f5f1e8] rounded-none">
                  <SelectValue placeholder="Chọn phong cách" />
                </SelectTrigger>
                <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
                  {STYLES.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-mono tracking-wider text-[#2d2d2d] block uppercase">
                Màu sắc
              </label>
              <Select value={selectedColor} onValueChange={onColorChange}>
                <SelectTrigger className="w-full border-2 border-[#2d2d2d] bg-[#f5f1e8] rounded-none">
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
                <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-4" />
        </div>

        <div className="shrink-0 border-t-2 border-[#2d2d2d] p-4 bg-[#f5f1e8]">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#2d2d2d] hover:bg-[#2d2d2d]/90 text-[#f5f1e8] h-12 rounded-none font-mono tracking-wider uppercase"
          >
            Áp dụng bộ lọc
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
