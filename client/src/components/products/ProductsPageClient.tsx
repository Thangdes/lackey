"use client";

import React, { useMemo, useState, useEffect } from "react";
import ProductGrid from "@/components/common/ProductGrid";
import ProductsFilterBar from "@/components/products/ProductsFilterBar";
import { useProductQueryParams } from "@/hook/useProductQueryParams";
import type { ProductSort } from "@/type/product";
import { useProductList } from "@/hook/useProduct";

const ProductsPageClient: React.FC = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const {
    sort,
    q,
    selectedCategories,
  } = useProductQueryParams();

  const [localSort, setLocalSort] = useState<ProductSort>(sort || "priceAsc");
  useEffect(() => {
    setLocalSort(sort || "priceAsc");
  }, [sort]);

  const priceRange = useMemo(() => {
    const min = minPrice.trim() === "" ? undefined : Number(minPrice.replace(/\D+/g, ""));
    const max = maxPrice.trim() === "" ? undefined : Number(maxPrice.replace(/\D+/g, ""));
    return {
      minPrice: typeof min === "number" && Number.isFinite(min) ? min : undefined,
      maxPrice: typeof max === "number" && Number.isFinite(max) ? max : undefined,
    };
  }, [minPrice, maxPrice]);

  
  const { data: productsData, isLoading: isLoadingCount } = useProductList(
    1, 
    1, 
    selectedCategories.length > 0 ? selectedCategories[0] : undefined, 
    q ?? undefined,
    {
      sort: localSort,
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
    }
  );

  const productCount = productsData?.meta?.total ?? 0;

  return (
    <div className="min-h-screen bg-white px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <ProductsFilterBar
        productCount={productCount}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        sort={localSort}
        onSortChange={setLocalSort}
        loading={isLoadingCount}
      />

      <div className="py-8 pb-20 md:pb-8">
        <ProductGrid
          query={{
            q,
            sort: localSort,
            categoryIds: selectedCategories,
            minPrice: priceRange.minPrice,
            maxPrice: priceRange.maxPrice,
          }}
        />
      </div>
    </div>
  );
};

export default ProductsPageClient;
