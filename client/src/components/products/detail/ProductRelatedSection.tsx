"use client";

import React from "react";
import Link from "next/link";
import SectionHeader from "@/components/common/SectionHeader";
import ProductCard from "@/components/common/ProductCard";
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
        <SectionHeader title={<h2 className="text-lg md:text-xl font-semibold text-neutral-900">Sản phẩm liên quan</h2>} />
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Sản phẩm liên quan
        </h2>
        {categorySlug && (
          <Link
            href={buildProductsByCategory(categorySlug)}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            Xem tất cả →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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

      {categorySlug && (
        <div className="mt-8 text-center md:hidden">
          <Link
            href={buildProductsByCategory(categorySlug)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Xem tất cả →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRelatedSection;
