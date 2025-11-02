"use client";
import React, { useMemo } from "react";
import type { Category } from "@/service/category.service";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type NewProductFormProps = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  categoryId: string;
  categories: Category[];
  categoryQuery: string;
  supplierId: string;
  suppliers: Array<{ id: string; name: string }>;
  supplierQuery: string;
  initialBuyCount: string;
  slugError: string | null;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onIsActiveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (value: string) => void;
  onCategoryQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSupplierChange: (value: string) => void;
  onSupplierQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInitialBuyCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function NewProductForm({
  name,
  slug,
  description,
  isActive,
  categoryId,
  categories,
  categoryQuery,
  supplierId,
  suppliers,
  supplierQuery,
  initialBuyCount,
  slugError,
  onNameChange,
  onSlugChange,
  onDescriptionChange,
  onIsActiveChange,
  onCategoryChange,
  onCategoryQueryChange,
  onSupplierChange,
  onSupplierQueryChange,
  onInitialBuyCountChange,
}: NewProductFormProps) {
  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => (c.name + " " + (c.slug || "")).toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  const filteredSuppliers = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, supplierQuery]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
        <Input value={name} onChange={onNameChange} placeholder="Tên sản phẩm" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Slug (URL thân thiện)</label>
        <Input value={slug} onChange={onSlugChange} placeholder="slug-san-pham" required />
        {slugError && <div className="text-xs text-red-600 mt-1">{slugError}</div>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          value={description}
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

      <div>
        <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
        <Input
          value={supplierQuery}
          onChange={onSupplierQueryChange}
          placeholder="Tìm nhà cung cấp..."
          className="mb-2"
        />
        <Select value={supplierId} onValueChange={onSupplierChange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            {filteredSuppliers.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">Không có nhà cung cấp</div>
            ) : (
              filteredSuppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Số lượng mua ban đầu</label>
        <Input
          type="number"
          value={initialBuyCount}
          onChange={onInitialBuyCountChange}
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={onIsActiveChange}
        />
        <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
          Hiển thị sản phẩm
        </label>
      </div>
    </div>
  );
}
