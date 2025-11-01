"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";

const COLLECTIONS = [
  {
    id: "1",
    title: "Anime",
    slug: "anime",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&h=800&fit=crop",
    buttonText: "MUA ANIME",
  },
  {
    id: "2",
    title: "Kpop",
    slug: "kpop",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop",
    buttonText: "MUA KPOP",
  },
  {
    id: "3",
    title: "Nhân vật",
    slug: "nhan-vat",
    image: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=600&h=800&fit=crop",
    buttonText: "MUA NHÂN VẬT",
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
            Sản phẩm tốt nhất của LắcKey. Được yêu thích. Phong cách cho mọi người
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
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
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
