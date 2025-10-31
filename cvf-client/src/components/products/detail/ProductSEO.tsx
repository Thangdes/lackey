"use client";

import React from "react";
import type { Product, ProductVariant } from "@/type/product";
import { absoluteUrl } from "@/lib/url";
import { siteConfig } from "@/constant/site";
import { ROUTES, buildProductsByCategory, buildProductDetailPath } from "@/constant/route";

export type ProductSEOProps = {
  product: Product;
  images: string[];
  selectedVariant?: ProductVariant | null;
  price?: number;
  compareAt?: number;
  isSale?: boolean;
  discountPercent?: number | null;
};

type OfferSingle = {
  "@type": "Offer";
  priceCurrency: string;
  price: number;
  availability: string;
  url: string;
  sku?: string;
};

type OfferAggregate = {
  "@type": "AggregateOffer";
  priceCurrency: string;
  lowPrice: number;
  highPrice: number;
  offerCount: number;
  offers: OfferSingle[];
};

type AggregateRating = {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
};

type ProductJsonLd = {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  image: string[];
  description?: string;
  sku?: string;
  brand?: { "@type": "Brand"; name: string };
  offers?: OfferSingle | OfferAggregate;
  aggregateRating?: AggregateRating;
} & {
  mpn?: string;
  gtin?: string;
  gtin8?: string;
  gtin12?: string;
  gtin13?: string;
  gtin14?: string;
};

type BreadcrumbItem = { "@type": "ListItem"; position: number; name: string; item: string };
type BreadcrumbJsonLd = { "@context": "https://schema.org"; "@type": "BreadcrumbList"; itemListElement: BreadcrumbItem[] };

const ProductSEO: React.FC<ProductSEOProps> = ({ product: p, images, selectedVariant, price }) => {
  try {
    const currency = "VND";
    const totalStock = (p.variants || []).reduce((sum, v) => sum + Math.max(0, Number(v.stockQuantity ?? 0)), 0);
    const outOfStock = totalStock <= 0;
    const lowStock = !outOfStock && totalStock <= 5;
    const availability = outOfStock
      ? "http://schema.org/OutOfStock"
      : lowStock
      ? "http://schema.org/LimitedAvailability"
      : "http://schema.org/InStock";

    const imagesLd = images && images.length > 0 ? images : p.thumbnailUrl ? [p.thumbnailUrl] : [];
    const fallbackId = (p as unknown as { id?: string }).id;
    const productPath = buildProductDetailPath(p.slug || fallbackId || "");
    const currentUrl = absoluteUrl(productPath);

    const aggregateRating: AggregateRating | undefined = (p.ratingCount ?? 0) > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: Math.max(0, Math.min(5, Number(p.ratingAvg ?? 0))),
          reviewCount: Number(p.ratingCount ?? 0),
        }
      : undefined;

    const variantList = Array.isArray(p.variants) ? p.variants : [];
    let offers: OfferSingle | OfferAggregate | undefined = undefined;
    const pricedVariants = variantList
      .map((v) => ({ sku: v.sku, price: v.discountPrice ?? v.price, stock: v.stockQuantity }))
      .filter((v) => typeof v.price === "number" && (v.price as number) > 0);
    if (pricedVariants.length > 1) {
      const prices = pricedVariants.map((v) => v.price as number);
      const lowPrice = Math.min(...prices);
      const highPrice = Math.max(...prices);
      offers = {
        "@type": "AggregateOffer",
        priceCurrency: currency,
        lowPrice,
        highPrice,
        offerCount: pricedVariants.length,
        offers: pricedVariants.map((v) => ({
          "@type": "Offer",
          priceCurrency: currency,
          price: v.price as number,
          availability: (v.stock ?? 0) <= 0 ? "http://schema.org/OutOfStock" : "http://schema.org/InStock",
          sku: v.sku,
          url: currentUrl,
        })),
      };
    } else if (pricedVariants.length === 1 || price != null) {
      const singlePrice = pricedVariants[0]?.price ?? price;
      offers = {
        "@type": "Offer",
        priceCurrency: currency,
        price: Number(singlePrice ?? 0),
        availability,
        url: currentUrl,
        sku: pricedVariants[0]?.sku ?? selectedVariant?.sku,
      };
    }

    const identifiers: {
      mpn?: string;
      gtin?: string;
      gtin8?: string;
      gtin12?: string;
      gtin13?: string;
      gtin14?: string;
    } = {};
    const mpnMaybe = (p as unknown as { mpn?: unknown }).mpn;
    if (typeof mpnMaybe === "string" && mpnMaybe) identifiers.mpn = mpnMaybe;
    const gtinMaybe = (p as unknown as { gtin?: unknown }).gtin;
    if (typeof gtinMaybe === "string" && gtinMaybe) {
      const digits = String(gtinMaybe).replace(/\D/g, "");
      if (digits.length === 8) identifiers.gtin8 = digits;
      else if (digits.length === 12) identifiers.gtin12 = digits;
      else if (digits.length === 13) identifiers.gtin13 = digits;
      else if (digits.length === 14) identifiers.gtin14 = digits;
      else identifiers.gtin = digits;
    }

    const productJsonLd: ProductJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: imagesLd,
      description: p.description ? p.description.replace(/<[^>]*>/g, "") : undefined,
      sku: selectedVariant?.sku,
      brand: (p.brand || siteConfig?.name) ? { "@type": "Brand", name: p.brand || siteConfig.name } : undefined,
      offers,
      aggregateRating,
      ...identifiers,
    };

    const breadcrumbItems: BreadcrumbItem[] = [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteUrl(ROUTES.home) },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: absoluteUrl(ROUTES.products) },
    ];
    const categoryIdMaybe = (p as unknown as { categoryId?: unknown }).categoryId;
    if (typeof categoryIdMaybe === "string" && categoryIdMaybe) {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: "Danh mục", item: absoluteUrl(buildProductsByCategory(categoryIdMaybe)) });
      breadcrumbItems.push({ "@type": "ListItem", position: 4, name: p.name, item: currentUrl });
    } else {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: p.name, item: currentUrl });
    }
    const breadcrumbJsonLd: BreadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </>
    );
  } catch {
    return null;
  }
};

export default ProductSEO;
