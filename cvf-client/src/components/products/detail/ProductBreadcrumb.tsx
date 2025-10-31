"use client";

import Link from "next/link";
import React from "react";
import type { Product } from "@/type/product";
import { ROUTES, buildProductsByCategory } from "@/constant/route";
import { ChevronRight } from "lucide-react";

export type ProductBreadcrumbProps = {
  product: Product;
};

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ product: p }) => {
  const catSlug = typeof p.category?.slug === 'string' ? p.category?.slug : undefined;
  const catName = typeof p.category?.name === 'string' ? p.category?.name : undefined;

  return (
    <nav className="mb-4 sm:mb-5 md:mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm overflow-x-auto scrollbar-none pb-1">
        <li className="shrink-0">
          <Link 
            href={ROUTES.home} 
            className="text-neutral-600 hover:text-[var(--color-cod-gray-900)] hover:underline transition-colors"
          >
            Trang chủ
          </Link>
        </li>
        
        <li aria-hidden className="shrink-0">
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
        </li>
        
        <li className="shrink-0">
          <Link 
            href={ROUTES.products} 
            className="text-neutral-600 hover:text-[var(--color-cod-gray-900)] hover:underline transition-colors"
          >
            Sản phẩm
          </Link>
        </li>

        {catSlug && (
          <>
            <li aria-hidden className="shrink-0">
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
            </li>
            <li className="shrink-0 max-w-[120px] sm:max-w-[180px] md:max-w-none">
              <Link 
                href={buildProductsByCategory(catSlug)} 
                className="text-neutral-600 hover:text-[var(--color-cod-gray-900)] hover:underline transition-colors truncate block"
                title={catName || "Danh mục"}
              >
                {catName || "Danh mục"}
              </Link>
            </li>
          </>
        )}

        <li aria-hidden className="shrink-0">
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
        </li>
        
        <li 
          className="text-[var(--color-cod-gray-900)] font-semibold min-w-0 flex-1"
          aria-current="page"
        >
          <span 
            className="truncate block max-w-full"
            title={p.name}
          >
            {p.name}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;
