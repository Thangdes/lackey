"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { ROUTES } from "@/constant/route";

// Mock data cho Best Sellers
const BEST_SELLERS = [
  {
    id: "1",
    name: "Móc khóa Anime Naruto",
    slug: "moc-khoa-anime-naruto",
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400",
    price: 45000,
    originalPrice: 65000,
    discount: 31,
    rating: 4.8,
    reviewCount: 124,
    sold: 856,
    badge: "HOT"
  },
  {
    id: "2",
    name: "Móc khóa Kpop BTS",
    slug: "moc-khoa-kpop-bts",
    image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400",
    price: 52000,
    originalPrice: 75000,
    discount: 31,
    rating: 4.9,
    reviewCount: 98,
    sold: 742,
    badge: "TRENDING"
  },
  {
    id: "3",
    name: "Móc khóa Gấu Brown",
    slug: "moc-khoa-gau-brown",
    image: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400",
    price: 38000,
    originalPrice: 55000,
    discount: 31,
    rating: 4.7,
    reviewCount: 156,
    sold: 923,
    badge: "BEST"
  },
  {
    id: "4",
    name: "Móc khóa Doraemon",
    slug: "moc-khoa-doraemon",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    price: 42000,
    originalPrice: 60000,
    discount: 30,
    rating: 4.6,
    reviewCount: 89,
    sold: 678,
    badge: "HOT"
  },
  {
    id: "5",
    name: "Móc khóa Pikachu LED",
    slug: "moc-khoa-pikachu-led",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
    price: 68000,
    originalPrice: 95000,
    discount: 28,
    rating: 4.9,
    reviewCount: 167,
    sold: 1024,
    badge: "NEW"
  },
  {
    id: "6",
    name: "Móc khóa Minion 3D",
    slug: "moc-khoa-minion-3d",
    image: "https://images.unsplash.com/photo-1580870069867-74c57ee60d19?w=400",
    price: 55000,
    originalPrice: 78000,
    discount: 29,
    rating: 4.8,
    reviewCount: 134,
    sold: 891,
    badge: "SALE"
  },
];

const BADGE_STYLES = {
  HOT: "bg-black text-white",
  TRENDING: "bg-black text-white",
  BEST: "bg-black text-white",
  NEW: "bg-white text-black border border-black",
  SALE: "bg-black text-white",
};

export default function BestSellers() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 tracking-wider uppercase">
            Bán chạy nhất
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Sẵn sàng tỏa sáng? Khám phá những móc khóa bán chạy nhất của chúng tôi! 
            Từ nhân vật anime, Kpop đến các thiết kế độc đáo, những sản phẩm yêu thích 
            này mang đến sự kết hợp hoàn hảo giữa phong cách, cá tính và năng lượng LắcKey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {BEST_SELLERS.map((product) => (
            <Link
              key={product.id}
              href={`${ROUTES.products}/${product.slug}`}
              className="group bg-white rounded-none border border-black overflow-hidden hover:bg-black transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${BADGE_STYLES[product.badge as keyof typeof BADGE_STYLES]}`}>
                    {product.badge}
                  </span>
                </div>

                {product.discount > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                      -{product.discount}%
                    </span>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="w-10 h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-3 md:p-4 group-hover:text-white transition-colors">
                <h3 className="text-sm md:text-base font-semibold text-neutral-900 group-hover:text-white mb-2 line-clamp-2 min-h-[2.5rem] transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 fill-black group-hover:fill-white text-black group-hover:text-white transition-colors" />
                    <span className="text-xs md:text-sm font-medium text-neutral-900 group-hover:text-white transition-colors">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="text-xs text-neutral-600 group-hover:text-neutral-300 mb-3 transition-colors">
                  Đã bán: <span className="font-semibold">{product.sold.toLocaleString('vi-VN')}</span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-base md:text-lg font-bold text-black group-hover:text-white transition-colors">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs md:text-sm text-neutral-400 group-hover:text-neutral-300 line-through transition-colors">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                <button
                  className="w-full py-2 bg-black text-white group-hover:bg-white group-hover:text-black border border-black font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  THÊM VÀO GIỎ
                </button>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <button
            className="bg-[#fff100] text-black hover:bg-[#fcf299] hover:text-black border-2 border-black font-bold px-8 py-4 text-sm md:text-base transition-all uppercase tracking-wider"
          >
            <Link href={ROUTES.products + "?bestseller=true"}>
              Xem tất cả sản phẩm bán chạy 
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
}
