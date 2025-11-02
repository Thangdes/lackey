"use client";

import React from "react";
import type { ProductSort } from "@/type/product";
import FilterSection from "@/components/products/FilterSection";
import { Checkbox } from "@/components/ui/checkbox";
import { FiFilter } from "react-icons/fi";

export type ProductsFilterSidebarProps = {
  className?: string;
  show?: boolean;
  sort: ProductSort;
  onChangeSort: (val: ProductSort) => void;
  SORT_OPTIONS: { label: string; value: ProductSort }[];
  OFFER_OPTIONS?: string[];
  BRAND_OPTIONS?: { id: string; name: string }[];
  CATEGORY_OPTIONS: { id: string; name: string }[];
  DIETARY_OPTIONS?: string[];

  selectedBrands: string[]; // supplier ids
  selectedDietary: string[];
  selectedCategories: string[]; 

  toggleBrand: (id: string) => void;
  toggleDietary: (val: string) => void;
  toggleCategory: (id: string) => void;
};

const ProductsFilterSidebar: React.FC<ProductsFilterSidebarProps> = ({
  className = "",
  show = true,
  // sort, // Unused for now
  // onChangeSort, // Unused for now
  // OFFER_OPTIONS, // Unused for now
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  selectedBrands,
  // selectedDietary, // Unused for now
  selectedCategories,
  toggleBrand,
  // toggleDietary, // Unused for now
  toggleCategory,
}) => {
  const toId = (prefix: string, val: string) =>
    `${prefix}-${val}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  return (
    <aside className={[`${show ? "block" : "hidden"}`, className].join(" ")}> 
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#AE1C2C] to-[#AE1C2C]/90 px-6 py-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <FiFilter className="w-5 h-5" />
            Bộ lọc tìm kiếm
          </h2>
        </div>
        
        <div className="p-6 space-y-6">

          {Array.isArray(BRAND_OPTIONS) && BRAND_OPTIONS.length > 0 ? (
            <FilterSection title="Thương hiệu">
              <div className="grid grid-cols-1 gap-3 text-sm max-h-64 overflow-y-auto">
                {BRAND_OPTIONS.map((b) => {
                  const id = toId("brand", b.id);
                  return (
                    <div className="flex items-center gap-3" key={b.id}>
                      <Checkbox
                        id={id}
                        checked={selectedBrands.includes(b.id)}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            toggleBrand(b.id);
                          }
                        }}
                      />
                      <label htmlFor={id} className="cursor-pointer select-none text-gray-700 hover:text-gray-900">
                        {b.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </FilterSection>
          ) : null}

          <FilterSection title="Danh mục">
            <div className="grid grid-cols-1 gap-3 text-sm max-h-64 overflow-y-auto">
              {React.useMemo(() => {
                const seen = new Set<string>();
                return CATEGORY_OPTIONS.filter((c) => {
                  if (!c?.id) return false;
                  if (seen.has(c.id)) return false;
                  seen.add(c.id);
                  return true;
                });
              }, [CATEGORY_OPTIONS]).map((c) => {
                const id = toId("category", c.id);
                return (
                  <div className="flex items-center gap-3" key={c.id}>
                    <Checkbox
                      id={id}
                      checked={selectedCategories.includes(c.id)}
                      onCheckedChange={(checked) => {
                        if (typeof checked === 'boolean') {
                          toggleCategory(c.id);
                        }
                      }}
                    />
                    <label htmlFor={id} className="cursor-pointer select-none text-gray-700 hover:text-gray-900">
                      {c.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </FilterSection>
        </div>
      </div>
    </aside>
  );
};

export default ProductsFilterSidebar;
