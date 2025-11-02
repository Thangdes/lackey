"use client";

import React, { useRef } from "react";
import type { Product } from "@/type/product";
import { ROUTES } from "@/constant/route";
import { FaCrown } from "react-icons/fa";
import SectionHeader from "@/components/common/SectionHeader";
import { useProducts } from "@/hook/useProducts";
import { productGridClass } from "@/components/common/grid";
import ProductCard from "../common/ProductCard";

export type ProductCarouselProps = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  pageSize?: number;
  sort?: import("@/type/product").ProductSort;
  showBadges?: boolean;
  showRating?: boolean;
  showAddToCart?: boolean;
  fallbackProducts?: Product[];
};

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  title = "Best Sellers",
  subtitle = "Sản phẩm bán chạy tuần này",
  viewAllHref = ROUTES.products,
  pageSize = 21,
  sort = "popularity",
  showBadges = true,
  showRating = true,
  showAddToCart = true,
  fallbackProducts,
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { items: hookItems, loading } = useProducts({ page: 1, limit: pageSize, sort, fallback: fallbackProducts });

  const renderCard = (p: Product, i: number) => (
    <ProductCard
      key={p.id || `${p.slug}-${i}`}
      product={p}
      index={i}
      showBadges={showBadges}
      showRating={showRating}
      showAddToCart={showAddToCart}
      className="!w-full"
      href={`/products/${p.slug}`}
    />
  );



  if (loading) {
    return (
      <section aria-label="Best Sellers" className="py-8 md:py-12">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-4 md:mb-6 flex items-center justify-between">
            <div className="h-6 w-40 rounded bg-neutral-200 animate-pulse" />
            <div className="h-8 w-24 rounded-full bg-neutral-200 animate-pulse" />
          </div>
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white border border-neutral-100">
                  <div className="relative w-full aspect-[4/5] bg-neutral-100 animate-pulse" />
                  <div className="p-2 space-y-2">
                    <div className="h-4 w-32 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-8 w-full rounded bg-neutral-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className={productGridClass}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-white border border-neutral-100">
                  <div className="relative w-full aspect-[4/5] bg-neutral-100 animate-pulse" />
                  <div className="p-3 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-4 w-1/3 rounded bg-neutral-200 animate-pulse" />
                    <div className="h-9 w-full rounded-md bg-neutral-100 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const list = hookItems ?? [];
  if (list.length === 0) return null;

  return (
    <section aria-label="Best Sellers" className="py-8 md:py-12">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <SectionHeader
          title={
            <>
              <FaCrown className="h-5 w-5 text-[var(--color-cod-gray-900)]" aria-hidden="true" />
              <h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">{title}</h2>
            </>
          }
          subtitle={subtitle}
          ctaHref={viewAllHref}
          ctaText="Xem tất cả"
          align="left"
        />
        <div className="relative">
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {list.map((p, i) => (
                <ProductCard
                  key={p.id || `${p.slug}-${i}`}
                  product={p}
                  index={i}
                  showBadges={showBadges}
                  showRating={showRating}
                  showAddToCart={showAddToCart}
                  href={`/products/${p.slug}`}
                  variant="compact"
                />
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div ref={viewportRef}>
              <div className={productGridClass}>
                {list.map((p, i) => renderCard(p, i))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
