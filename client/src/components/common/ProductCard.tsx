"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/type/product";
import { buildProductDetailPath } from "@/constant/route";
import { Star, ShoppingBag } from "lucide-react";
import { formatVND } from "@/utils/format";
import useProductPricing from "@/hook/useProductPricing";
import { useAddToCart, useSmartCart } from "@/hook/useCart";
import { showAddedToCartToast } from "@/components/toast/AddToCartToast";
import { showErrorToast } from "@/components/toast/AppToast";
import WishlistButton from "@/components/wishlist/WishlistButton";

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
  showAddToCart = true,
  className = "",
  onAddToCart,
  variant = "default",
  desktopPerRow,
}) => {
  const [added, setAdded] = useState(false);
  const addMutation = useAddToCart();
  const cart = useSmartCart();

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

  const firstInStock = Array.isArray(p.variants) ? p.variants.find(v => (v.stockQuantity ?? 0) > 0) : undefined;
  const primaryVariantId = p.primaryVariantId || firstInStock?.id || p.variants?.[0]?.id;

  const existingItem = cart.items.find(it => it.variantId === primaryVariantId) || cart.items.find(it => it.productId === p.id);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) {
      return;
    }
    try {
      if (onAddToCart) {
        await onAddToCart(p);
      } else {
        const firstInStock = Array.isArray(p.variants) ? p.variants.find(v => (v.stockQuantity ?? 0) > 0) : undefined;
        const variantId = firstInStock?.id || p.variants?.[0]?.id;
        if (!variantId) {
          return;
        }
        await addMutation.mutateAsync({ productVariantId: variantId, quantity: 1 });
        try { window.dispatchEvent(new CustomEvent("cart:changed")); } catch {}
        if (!existingItem || (existingItem.quantity || 0) <= 0) {
          showAddedToCartToast({ name: p.name, thumbnailUrl: p.thumbnailUrl || p.images?.[0], quantity: 1 });
        }
      }
    } catch {
      showErrorToast({ title: "Không thể thêm vào giỏ", message: "Vui lòng thử lại sau." });
    } finally {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 900);
    }
  };


  const isCompact = variant === "compact";
  const desktopWidthClass = (() => {
    if (!desktopPerRow) return "";
    switch (desktopPerRow) {
      case 5:
        return "md:w-64";
      case 7:
        return "md:w-60";
      case 6:
        return "md:w-52"; 
      default:
        return "";
    }
  })();

  return (
    <Link
      key={p.id || `${p.slug}-${index}`}
      href={linkHref}
      className={`group ${isCompact ? "w-full sm:w-52 " : `w-48 sm:w-52 md:w-56 ${desktopWidthClass}`} shrink-0 overflow-hidden border border-black bg-white hover:shadow-lg transition-all ${className}`}
      aria-label={`Xem sản phẩm ${p.name}`}
    >
      <div className={`relative aspect-square overflow-hidden bg-gray-100`}>
        {img ? (
          <Image
            src={img}
            alt={(typeof p.name === "string" && p.name.trim() !== "") ? p.name : "Sản phẩm"}
            fill
            sizes="(max-width: 768px) 56vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
            Không có ảnh
          </div>
        )}
        {outOfStock ? (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" aria-hidden="true" />
        ) : null}
        {showBadges ? (
          <>
            <div className="absolute left-3 top-3">
              {isBestSeller ? (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black text-white">
                  BEST
                </span>
              ) : isSale ? (
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-black text-white">
                  SALE
                </span>
              ) : null}
            </div>
            {discountPercent && discountPercent > 0 ? (
              <div className="absolute top-3 right-3">
                <span className="bg-black text-white px-2 py-1 text-xs font-bold">
                  -{discountPercent}%
                </span>
              </div>
            ) : null}
            {outOfStock ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                  Hết hàng
                </span>
              </div>
            ) : null}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <WishlistButton
                product={p}
                variant={v0}
                size="md"
                className="!bg-white border border-black hover:!bg-black hover:!text-white"
              />
            </div>
          </>
        ) : null}
      </div>
      <div className={`px-3 md:px-4 ${isCompact ? "py-2" : "py-3 md:py-4"}`}>
        <h3 className={`${isCompact ? "text-[12px] sm:text-[13px] line-clamp-1" : "text-sm md:text-base line-clamp-2"} font-semibold text-neutral-900 mb-2 min-h-[2.5rem]`}>{p.name}</h3>
        {showRating && !isCompact ? (
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-black text-black" />
            <span className="text-xs md:text-sm font-bold text-neutral-900">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-500">
              ({p.ratingCount ?? 0})
            </span>
          </div>
        ) : null}
        {totalSold > 0 && !isCompact ? (
          <div className="text-xs text-neutral-600 mb-2">
            Đã bán: <span className="font-semibold">{soldText}</span>
          </div>
        ) : null}
        <div className="flex items-baseline gap-2 mb-3">
          {priceDisplay != null ? (
            <>
              <span className="text-base md:text-lg font-bold text-black">
                {formatVND(priceDisplay)}
              </span>
              {compareAt != null && typeof p.minEffectivePrice !== 'number' ? (
                <span className="text-xs md:text-sm text-neutral-400 line-through">{formatVND(compareAt)}</span>
              ) : null}
            </>
          ) : (
            <span className="text-sm text-neutral-700">Liên hệ</span>
          )}
        </div>
        {showAddToCart && !isCompact ? (
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="w-full py-2.5 bg-black text-white hover:bg-neutral-800 border border-black font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            {outOfStock ? "HỆT HÀNG" : added ? "ĐÃ THÊM" : "THÊM VÀO GIỐ"}
          </button>
        ) : null}
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
