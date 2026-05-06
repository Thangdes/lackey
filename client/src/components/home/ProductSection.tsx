"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { Star } from "lucide-react";

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

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header with Brand Tabs */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {title}
          </h2>

          {/* Brand Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand.id)}
                className={`
                  px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors rounded
                  ${activeBrand === brand.id 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                `}
              >
                {brand.label}
              </button>
            ))}
            <Link
              href={ROUTES.products}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              Xem tất cả
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {filteredProducts.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`${ROUTES.products}/${product.slug}`}
              className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.badge && (
                    <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">
                      {product.badge}
                    </div>
                  )}
                  {product.discount && (
                    <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                {/* Name */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                  {product.name}
                </h3>

                {/* Specs */}
                {product.specs && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.specs.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="mb-2">
                  {product.originalPrice ? (
                    <>
                      <div className="text-xs text-gray-400 line-through">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                      </div>
                      <div className="text-base font-bold text-red-600">
                        {product.price.toLocaleString("vi-VN")}đ
                      </div>
                    </>
                  ) : (
                    <div className="text-base font-bold text-gray-900">
                      {product.price.toLocaleString("vi-VN")}đ
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-900 ml-0.5">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.ratingCount})
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
