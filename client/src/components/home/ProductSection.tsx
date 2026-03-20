"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import ProductCard from "@/components/common/ProductCard";
import type { Product as ProductType } from "@/type/product";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  discount?: number;
  rating: number;
  ratingCount: number;
  specs?: string[];
  brand?: string;
};

type Brand = {
  id: string;
  label: string;
};

type ProductSectionProps = {
  title: string;
  brands: Brand[];
  products: Product[];
  defaultBrand?: string;
};

export default function ProductSection({ 
  title, 
  brands, 
  products,
  defaultBrand = "all" 
}: ProductSectionProps) {
  const [activeBrand, setActiveBrand] = useState(defaultBrand);

  const filteredProducts = activeBrand === "all" 
    ? products 
    : products.filter(p => p.brand === activeBrand);

  // Convert to ProductType format for ProductCard
  const convertedProducts: ProductType[] = filteredProducts.slice(0, 6).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumbnailUrl: product.image,
    images: [product.image],
    priceEffective: product.price,
    compareAt: product.originalPrice,
    isOnSale: !!product.originalPrice,
    discountPercent: product.discount,
    ratingAvg: product.rating,
    ratingCount: product.ratingCount,
    totalStock: 100,
    isOutOfStock: false,
    badges: product.badge ? [product.badge] : [],
    variants: [{
      id: `${product.id}-default`,
      name: "Default",
      sku: product.id,
      price: product.price,
      discountPrice: product.originalPrice ? product.price : null,
      stockQuantity: 100,
    }],
  })) as ProductType[];

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-neutral-100">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header with Brand Tabs */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
            {title}
          </h2>

          {/* Brand Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.id)}
                className={`
                  px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all rounded-lg
                  ${activeBrand === brand.id 
                    ? "text-neutral-900 bg-neutral-100 shadow-sm" 
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }
                `}
              >
                {brand.label}
              </button>
            ))}
            <Link
              href={ROUTES.products}
              className="text-sm text-neutral-700 hover:text-neutral-900 font-medium whitespace-nowrap ml-2"
            >
              Xem tất cả →
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {convertedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              showAddToCart={true}
              className="!w-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
