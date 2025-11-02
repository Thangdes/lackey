"use client";

import React from "react";
import ProductTabs from "@/components/products/detail/ProductTabs";
import type { ProductVariant } from "@/type/product";

export type ProductTabsSectionProps = {
  tab: "desc" | "reviews" | "info" | "supplier";
  onChange: (tab: "desc" | "reviews" | "info" | "supplier") => void;
  description?: string | null;
  ratingValue: number;
  ratingCount: number;
  variants: Array<ProductVariant & { price?: number; discountPrice?: number | null }>;
  supplier: {
    id?: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    description?: string | null;
  };
};

const ProductTabsSection: React.FC<ProductTabsSectionProps> = ({ tab, onChange, description, ratingValue, ratingCount, variants, supplier }) => {
  return (
    <div className="mt-8">
      <ProductTabs
        tab={tab}
        onChange={onChange}
        description={description}
        ratingValue={ratingValue}
        ratingCount={ratingCount}
        variants={variants}
        supplier={supplier}
        displayMode="stacked"
      />
    </div>
  );
};

export default ProductTabsSection;
