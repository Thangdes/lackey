"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { ROUTES } from "@/constant/route";
import { useBestSellers } from "@/hook/useProduct";


const BADGE_STYLES = {
  HOT: "bg-black text-white",
  TRENDING: "bg-black text-white",
  BEST: "bg-black text-white",
  NEW: "bg-white text-black border border-black",
  SALE: "bg-black text-white",
};

export default function BestSellers() {
  const { data, isLoading } = useBestSellers(6);

  const products = data?.data || [];

  const mapProduct = (product: typeof products[number]) => {
    const variants = product.variants || [];
    const firstVariant = variants[0];
    const price = firstVariant?.discountPrice || firstVariant?.price || product.minEffectivePrice || 0;
    const originalPrice = firstVariant?.discountPrice ? firstVariant.price : null;
    const discount = originalPrice && price < originalPrice 
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
    
    const totalBuyCount = product.totalBuyCount || product.buyCount || 0;
    const badge = totalBuyCount >= 100 ? "HOT" : "NEW";
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnailUrl || product.images?.[0] || "/placeholder.jpg",
      price,
      originalPrice,
      discount,
      rating: product.ratingAvg || 0,
      reviewCount: product.ratingCount || 0,
      sold: totalBuyCount,
      badge,
    };
  };

  const mappedProducts = products.map(mapProduct);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 tracking-wider uppercase">
              Bán chạy nhất
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-none border border-black aspect-square" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          {mappedProducts.map((product) => (
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
            className="bg-[#fff100] text-black hover:bg-[#fcf299] hover:text-black border-2 border-black font-bold px-8 py-4 text-sm md:text-base transition-all uppercase tracking-wider rounded-none"
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
