"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { Star } from "lucide-react";

type ProductBrand = "all" | "gateron" | "cherry" | "akko" | "keychron" | "gmk" | "ducky";

type FeaturedProduct = {
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
  brand: ProductBrand;
};

const BRANDS = [
  { id: "all" as ProductBrand, label: "Tất cả" },
  { id: "gateron" as ProductBrand, label: "Gateron" },
  { id: "cherry" as ProductBrand, label: "Cherry MX" },
  { id: "akko" as ProductBrand, label: "Akko" },
  { id: "keychron" as ProductBrand, label: "Keychron" },
  { id: "gmk" as ProductBrand, label: "GMK" },
  { id: "ducky" as ProductBrand, label: "Ducky" },
];

const ALL_PRODUCTS: FeaturedProduct[] = [
  {
    id: "KB001",
    name: "Keycap Artisan Anime Nezuko",
    slug: "keycap-artisan-anime-nezuko",
    price: 350000,
    originalPrice: 450000,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    badge: "HOT",
    discount: 22,
    rating: 4.9,
    ratingCount: 127,
    specs: ["Resin handmade", "Cherry MX"],
    brand: "cherry",
  },
  {
    id: "KB002",
    name: "Set Keycap PBT Pastel Rainbow",
    slug: "set-keycap-pbt-pastel-rainbow",
    price: 580000,
    originalPrice: 720000,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    badge: "NEW",
    discount: 19,
    rating: 4.7,
    ratingCount: 89,
    specs: ["108 phím", "PBT dye-sub"],
    brand: "gmk",
  },
  {
    id: "KB003",
    name: "Gateron Yellow Switch (10 cái)",
    slug: "gateron-yellow-switch-10-cai",
    price: 50000,
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
    rating: 4.8,
    ratingCount: 312,
    specs: ["Linear 50g", "Hành trình 4mm"],
    brand: "gateron",
  },
  {
    id: "KB005",
    name: "Kit Bàn Phím Lucky65 - Nhôm CNC",
    slug: "kit-ban-phim-lucky65-nhom-cnc",
    price: 2850000,
    originalPrice: 3200000,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    badge: "PREMIUM",
    discount: 11,
    rating: 4.9,
    ratingCount: 43,
    specs: ["Nhôm CNC", "Hotswap PCB"],
    brand: "keychron",
  },
  {
    id: "KB008",
    name: "Bàn Phím Akko 3068B Plus",
    slug: "ban-phim-akko-3068b-plus",
    price: 1680000,
    originalPrice: 1950000,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    discount: 14,
    rating: 4.8,
    ratingCount: 67,
    specs: ["Akko CS", "Bluetooth 5.0"],
    brand: "akko",
  },
  {
    id: "KB004",
    name: "Dây Cáp Custom Coiled - Pastel Pink",
    slug: "day-cap-custom-coiled-pastel-pink",
    price: 420000,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    rating: 4.6,
    ratingCount: 54,
    specs: ["USB-C to USB-A", "Dài 1.5m"],
    brand: "all",
  },
  {
    id: "KB013",
    name: "Cherry MX Red Switch (10 cái)",
    slug: "cherry-mx-red-switch-10-cai",
    price: 120000,
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
    rating: 4.8,
    ratingCount: 245,
    specs: ["Linear 45g", "100M lần nhấn"],
    brand: "cherry",
  },
  {
    id: "KB020",
    name: "Bàn Phím Ducky One 3 TKL",
    slug: "ban-phim-ducky-one-3-tkl",
    price: 2350000,
    originalPrice: 2650000,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    discount: 11,
    rating: 4.9,
    ratingCount: 87,
    specs: ["Cherry MX", "RGB per-key"],
    brand: "ducky",
  },
  {
    id: "KB011",
    name: "Set Keycap GMK Clone - Olivia",
    slug: "set-keycap-gmk-clone-olivia",
    price: 720000,
    originalPrice: 850000,
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    discount: 15,
    rating: 4.9,
    ratingCount: 156,
    specs: ["PBT double-shot", "139 phím"],
    brand: "gmk",
  },
  {
    id: "KB021",
    name: "Keychron K8 Pro Wireless",
    slug: "keychron-k8-pro-wireless",
    price: 2100000,
    originalPrice: 2400000,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    discount: 13,
    rating: 4.8,
    ratingCount: 134,
    specs: ["Wireless", "Hotswap"],
    brand: "keychron",
  },
  {
    id: "KB022",
    name: "Akko CS Jelly Switch (45 cái)",
    slug: "akko-cs-jelly-switch-45-cai",
    price: 270000,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    rating: 4.7,
    ratingCount: 178,
    specs: ["Tactile 55g", "Trong suốt"],
    brand: "akko",
  },
  {
    id: "KB023",
    name: "Gateron Pro Yellow (10 cái)",
    slug: "gateron-pro-yellow-10-cai",
    price: 65000,
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
    rating: 4.9,
    ratingCount: 256,
    specs: ["Linear 50g", "Pre-lubed"],
    brand: "gateron",
  },
];

export default function FeaturedProducts() {
  const [activeBrand, setActiveBrand] = useState<ProductBrand>("all");

  const filteredProducts = activeBrand === "all" 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.brand === activeBrand);

  return (
    <section className="w-full bg-white py-6 md:py-8 border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {}
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Bàn phím cơ bán chạy
          </h2>

          {}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {BRANDS.map((brand) => (
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

        {}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
          {filteredProducts.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`${ROUTES.products}/${product.slug}`}
              className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              {}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                />
                
                {}
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

              {}
              <div className="p-3">
                {}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
                  {product.name}
                </h3>

                {}
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

                {}
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

                {}
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
