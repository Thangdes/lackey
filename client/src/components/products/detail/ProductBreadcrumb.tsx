"use client";

import Link from "next/link";
import Script from "next/script";
import React from "react";
import type { Product } from "@/type/product";
import { ROUTES, buildProductsByCategory } from "@/constant/route";
import { buildBreadcrumbJsonLd } from "@/config/seo";
import { absoluteUrl } from "@/lib/url";

export type ProductBreadcrumbProps = {
  product: Product;
};

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ product: p }) => {
  const catSlug = typeof p.category?.slug === 'string' ? p.category?.slug : undefined;
  const catName = typeof p.category?.name === 'string' ? p.category?.name : undefined;

  const breadcrumbItems = React.useMemo(() => {
    const items = [
      { name: "Trang chủ", url: absoluteUrl(ROUTES.home) },
      { name: "Sản phẩm", url: absoluteUrl(ROUTES.products) },
    ];
    
    if (catSlug && catName) {
      items.push({
        name: catName,
        url: absoluteUrl(buildProductsByCategory(catSlug)),
      });
    }
    
    items.push({
      name: p.name,
      url: absoluteUrl(`/products/${p.slug}`),
    });
    
    return items;
  }, [catSlug, catName, p.name, p.slug]);

  const jsonLd = React.useMemo(() => 
    buildBreadcrumbJsonLd(breadcrumbItems),
    [breadcrumbItems]
  );

  return (
    <>
      <Script
        id="product-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <nav className="mb-6" aria-label="Breadcrumb">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black flex-wrap">
        <Link 
          href={ROUTES.home} 
          className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors"
        >
          Trang chủ
        </Link>
        
        <span className="text-black font-bold">/</span>
        
        <Link 
          href={ROUTES.products} 
          className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors"
        >
          Sản phẩm
        </Link>

        {catSlug && (
          <>
            <span className="text-black font-bold">/</span>
            <Link 
              href={buildProductsByCategory(catSlug)} 
              className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors truncate max-w-[150px] md:max-w-none"
              title={catName || "Danh mục"}
            >
              {catName || "Danh mục"}
            </Link>
          </>
        )}

        <span className="text-black font-bold">/</span>
        
        <span 
          className="text-sm font-bold uppercase tracking-wide text-black truncate max-w-[200px] md:max-w-none"
          title={p.name}
        >
          {p.name}
        </span>
      </div>
    </nav>
    </>
  );
};

export default ProductBreadcrumb;
