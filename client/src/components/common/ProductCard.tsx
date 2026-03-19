"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/type/product";
import { buildProductDetailPath } from "@/constant/route";
import { Star } from "lucide-react";
import { formatVND } from "@/utils/format";
import useProductPricing from "@/hook/useProductPricing";


export type ProductCardProps = {
  product: Product;
  index?: number;
  href?: import('next/link').LinkProps['href'];
  showBadges?: boolean;
  showRating?: boolean;
  showSupplier?: boolean;
  showAddToCart?: boolean;
  className?: string;
  onAddToCart?: (p: Product) => void | Promise<void>;
  variant?: "default" | "compact"; 
  desktopPerRow?: 5 | 6 | 7;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product: p,
  index = 0,
  href,
  showBadges = true,
  showRating = true,

  className = "",
  variant = "default",
}) => {
  const img = p.thumbnailUrl || p.images?.[0];
  const v0 = (p.variants && p.variants[0]) || undefined;
  const computedPricing = useProductPricing(v0);
  const priceDisplay =
    typeof p.priceEffective === 'number'
      ? p.priceEffective
      : typeof p.minEffectivePrice === 'number'
        ? p.minEffectivePrice
        : computedPricing.price;
  const compareAt =
    typeof p.compareAt === 'number'
      ? p.compareAt
      : computedPricing.compareAt;
  const isSale =
    typeof p.isOnSale === 'boolean'
      ? p.isOnSale
      : computedPricing.isSale;
  const discountPercent =
    typeof p.discountPercent === 'number'
      ? p.discountPercent
      : computedPricing.discountPercent;
  const totalSold = (p as Product).totalBuyCount ?? p.buyCount ?? 0;
  const isBestSeller = Array.isArray(p.badges) ? p.badges.includes('BEST') : totalSold >= 500;
  const soldText = p.soldDisplay ?? (() => {
    const n = Number(totalSold) || 0;
    const formatted = n.toLocaleString('vi-VN');
    return n >= 1000 ? `${formatted}+` : formatted;
  })();
  const ratingValue = Math.max(0, Math.min(5, Number(p.ratingAvg ?? 0)));
  const totalStock = typeof p.totalStock === 'number'
    ? p.totalStock
    : Array.isArray(p.variants)
      ? p.variants.reduce((sum, v) => sum + Math.max(0, Number(v.stockQuantity ?? 0)), 0)
      : 0;
  const outOfStock = typeof p.isOutOfStock === 'boolean' ? p.isOutOfStock : totalStock <= 0;

  const linkHref = href ?? buildProductDetailPath(p.slug || p.id || "");

  const isCompact = variant === "compact";

  return (
    <Link
      key={p.id || `${p.slug}-${index}`}
      href={linkHref}
      className={`group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}
      aria-label={`Xem sản phẩm ${p.name}`}
    >
      <div className={`relative aspect-square overflow-hidden bg-gray-50`}>
        {img ? (
          <Image
            src={img}
            alt={(typeof p.name === "string" && p.name.trim() !== "") ? p.name : "Sản phẩm"}
            fill
            sizes="(max-width: 768px) 56vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-400">
            Không có ảnh
          </div>
        )}
        {outOfStock ? (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" aria-hidden="true" />
        ) : null}
        {showBadges ? (
          <>
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {isBestSeller ? (
                <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">
                  BEST
                </div>
              ) : isSale ? (
                <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded">
                  SALE
                </div>
              ) : null}
              {discountPercent && discountPercent > 0 ? (
                <div className="bg-red-500 text-white px-2 py-0.5 text-[10px] font-bold rounded">
                  -{discountPercent}%
                </div>
              ) : null}
            </div>
            {outOfStock ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center bg-black/80 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-lg">
                  Hết hàng
                </span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] leading-tight">
          {p.name}
        </h3>

        {showRating && !isCompact ? (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-gray-900 ml-0.5">
                {ratingValue.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({p.ratingCount ?? 0})
            </span>
          </div>
        ) : null}

        {totalSold > 0 && !isCompact ? (
          <div className="text-xs text-gray-500 mb-2">
            Đã bán: <span className="font-semibold text-gray-700">{soldText}</span>
          </div>
        ) : null}

        <div className="mb-2">
          {priceDisplay != null ? (
            <>
              {compareAt != null && typeof p.minEffectivePrice !== 'number' ? (
                <div className="text-xs text-gray-400 line-through">
                  {formatVND(compareAt)}
                </div>
              ) : null}
              <div className={`text-base font-bold ${isSale ? 'text-red-600' : 'text-gray-900'}`}>
                {formatVND(priceDisplay)}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-600">Liên hệ</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
