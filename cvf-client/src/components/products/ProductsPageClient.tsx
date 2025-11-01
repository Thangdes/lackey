"use client";

import React, { useState } from "react";
import ProductGrid from "@/components/common/ProductGrid";
import ProductsFilterBar from "@/components/products/ProductsFilterBar";
import { useProductQueryParams } from "@/hook/useProductQueryParams";

const ProductsPageClient: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");

  const {
    sort,
    q,
    selectedCategories,
  } = useProductQueryParams();

  return (
    <div className="min-h-screen bg-white px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <ProductsFilterBar
        productCount={0}
        selectedSize={selectedSize}
        selectedType={selectedType}
        selectedColor={selectedColor}
        onSizeChange={setSelectedSize}
        onTypeChange={setSelectedType}
        onColorChange={setSelectedColor}
      />

      <div className="py-8">
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
