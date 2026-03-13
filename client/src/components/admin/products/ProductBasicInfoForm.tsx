"use client";
import React, { useMemo } from "react";
import type { Product } from "@/type/product";
import type { Category } from "@/service/category.service";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ProductBasicInfoFormProps = {
  product: Product;
  categoryId: string;
  categories: Category[];
  categoryQuery: string;
  slugError: string | null;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onIsActiveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onCategoryQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProductBasicInfoForm({
  product,
  categoryId,
  categories,
  categoryQuery,
  slugError,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onIsActiveChange,
  onCategoryChange,
  onCategoryQueryChange,
}: ProductBasicInfoFormProps) {
  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => (c.name + " " + (c.slug || "")).toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
        <Input value={product.name || ""} onChange={onNameChange} placeholder="Tên sản phẩm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug (URL thân thiện)</label>
        <Input
          value={product.slug || ""}
          onChange={onSlugChange}
          placeholder="slug-san-pham"
        />
        {slugError && <div className="text-xs text-red-600 mt-1">{slugError}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          value={product.description || ""}
          onChange={onDescriptionChange}
          className="w-full border rounded-md p-2 min-h-[100px]"
          placeholder="Mô tả sản phẩm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Danh mục</label>
        <Input
          value={categoryQuery}
          onChange={onCategoryQueryChange}
          placeholder="Tìm danh mục..."
          className="mb-2"
        />
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">Không có danh mục</div>
            ) : (
              filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={product.isActive ?? true}
          onChange={onIsActiveChange}
        />
        <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
          Hiển thị sản phẩm
        </label>
      </div>
    </div>
  );
}
