"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategoryList } from "@/hook/useCategory";
import type { Category } from "@/service/category.service";
import { ROUTES, buildCategoryPath } from "@/constant/route";
import { ArrowRight } from "lucide-react";

// Mock categories cho demo - Keyboard themed
const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-keycap",
    name: "Keycap",
    slug: "keycap",
    thumbnailUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400",
    description: "Keycap PBT, ABS, Artisan",
  },
  {
    id: "cat-switch",
    name: "Switch",
    slug: "switch",
    thumbnailUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    description: "Linear, Tactile, Clicky",
  },
  {
    id: "cat-keyboard",
    name: "Bàn Phím",
    slug: "keyboard",
    thumbnailUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
    description: "60%, 65%, 75%, TKL",
  },
  {
    id: "cat-kit",
    name: "Kit",
    slug: "kit-barebone",
    thumbnailUrl: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400",
    description: "Barebone, Hotswap",
  },
  {
    id: "cat-cable",
    name: "Dây Cáp",
    slug: "cable",
    thumbnailUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    description: "Custom Coiled Cable",
  },
  {
    id: "cat-accessories",
    name: "Phụ Kiện",
    slug: "accessories",
    thumbnailUrl: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400",
    description: "Kê tay, Foam, Lube",
  },
];

type Props = {
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  showDescription?: boolean;
  mobileLayout?: "grid" | "carousel";
  fallbackCategories?: Category[];
};

const CategoriesGrid: React.FC<Props> = ({
  title = "Danh mục nổi bật",
  subtitle,
  viewAllHref = ROUTES.categories,
  viewAllText = "Xem tất cả",
}) => {
  const { data, isLoading } = useCategoryList();
  const categories: Category[] = Array.isArray(data) && data.length > 0 ? data : MOCK_CATEGORIES;

  if (isLoading) {
    return (
      <section className="w-full bg-white py-16 md:py-20">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-8 md:mb-12">
            <div className="h-12 w-64 bg-gray-200 animate-pulse mb-3" />
            <div className="h-4 w-96 bg-gray-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3 bg-white">
                  <div className="h-4 w-20 bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderItems: Category[] = categories.slice(0, 6);
  if (renderItems.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-8 md:mb-12">
          <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl text-neutral-900 mb-3 tracking-wider uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          {renderItems.map((c) => (
            <Link
              key={c.id}
              href={buildCategoryPath(c.slug || c.id)}
              className="group bg-white border border-transparent hover:border-black transition-all overflow-hidden"
            >
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                {c.thumbnailUrl ? (
                  <Image
                    src={c.thumbnailUrl}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              
              <div className="p-3 bg-white border-t border-gray-200 group-hover:bg-black group-hover:text-white transition-colors">
                <h3 className="text-sm md:text-base font-bold text-center uppercase truncate">
                  {c.name}
                </h3>
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

export default CategoriesGrid;
