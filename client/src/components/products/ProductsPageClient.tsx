"use client";

import React, { useState } from "react";
import ProductGrid from "@/components/common/ProductGrid";
import ProductsFilterBar from "@/components/products/ProductsFilterBar";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import { useProductQueryParams } from "@/hook/useProductQueryParams";
import { Button } from "@/components/ui/button";
import { FiFilter } from "react-icons/fi";

const ProductsPageClient: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const {
    sort,
    q,
    selectedCategories,
  } = useProductQueryParams();

  const activeFiltersCount = [selectedSize, selectedType, selectedColor].filter(
    (val) => val !== "all"
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f1e8] px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      {/* <div className="pt-6">
        <Breadcrumb
          items={[
            { name: "Sản phẩm" }
          ]}
        />
      </div> */}

      <ProductsFilterBar
        productCount={0}
        selectedSize={selectedSize}
        selectedType={selectedType}
        selectedColor={selectedColor}
        onSizeChange={setSelectedSize}
        onTypeChange={setSelectedType}
        onColorChange={setSelectedColor}
      />
      
      <div className="md:hidden fixed bottom-6 left-4 z-40">
        <Button
          onClick={() => setMobileFilterOpen(true)}
          className="bg-[#2d2d2d] hover:bg-[#2d2d2d]/90 text-[#f5f1e8] shadow-lg border-2 border-[#2d2d2d] rounded-none w-14 h-14 p-0 flex items-center justify-center relative"
        >
          <FiFilter className="w-6 h-6" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#f5f1e8] text-[#2d2d2d] text-xs font-mono font-bold border border-[#2d2d2d] w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>
      
      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        selectedSize={selectedSize}
        selectedType={selectedType}
        selectedColor={selectedColor}
        onSizeChange={setSelectedSize}
        onTypeChange={setSelectedType}
        onColorChange={setSelectedColor}
        productCount={0}
      />

      <div className="py-8 pb-20 md:pb-8">
        <ProductGrid
          query={{
            q,
            sort,
            categoryIds: selectedCategories,
          }}
        />
      </div>
    </div>
  );
};

export default ProductsPageClient;
