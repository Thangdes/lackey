"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import ProductCard from "@/components/common/ProductCard";
import type { HomeSectionProduct } from "@/lib/home-data";
import type { Product } from "@/type/product";

type BrandFilter = {
  id: string;
  label: string;
};

type Props = {
  products: HomeSectionProduct[];
  categories?: Array<{ id: string; name: string; slug: string }>;
};

function toProductCard(p: HomeSectionProduct): Product {
  const firstVariant = p.variants?.[0];
  const price = firstVariant?.discountPrice ?? firstVariant?.price ?? 0;
  const originalPrice = firstVariant?.discountPrice
    ? firstVariant.price
    : undefined;
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    thumbnailUrl: p.thumbnailUrl,
    images: p.images ?? [],
    variants: p.variants,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    buyCount: p.buyCount,
    totalBuyCount: p.totalBuyCount,
    category: p.category,
    priceEffective: p.priceEffective ?? price,
    compareAt: p.compareAt ?? originalPrice,
    isOnSale: p.isOnSale ?? !!p.compareAt,
    discountPercent: p.discountPercent ?? undefined,
    isOutOfStock: p.isOutOfStock ?? false,
    totalStock: p.totalStock ?? 99,
    badges: p.badges ?? [],
  } as Product;
}

export default function FeaturedProducts({ products, categories = [] }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>("all");

  const brandFilters: BrandFilter[] = [
    { id: "all", label: "Tất cả" },
    ...categories.slice(0, 5).map((c) => ({ id: c.slug, label: c.name })),
  ];

  const filtered = activeSlug === "all"
    ? products
    : products.filter((p) => p.category?.slug === activeSlug);

  const displayed = filtered.slice(0, 6);

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Bàn phím cơ bán chạy
          </h2>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {brandFilters.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveSlug(brand.id)}
                className={`
                  px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors rounded-lg
                  ${activeSlug === brand.id
                    ? "text-neutral-900 bg-neutral-100 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }
                `}
              >
                {brand.label}
              </button>
            ))}
            <Link
              href={ROUTES.products}
              className="text-sm text-neutral-700 hover:text-neutral-900 font-medium whitespace-nowrap ml-2 shrink-0"
            >
              Xem tất cả
            </Link>
          </div>
        </div>

        {displayed.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
            {displayed.map((p, index) => (
              <ProductCard
                key={p.id}
                product={toProductCard(p)}
                index={index}
                showAddToCart={false}
                className="!w-full"
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-neutral-400 text-sm">
            Chưa có sản phẩm trong mục này.
          </div>
        )}
      </div>
    </section>
  );
}
