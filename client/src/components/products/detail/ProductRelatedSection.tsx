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
        <SectionHeader title={<h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">Sản phẩm liên quan</h2>} />
        {/* Keep skeleton rendering in parent if needed to avoid import duplication */}
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-16">
      {/* Retro Section Header */}
      <div className="mb-8 text-center">
        <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl font-bold uppercase tracking-wider text-black inline-block px-6 py-3 bg-[#fff100] border-4 border-black shadow-[8px_8px_0px_0px_#B5CCBC]">
          Sản phẩm liên quan
        </h2>
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
        <div className="mt-8 text-center">
          <Link
            href={buildProductsByCategory(categorySlug)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Xem tất cả →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductRelatedSection;
