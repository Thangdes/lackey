"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    id: "1",
    title: "Gaming Setup",
    slug: "gaming-setup",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=800&fit=crop",
    buttonText: "Khám Phá Ngay",
    description: "Bàn phím cơ cho game thủ - Switch linear, RGB đầy đủ",
  },
  {
    id: "2",
    title: "Office Premium",
    slug: "office-premium",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=800&fit=crop",
    buttonText: "Xem Ngay",
    description: "Bàn phím văn phòng cao cấp - Gõ êm, thiết kế sang trọng",
  },
  {
    id: "3",
    title: "Custom Build",
    slug: "custom-build",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=800&fit=crop",
    buttonText: "Tùy Chỉnh",
    description: "Kit & Keycap custom - Tạo bàn phím độc nhất của riêng bạn",
  },
];

export default function TopCollections() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Bộ sưu tập nổi bật
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Khám phá các bộ sưu tập được tuyển chọn cho từng nhu cầu sử dụng
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {COLLECTIONS.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden rounded-3xl bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {}
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                    {collection.title}
                  </h3>

                  {}
                  <p className="text-sm text-gray-200 mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {collection.description}
                  </p>

                  {}
                  <Link
                    href={`${ROUTES.products}?collection=${collection.slug}`}
                    className="inline-flex items-center justify-center gap-2 w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3.5 px-6 rounded-xl transition-colors"
                  >
                    <span>{collection.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
