"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FilterBarProps = {
  productCount?: number;
  selectedSize?: string;
  selectedType?: string;
  selectedColor?: string;
  onSizeChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onColorChange?: (value: string) => void;
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

export default function ProductsFilterBar({
  productCount = 0,
  selectedSize = "all",
  selectedType = "all",
  selectedColor = "all",
  onSizeChange,
  onTypeChange,
  onColorChange,
}: FilterBarProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#2d2d2d] py-4 bg-[#f5f1e8]">
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm font-mono tracking-wider text-[#2d2d2d] uppercase">Filter:</span>
        
        <Select value={selectedSize} onValueChange={onSizeChange}>
          <SelectTrigger className="w-[210px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none">
            <SelectValue placeholder="Chất liệu" />
          </SelectTrigger>
          <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
            {MATERIALS.map((material) => (
              <SelectItem key={material.value} value={material.value} className="text-sm">
                {material.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[220px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none">
            <SelectValue placeholder="Phong cách" />
          </SelectTrigger>
          <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
            {STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value} className="text-sm">
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedColor} onValueChange={onColorChange}>
          <SelectTrigger className="w-[200px] border-2 border-[#2d2d2d] bg-[#f5f1e8] text-sm rounded-none">
            <SelectValue placeholder="Màu sắc" />
          </SelectTrigger>
          <SelectContent className="bg-[#f5f1e8] border-2 border-[#2d2d2d] rounded-none">
            {COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value} className="text-sm">
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
