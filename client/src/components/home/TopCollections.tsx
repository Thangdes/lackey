"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";

const COLLECTIONS = [
  {
    id: "1",
    title: "Gaming Setup",
    slug: "gaming-setup",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=800&fit=crop",
    buttonText: "KHÁM PHÁ NGAY",
    description: "Bàn phím cơ cho game thủ - Switch linear, RGB đầy đủ",
  },
  {
    id: "2",
    title: "Office Premium",
    slug: "office-premium",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=800&fit=crop",
    buttonText: "XEM NGAY",
    description: "Bàn phím văn phòng cao cấp - Gõ êm, thiết kế sang trọng",
  },
  {
    id: "3",
    title: "Custom Build",
    slug: "custom-build",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=800&fit=crop",
    buttonText: "TÙY CHỈNH",
    description: "Kit & Keycap custom - Tạo bàn phím độc nhất của riêng bạn",
  },
];

export default function TopCollections() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 tracking-wider uppercase">
            Bộ sưu tập nổi bật
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Khám phá các bộ sưu tập được tuyển chọn cho từng nhu cầu sử dụng
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {COLLECTIONS.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden bg-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
                {/* Description */}
                <p className="text-sm text-white/90 mb-3 line-clamp-2">
                  {collection.description}
                </p>

                {/* Title */}
                <h3 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl text-white mb-4 uppercase tracking-wider drop-shadow-2xl">
                  {collection.title}
                </h3>

                {/* Button */}
                <Link
                  href={`${ROUTES.products}?collection=${collection.slug}`}
                  className="inline-block w-full bg-[#fff100] hover:bg-[#fcf299] text-black font-bold py-3 md:py-4 px-6 text-sm md:text-base uppercase tracking-wider border-2 border-black transition-all text-center"
                >
                  {collection.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
