"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/common/ProductGrid";
import ProductsFilterSidebar from "@/components/products/ProductsFilterSidebar";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiFilter, FiSliders } from "react-icons/fi";
import { useProductQueryParams } from "@/hook/useProductQueryParams";
import { SORT_OPTIONS, SORT_DISPLAY, OFFER_OPTIONS } from "@/constant/product";
import { useOptionsData } from "@/hook/useOptionsData";
import SelectedFilterChips from "./SelectedFilterChips";
import { toSlug } from "@/utils/slug";

const ProductsPageClient: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  const {
    sort,
    setSort,
    q,
    selectedCategories,
    setSelectedCategories,
    selectedBrands,
    setSelectedBrands,
    activeFilterCount,
  } = useProductQueryParams();

  const { categoryOptions, brandOptions } = useOptionsData();

  const sortOptions = useMemo(() => SORT_OPTIONS, []);
  const sortDisplay = useMemo(() => SORT_DISPLAY, []);

  useEffect(() => {
    if (!brandOptions || brandOptions.length === 0) return;
    try {
      const single = searchParams?.get("supplier");
      const singleAlt = searchParams?.get("supplierSlug");
      const multi = (searchParams?.getAll("supplierSlugs[]") ?? []).filter(Boolean);
      const slugs = new Set<string>();
      if (single) slugs.add(toSlug(single));
      if (singleAlt) slugs.add(toSlug(singleAlt));
      for (const m of multi) slugs.add(toSlug(m));
      if (slugs.size > 0) {
        const matched = brandOptions.filter((m) => slugs.has(toSlug(m.name))).map((m) => m.id);
        if (matched.length > 0) {
          setSelectedBrands((prev) => (prev.length === 0 ? matched : prev));
        }
      }
    } catch {}
  }, [brandOptions, searchParams, setSelectedBrands]);

  const toggleIn = <T extends string>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handleToggleFilters = () => setShowFilters((s) => !s);
  const handleRemoveCategory = (cid: string) => setSelectedCategories((v) => v.filter((x) => x !== cid));
  const handleRemoveBrand = (bid: string) => setSelectedBrands((v) => v.filter((x) => x !== bid));
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
  };
  const handleSortChange = useCallback((v: import("@/type/product").ProductSort) => {
    setSort(v);
  }, []);
  const handleToggleBrand = (bid: string) => {
    console.log('[DEBUG] Toggling brand:', bid, 'Current:', selectedBrands);
    setSelectedBrands((v) => {
      const newValue = toggleIn(v, bid);
      console.log('[DEBUG] New brands:', newValue);
      return newValue;
    });
  };
  const handleToggleCategory = (c: string) => {
    console.log('[DEBUG] Toggling category:', c, 'Current:', selectedCategories);
    setSelectedCategories((v) => {
      const newValue = toggleIn(v, c);
      console.log('[DEBUG] New categories:', newValue);
      return newValue;
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8]">
      <div className="bg-[#F3F5F8] sticky top-0 z-30">
        <div className="">
          <div className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Sản phẩm</h1>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#AE1C2C] text-white">
                  {activeFilterCount} bộ lọc
                </span>
              )}
              <Button
                type="button"
                onClick={handleToggleFilters}
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiFilter className="w-4 h-4" />
                Lọc
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                <FiSliders className="w-4 h-4" /> 
                Sắp xếp
              </label>
              <Select
                value={sort}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 h-10 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 transition-all duration-200 min-w-[160px]">
                  <SelectValue 
                    placeholder="Chọn cách sắp xếp"
                  >
                    {sort && (() => {
                      const currentOption = sortOptions.find(o => o.value === sort);
                      const currentDisplay = sortDisplay[sort];
                      if (currentOption && currentDisplay) {
                        return (
                          <div className="flex items-center gap-2">
                            <span className="text-base">{currentDisplay.icon}</span>
                            <span className="hidden sm:inline">{currentOption.label}</span>
                            <span className="sm:hidden">{currentDisplay.shortLabel}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-gray-200 bg-white shadow-xl">
                  {sortOptions.map((option) => {
                    const display = sortDisplay[option.value];
                    return (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      >
                        <span className="text-base">{display.icon}</span>
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="sm:hidden">{display.shortLabel}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="lg:hidden px-4 pb-4">
          <SelectedFilterChips
            categoryOptions={categoryOptions}
            brandOptions={brandOptions}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedDietary={[]}
            onRemoveCategory={handleRemoveCategory}
            onRemoveBrand={handleRemoveBrand}
            onRemoveDietary={() => {}}
            onClearAll={handleClearAll}
            activeFilterCount={activeFilterCount}
            variant="mobile"
          />
        </div>
      </div>

      <div className="">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32">
              <ProductsFilterSidebar
                show={true}
                sort={sort}
                onChangeSort={handleSortChange}
                SORT_OPTIONS={sortOptions}
                BRAND_OPTIONS={brandOptions}
                CATEGORY_OPTIONS={categoryOptions}
                selectedBrands={selectedBrands}
                selectedDietary={[]}
                selectedCategories={selectedCategories}
                toggleBrand={handleToggleBrand}
                toggleDietary={() => {}}
                toggleCategory={handleToggleCategory}
              />
            </div>
          </div>

          {showFilters && (
            <div className="lg:hidden mb-6">
              <ProductsFilterSidebar
                show={true}
                sort={sort}
                onChangeSort={handleSortChange}
                SORT_OPTIONS={sortOptions}
                BRAND_OPTIONS={brandOptions}
                CATEGORY_OPTIONS={categoryOptions}
                selectedBrands={selectedBrands}
                selectedDietary={[]}
                selectedCategories={selectedCategories}
                toggleBrand={handleToggleBrand}
                toggleDietary={() => {}}
                toggleCategory={handleToggleCategory}
              />
            </div>
          )}

          <div className="lg:col-span-3">
            <div className="hidden lg:block mb-6">
              <SelectedFilterChips
                categoryOptions={categoryOptions}
                brandOptions={brandOptions}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                selectedDietary={[]}
                onRemoveCategory={handleRemoveCategory}
                onRemoveBrand={handleRemoveBrand}
                onRemoveDietary={() => {}}
                onClearAll={handleClearAll}
                activeFilterCount={activeFilterCount}
                variant="desktop"
              />
            </div>
            
            <ProductGrid
              title={undefined}
              query={{ 
                sort, 
                q, 
                categoryIds: selectedCategories,
                supplierIds: selectedBrands
              }}
              limit={0}
              pageSize={24}
              compact={false}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProductsPageClient;
