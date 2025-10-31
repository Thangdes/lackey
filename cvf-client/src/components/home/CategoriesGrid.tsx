"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategoryList } from "@/hook/useCategory";
import type { Category } from "@/service/category.service";
import { ROUTES } from "@/constant/route";
import { DEFAULT_CATEGORY_IMAGE } from "@/constant/image";
import { FaTag } from "react-icons/fa";
import SectionHeader from "@/components/common/SectionHeader";

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
  subtitle = "Khám phá các danh mục phổ biến",
  viewAllHref = ROUTES.products,
  viewAllText = "Xem tất cả",
  mobileLayout = "grid",
  fallbackCategories,
}) => {
  const { data, isLoading, isError } = useCategoryList();
  const categories: Category[] = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <section aria-label="Categories" className="py-8 md:py-12">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <SectionHeader
            title={
              <>
                <FaTag className="h-5 w-5 text-[var(--color-cod-gray-900)]" aria-hidden="true" />
                <h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">
                  <span className="inline-block h-5 w-40 rounded bg-neutral-200 align-middle" aria-hidden="true" />
                  <span className="sr-only">{title}</span>
                </h2>
              </>
            }
            subtitle={<span className="inline-block h-4 w-64 rounded bg-neutral-200" aria-hidden="true" />}
            align="left"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-[#FFFFFF] ring-1 ring-black/5">
                <div className="relative w-full aspect-square bg-neutral-100 animate-pulse" />
                <div className="p-2">
                  <div className="h-4 w-24 rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderItems: Category[] = (isError || categories.length === 0)
    ? (fallbackCategories || [])
    : categories;
  if (renderItems.length === 0) return null;

  return (
    <section aria-label="Categories" className="py-8 md:py-12">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <SectionHeader
          title={
            <>
              <FaTag className="h-5 w-5 text-[var(--color-cod-gray-900)]" aria-hidden="true" />
              <h2 className="text-lg md:text-xl font-semibold text-[var(--color-cod-gray-900)]">{title}</h2>
            </>
          }
          subtitle={subtitle}
          ctaHref={viewAllHref}
          ctaText={viewAllText}
          align="left"
        />
        {mobileLayout === "carousel" ? (
          <>
            <div>
              <div className="no-scrollbar overflow-x-auto md:overflow-visible">
                <div className="flex gap-3 md:hidden">
                  {renderItems.map((c) => {
                    const img = c.thumbnailUrl || DEFAULT_CATEGORY_IMAGE;
                    return (
                      <Link
                        key={c.id}
                        href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                        className="group w-44 shrink-0 overflow-hidden rounded-xl bg-[#FFFFFF] ring-1 ring-black/5 hover:ring-black/10 hover:shadow-lg transition-all duration-200 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                        aria-label={`Xem sản phẩm trong danh mục ${c.name}`}
                      >
                        <div className="relative w-full aspect-square">
                          <Image
                            src={img}
                            alt={c.name}
                            fill
                            sizes="(max-width: 640px) 44vw, 176px"
                            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                            priority={false}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center">
                            <span className="inline-flex max-w-full items-center justify-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--color-cod-gray-900)] shadow-sm ring-1 ring-black/10 backdrop-blur-[2px] truncate transition-all duration-200 group-hover:scale-105 group-hover:shadow-md" title={c.name}>
                              <FaTag className="mr-1 h-3 w-3 text-neutral-500" />
                              <span className="truncate">{c.name}{(() => { const cc = c as Category & { productCount?: number; count?: number; productsCount?: number }; const n = cc.productCount ?? cc.count ?? cc.productsCount; return typeof n === 'number' && n > 0 ? ` • ${n}` : ""; })()}</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {renderItems.map((c) => {
                const img = c.thumbnailUrl || DEFAULT_CATEGORY_IMAGE;
                return (
                  <Link
                    key={c.id}
                    href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                    className="group overflow-hidden rounded-xl bg-[#FFFFFF] ring-1 ring-black/5 hover:ring-black/10 hover:shadow-lg transition-all duration-200 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                    aria-label={`Xem sản phẩm trong danh mục ${c.name}`}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={img}
                        alt={c.name}
                        fill
                        sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                        priority={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-3 bottom-3 flex items-center justify-center">
                        <span className="inline-flex max-w-full items-center justify-center rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-[var(--color-cod-gray-900)] shadow-sm ring-1 ring-black/10 backdrop-blur-[2px] truncate transition-all duration-200 group-hover:scale-105 group-hover:shadow-md" title={c.name}>
                          <FaTag className="mr-1 h-3.5 w-3.5 text-neutral-500" />
                          <span className="truncate">{c.name}{(() => { const cc = c as Category & { productCount?: number; count?: number; productsCount?: number }; const n = cc.productCount ?? cc.count ?? cc.productsCount; return typeof n === 'number' && n > 0 ? ` • ${n}` : ""; })()}</span>
                        </span>
                      </div>
                    </div>
                    {/* No description block for cleaner look */}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {renderItems.map((c) => {
              const img = c.thumbnailUrl || DEFAULT_CATEGORY_IMAGE;
              return (
                <Link
                  key={c.id}
                  href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                  className="group overflow-hidden rounded-xl bg-[#FFFFFF] ring-1 ring-black/5 hover:ring-black/10 hover:shadow-lg transition-all duration-200 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                  aria-label={`Xem sản phẩm trong danh mục ${c.name}`}
                >
                  <div className="relative w-full aspect-square">
                    <Image
                      src={img}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 16vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
                      priority={false}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent opacity-95 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-center">
                      <span className="inline-flex max-w-full items-center justify-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--color-cod-gray-900)] shadow-sm ring-1 ring-black/10 backdrop-blur-[2px] truncate transition-all duration-200 group-hover:scale-105 group-hover:shadow-md" title={c.name}>
                        <FaTag className="mr-1 h-3 w-3 text-neutral-500" />
                        <span className="truncate">{c.name}{(() => { const cc = c as Category & { productCount?: number; count?: number; productsCount?: number }; const n = cc.productCount ?? cc.count ?? cc.productsCount; return typeof n === 'number' && n > 0 ? ` • ${n}` : ""; })()}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesGrid;
