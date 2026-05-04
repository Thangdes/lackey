"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { useBestSellers } from "@/hook/useProduct";
import ProductCard from "@/components/common/ProductCard";

export default function BestSellers() {
  const { data, isLoading } = useBestSellers(12);
  const products = Array.isArray(data?.data) ? data?.data : [];
  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
            <h2 className="font-[family-name:var(--font-retro)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-3 sm:mb-4 tracking-wider uppercase">
              Bán chạy nhất
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-none border border-black aspect-square" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
            <h2 className="font-[family-name:var(--font-retro)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-3 sm:mb-4 tracking-wider uppercase">
              Bán chạy nhất
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto px-4">
              Hiện chưa có sản phẩm bán chạy.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
          <h2 className="font-[family-name:var(--font-retro)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-3 sm:mb-4 tracking-wider uppercase">
            Bán chạy nhất
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto px-4">
            Sẵn sàng tỏa sáng? Khám phá những móc khóa bán chạy nhất của chúng tôi!
            Từ nhân vật anime, Kpop đến các thiết kế độc đáo, những sản phẩm yêu thích
            này mang đến sự kết hợp hoàn hảo giữa phong cách, cá tính và năng lượng LắcKey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || index}
              product={product}
              className="!w-full"
            />
          ))}
        </div>

        <div className="text-center">
          <button
            className="bg-[#fff100] text-black hover:bg-[#fcf299] hover:text-black border-2 border-black font-bold px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base transition-all uppercase tracking-wider rounded-none"
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
