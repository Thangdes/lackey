"use client";

import React from "react";
import Link from "next/link";
import SectionHeader from "@/components/common/SectionHeader";
import ProductCard from "@/components/common/ProductCard";
import { productGridClass } from "@/components/common/grid";
import { ROUTES } from "@/constant/route";
import { buildProductsByCategory } from "@/constant/route";
import type { Product } from "@/type/product";

export type ProductRelatedSectionProps = {
  related: Product[];
  loading?: boolean;
  categorySlug?: string | null;
};

const ProductRelatedSection: React.FC<ProductRelatedSectionProps> = ({ related, loading, categorySlug }) => {
  if (loading) {
    return (
      <div className="mt-12">
        <SectionHeader title={<h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">Sản phẩm liên quan</h2>} />
        {/* Keep skeleton rendering in parent if needed to avoid import duplication */}
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-12">
      <SectionHeader title={<h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">Sản phẩm liên quan</h2>} />
      <div className={productGridClass}>
        {related.map((prod, i) => (
          <ProductCard
            key={prod.id || `${prod.slug}-${i}`}
            product={prod}
            index={i}
            href={{ pathname: ROUTES.products, query: { q: prod.name } }}
            className="!w-full"
            desktopPerRow={5}
          />
        ))}
      </div>
      {categorySlug ? (
        <div className="mt-4 text-right">
          <Link href={buildProductsByCategory(categorySlug)} className="text-sm font-medium text-[var(--color-cod-gray-900)] hover:underline">Xem tất cả</Link>
        </div>
      ) : null}
    </div>
  );
};

export default ProductRelatedSection;
