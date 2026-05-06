"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Bàn phím",
    slug: "keyboard",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=200",
  },
  {
    id: "2",
    name: "Keycap",
    slug: "keycap",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=200",
  },
  {
    id: "3",
    name: "Switch",
    slug: "switch",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
  },
  {
    id: "4",
    name: "Kit",
    slug: "kit",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=200",
  },
  {
    id: "5",
    name: "Dây cáp",
    slug: "cable",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200",
  },
  {
    id: "6",
    name: "Kê tay",
    slug: "wrist-rest",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200",
  },
  {
    id: "7",
    name: "Foam",
    slug: "foam",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=200",
  },
  {
    id: "8",
    name: "Lube kit",
    slug: "lube-kit",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=200",
  },
  {
    id: "9",
    name: "Sticker",
    slug: "sticker",
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=200",
  },
  {
    id: "10",
    name: "Phụ kiện",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=200",
  },
];

export default function CategoryIcons() {
  return (
    <section className="w-full bg-white py-8 md:py-12 border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8">
          Danh mục sản phẩm
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`${ROUTES.products}?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 transition-all hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-50 overflow-hidden group-hover:bg-gray-100 transition-colors">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              </div>
              
              {/* Name */}
              <span className="text-xs md:text-sm text-gray-700 text-center font-medium group-hover:text-gray-900">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
