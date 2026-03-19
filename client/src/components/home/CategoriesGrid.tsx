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
      <section className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <div className="h-10 w-64 bg-gray-100 rounded-full animate-pulse mb-4" />
            <div className="h-4 w-96 bg-gray-50 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="aspect-square bg-gray-100 animate-pulse" />
                <div className="p-4 bg-white">
                  <div className="h-4 w-24 mx-auto bg-gray-100 rounded-full animate-pulse" />
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
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base md:text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {/* Desktop View All Link */}
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold group"
          >
            {viewAllText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8 md:mb-0">
          {renderItems.map((c) => (
            <Link
              key={c.id}
              href={buildCategoryPath(c.slug || c.id)}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {c.thumbnailUrl ? (
                  <Image
                    src={c.thumbnailUrl}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50" />
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-4 bg-white flex-grow flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-blue-700 text-center truncate w-full transition-colors">
                  {c.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center md:hidden mt-8">
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gray-50 text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
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
