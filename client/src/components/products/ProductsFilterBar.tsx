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

const SIZES = [
  { value: "all", label: "All Sizes" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

const TYPES = [
  { value: "all", label: "All Types" },
  { value: "anime", label: "Anime" },
  { value: "kpop", label: "Kpop" },
  { value: "cartoon", label: "Cartoon" },
  { value: "custom", label: "Custom" },
];

const COLORS = [
  { value: "all", label: "All Colors" },
  { value: "black", label: "Black" },
  { value: "white", label: "White" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "multi", label: "Multicolor" },
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
    <div className="flex items-center justify-between border-b border-black py-4 bg-white">
      {/* Desktop Filters - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-900">Filter:</span>
        
        <Select value={selectedSize} onValueChange={onSizeChange}>
          <SelectTrigger className="w-[140px] border-black bg-white text-sm">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {SIZES.map((size) => (
              <SelectItem key={size.value} value={size.value} className="text-sm">
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[160px] border-black bg-white text-sm">
            <SelectValue placeholder="Product type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-sm">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Color Filter */}
        <Select value={selectedColor} onValueChange={onColorChange}>
          <SelectTrigger className="w-[140px] border-black bg-white text-sm">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {COLORS.map((color) => (
              <SelectItem key={color.value} value={color.value} className="text-sm">
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Count - Hidden on mobile */}
      <div className="hidden md:block text-sm text-neutral-600">
        {productCount} {productCount === 1 ? "product" : "products"}
      </div>
      
      {/* Mobile Product Count - Visible only on mobile */}
      <div className="md:hidden text-sm text-neutral-600">
        {productCount} sản phẩm
      </div>
    </div>
  );
}
