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
        <ol className="inline-flex items-center flex-wrap text-sm text-neutral-600">
          <li>
            <Link href={ROUTES.home} className="font-medium hover:text-neutral-900 transition-colors">
              Trang chủ
            </Link>
          </li>

          <li className="px-2 text-neutral-300">/</li>

          <li>
            <Link href={ROUTES.products} className="font-medium hover:text-neutral-900 transition-colors">
              Sản phẩm
            </Link>
          </li>

          {catSlug && (
            <>
              <li className="px-2 text-neutral-300">/</li>
              <li>
                <Link
                  href={buildProductsByCategory(catSlug)}
                  className="font-medium hover:text-neutral-900 transition-colors truncate max-w-[160px] md:max-w-none"
                  title={catName || "Danh mục"}
                >
                  {catName || "Danh mục"}
                </Link>
              </li>
            </>
          )}

          <li className="px-2 text-neutral-300">/</li>

          <li>
            <span className="font-semibold text-neutral-900 truncate max-w-[240px] md:max-w-none" title={p.name}>
              {p.name}
            </span>
          </li>
        </ol>
      </nav>
    </>
  );
};

export default ProductBreadcrumb;
