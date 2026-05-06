"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { ArrowRight } from "lucide-react";

type Brand = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
};

const KEYBOARD_BRANDS: Brand[] = [
  {
    id: "brand-gateron",
    name: "Gateron",
    slug: "gateron",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    description: "Switch Gateron - Yellow, Red, Brown, Blue",
    productCount: 15,
  },
  {
    id: "brand-cherry",
    name: "Cherry MX",
    slug: "cherry-mx",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    description: "Switch Cherry MX chính hãng",
    productCount: 12,
  },
  {
    id: "brand-akko",
    name: "Akko",
    slug: "akko",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    description: "Bàn phím & Switch Akko",
    productCount: 20,
  },
  {
    id: "brand-keychron",
    name: "Keychron",
    slug: "keychron",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
    description: "Bàn phím Wireless, Hotswap",
    productCount: 18,
  },
  {
    id: "brand-gmk",
    name: "GMK",
    slug: "gmk-keycap",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    description: "Keycap GMK & Clone cao cấp",
    productCount: 14,
  },
  {
    id: "brand-ducky",
    name: "Ducky",
    slug: "ducky",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400",
    description: "Bàn phím Ducky One 2, 3",
    productCount: 10,
  },
];

type Props = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
};

const BrandCategories: React.FC<Props> = ({
  title = "Thương Hiệu Nổi Bật",
  subtitle = "Các thương hiệu bàn phím cơ uy tín, được yêu thích nhất",
  viewAllHref = ROUTES.categories,
  viewAllText = "Xem tất cả thương hiệu",
}) => {
  return (
    <section className="w-full bg-neutral-50 py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-3 tracking-wider uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          {KEYBOARD_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={`${ROUTES.products}?brand=${brand.slug}`}
              className="group bg-white border-2 border-black hover:border-black transition-all overflow-hidden hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              
              {/* Content */}
              <div className="p-3 bg-white border-t-2 border-black">
                <h3 className="text-sm md:text-base font-bold text-center uppercase mb-1">
                  {brand.name}
                </h3>
                <p className="text-xs text-neutral-600 text-center truncate">
                  {brand.description}
                </p>
                <p className="text-xs text-neutral-500 text-center mt-1">
                  {brand.productCount} sản phẩm
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold text-sm uppercase tracking-wider transition-all"
          >
            {viewAllText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandCategories;
