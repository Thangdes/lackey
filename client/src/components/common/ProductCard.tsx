"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/type/product";
import { buildProductDetailPath } from "@/constant/route";
import { Check } from "lucide-react";
import { IoIosFlash } from "react-icons/io";
import { FaCrown } from "react-icons/fa";
import { formatVND } from "@/utils/format";
import RatingStars from "@/components/common/RatingStars";
import useProductPricing from "@/hook/useProductPricing";
import { useAddToCart, useSmartCart } from "@/hook/useCart";
import QuantityStepper from "@/components/cart/parts/QuantityStepper";
import { showAddedToCartToast } from "@/components/toast/AddToCartToast";
import { showErrorToast, showInfoToast } from "@/components/toast/AppToast";

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
  showSupplier = true,
  showAddToCart = true,
  className = "",
  onAddToCart,
  variant = "default",
  desktopPerRow,
}) => {
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addMutation = useAddToCart();
  const cart = useSmartCart();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const img = p.thumbnailUrl || p.images?.[0] || "/logo/logo.jpg";
  const v0 = (p.variants && p.variants[0]) || undefined;
  const { price, compareAt, isSale, discountPercent } = useProductPricing(v0);
  const priceDisplay = typeof p.minEffectivePrice === 'number' ? p.minEffectivePrice : price;
  const totalSold = (p as Product).totalBuyCount ?? p.buyCount ?? 0;
  const isBestSeller = totalSold >= 500;
  const soldText = (() => {
    const n = Number(totalSold) || 0;
    const formatted = n.toLocaleString('vi-VN');
    return n >= 1000 ? `${formatted}+` : formatted;
  })();
  const ratingValue = Math.max(0, Math.min(5, Number(4)));
  const totalStock = Array.isArray(p.variants)
    ? p.variants.reduce((sum, v) => sum + Math.max(0, Number(v.stockQuantity ?? 0)), 0)
    : 0;
  const outOfStock = totalStock <= 0;
  const lowStock = !outOfStock && totalStock <= 5;

  const linkHref = href ?? buildProductDetailPath(p.slug || p.id || "");

  const firstInStock = Array.isArray(p.variants) ? p.variants.find(v => (v.stockQuantity ?? 0) > 0) : undefined;
  const primaryVariantId = firstInStock?.id || p.variants?.[0]?.id;
  const primaryVariantStock = (() => {
    if (!Array.isArray(p.variants) || !primaryVariantId) return undefined as number | undefined;
    const found = p.variants.find(v => v.id === primaryVariantId);
    const n = Number(found?.stockQuantity ?? NaN);
    return Number.isFinite(n) ? n : undefined;
  })();

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
    } catch (e) {
      showErrorToast({ title: "Không thể thêm vào giỏ", message: "Vui lòng thử lại sau." });
    } finally {
      setAdded(true);
      window.setTimeout(() => setAdded(false), 900);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    try {
      const firstInStock = Array.isArray(p.variants) ? p.variants.find(v => (v.stockQuantity ?? 0) > 0) : undefined;
      const variantId = firstInStock?.id || p.variants?.[0]?.id;
      if (!variantId) return;
      if (!existingItem || (existingItem.quantity || 0) <= 0) {
        await addMutation.mutateAsync({ productVariantId: variantId, quantity: 1 });
        try { window.dispatchEvent(new CustomEvent("cart:changed")); } catch {}
      }
      router.push("/checkout");
    } catch (e) {
      showErrorToast({ title: "Không thể tiếp tục thanh toán", message: "Vui lòng thử lại sau." });
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
      className={`group ${isCompact ? "w-full sm:w-48 " : `w-44 sm:w-48 ${desktopWidthClass}`} shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-[#FFFFFF] hover:shadow-md transition-all ${className}`}
      aria-label={`Xem sản phẩm ${p.name}`}
    >
      <div className={`relative w-full ${isCompact ? "aspect-[1/1] sm:aspect-[4/5]" : "aspect-square sm:aspect-[4/5]"}`}>
        <Image
          src={img}
          alt={p.name}
          fill
          sizes="(max-width: 768px) 56vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        {outOfStock ? (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" aria-hidden="true" />
        ) : null}
        {showBadges ? (
          <>
            <div className="absolute left-2 top-2 flex flex-wrap items-center gap-1.5">
              {isSale ? (
                <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-[#AE1C2C] text-white px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold shadow-sm">
                  <IoIosFlash className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-white" />
                  {discountPercent ? `-${discountPercent}%` : "SALE"}
                </span>
              ) : null}
            </div>
            {isBestSeller || totalSold > 0 ? (
              <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
                {isBestSeller ? (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold shadow-sm ring-1 ring-black/10 text-white">
                    <FaCrown className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-yellow-900" />
                    <span className="hidden xs:inline">Bán chạy</span>
                    <span className="xs:hidden">Hot</span>
                  </span>
                ) : null}
                {totalSold > 0 ? (
                  <span
                    className="inline-flex items-center rounded-full bg-white/90 text-neutral-800 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium shadow-sm ring-1 ring-black/10"
                    title={`Đã bán ${Number(totalSold).toLocaleString('vi-VN')}`}
                  >
                    <span className="hidden xs:inline">Đã bán {soldText}</span>
                    <span className="xs:hidden">{soldText}</span>
                  </span>
                ) : null}
              </div>
            ) : null}
            {outOfStock ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center rounded bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
                  Hết hàng
                </span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className={`px-2 sm:px-3 ${isCompact ? "py-2" : "py-2 sm:py-3"}`}>
        <h3 className={`${isCompact ? "text-[12px] sm:text-[13px] line-clamp-1" : "text-sm sm:text-base line-clamp-2"} font-medium text-[var(--color-cod-gray-900)] leading-tight`}>{p.name}</h3>
        {!isCompact && showSupplier && p.supplier?.name ? (
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-neutral-600 truncate" title={`Nhà cung cấp: ${p.supplier.name}`}>
            by {p.supplier.name}
          </p>
        ) : null}
        {showRating && !isCompact ? (
          <div className="mt-0.5 flex items-center gap-1 text-[11px] sm:text-[12px] text-neutral-700">
            <RatingStars value={ratingValue} aria-label={`Đánh giá ${ratingValue.toFixed(1)}/5`} />
            <span>{ratingValue.toFixed(1)}</span>
            <span className="text-neutral-500 hidden sm:inline">({p.ratingCount ?? 0})</span>
          </div>
        ) : null}
        {totalSold > 0 ? (
          <div
            className={`${isCompact ? "mt-0.5 text-[10px] sm:text-[11px]" : "mt-0.5 text-[11px] sm:text-[12px]"} text-neutral-700`}
            title={`Đã bán ${Number(totalSold).toLocaleString('vi-VN')}`}
          >
            Đã bán {soldText}
          </div>
        ) : null}
        <div className={`mt-1 sm:mt-1.5 flex items-baseline gap-1.5 sm:gap-2`}>
          {priceDisplay != null ? (
            <span className={`${isCompact ? "text-[12px] sm:text-[13px]" : "text-sm sm:text-[15px]"} font-semibold text-[#AE1C2C] leading-tight`}>
              {(Array.isArray(p.variants) && p.variants.length > 1) ? (isCompact ? "từ " : "Từ ") : ""}
              {formatVND(priceDisplay)}
            </span>
          ) : (
            <span className={`${isCompact ? "text-[11px] sm:text-[12px]" : "text-xs sm:text-sm"} text-neutral-700`}>Liên hệ</span>
          )}
          {compareAt != null && typeof p.minEffectivePrice !== 'number' ? (
            <span className={`${isCompact ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px]"} text-neutral-400 line-through`}>{formatVND(compareAt)}</span>
          ) : null}
        </div>
        {Array.isArray(p.variants) && p.variants.length > 0 ? (
          <div className={`${isCompact ? "mt-1" : "mt-1.5"}`}>
            <div className="flex flex-wrap gap-1.5" aria-label="Các phiên bản">
              {p.variants.slice(0, 4).map((v) => {
                const vsOut = (v.stockQuantity ?? 0) <= 0;
                return (
                  <span
                    key={v.id}
                    title={`${v.name}${vsOut ? " - Hết hàng" : ""}`}
                    className={`inline-flex items-center gap-1 ${isCompact ? "text-[10px]" : "text-[11px]"} transition-colors
                      ${vsOut
                        ? ""
                        : "text-neutral-700"}
                    `}
                    aria-label={`${v.name} ${vsOut ? "hết hàng" : "còn hàng"}`}
                  >
                    <span className={`${isCompact ? "max-w-[64px]" : "max-w-[80px]"} truncate`}>{v.name}</span>
                    {!isCompact && (typeof (v.discountPrice ?? v.price) === "number") && (
                      <span className="text-[11px] text-neutral-500">{`{ ${v.name} • Mỗi ${formatVND(v.discountPrice ?? v.price)} }`}</span>
                    )}
                  </span>
                );
              })}
              {p.variants.length > 4 ? (
                <span className={`inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 ${isCompact ? "text-[10px]" : "text-[11px]"} text-neutral-600 ring-1 ring-neutral-200`}>
                  +{p.variants.length - 4}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
        {!isCompact && (
          <div className="mt-1.5">
            {outOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 ">
                Hết hàng
              </span>
            ) : lowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 ">
                Sắp hết • còn {totalStock}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 ">
                Còn hàng • {totalStock}+
              </span>
            )}
          </div>
        )}
        {showAddToCart && !isCompact ? (
          <div className="mt-2">
            {existingItem && existingItem.itemId ? (
              <div
                className="flex items-center justify-center w-full"
                onClick={(e) => { e.preventDefault(); }}
              >
                <QuantityStepper
                  quantity={existingItem.quantity}
                  maxStock={typeof primaryVariantStock === 'number' ? primaryVariantStock : undefined}
                  containerClassName="w-full justify-between"
                  onDecrease={() => {
                    try {
                      if (existingItem.quantity <= 1) {
                        cart.remove(existingItem.itemId!);
                      } else {
                        cart.updateQty(existingItem.itemId!, existingItem.quantity - 1);
                      }
                    } catch {
                      showErrorToast({ title: "Không thể cập nhật", message: "Vui lòng thử lại." });
                    }
                  }}
                  onIncrease={() => {
                    try {
                      if (existingItem.canIncrease === false) {
                        showInfoToast({ title: "Không thể tăng số lượng", message: "Đã đạt giới hạn hiện tại." });
                        return;
                      }
                      cart.updateQty(existingItem.itemId!, existingItem.quantity + 1);
                    } catch {
                      showErrorToast({ title: "Không thể cập nhật", message: "Vui lòng thử lại." });
                    }
                  }}
                  onCapReached={() => showInfoToast({ title: "Tối đa trong kho", message: "Bạn đã đạt số lượng tối đa còn trong kho." })}
                  qtyAriaLabel={`Số lượng của ${p.name}`}
                  decreaseLabel="Giảm số lượng"
                  increaseLabel="Tăng số lượng"
                  leftButtonClassName="h-8 w-8 rounded-r-none bg-black/70"
                  rightButtonClassName="h-8 w-8 rounded-l-none"
                  quantityWidthClassName="flex-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className={`flex items-center justify-center rounded-sm w-full px-3 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] ${outOfStock ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-[var(--color-cod-gray-900)] text-white hover:opacity-90 focus-visible:ring-[var(--color-cod-gray-900)]/30"}`}
                  aria-label={`Thêm ${p.name} vào giỏ`}
                >
                  {outOfStock ? (
                    <>Hết hàng</>
                  ) : added ? (
                    <>
                      <Check className="mr-1 h-3.5 w-3.5" /> Đã thêm
                    </>
                  ) : (
                    <>Thêm vào giỏ</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className={`flex items-center justify-center rounded-sm w-full px-3 py-1 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] ${outOfStock ? "bg-neutral-200 text-neutral-500 cursor-not-allowed" : "bg-[#AE1C2C] text-white hover:opacity-90 focus-visible:ring-[#AE1C2C]/30"}`}
                  aria-label={`Mua ngay ${p.name}`}
                >
                  {outOfStock ? "Hết hàng" : "Mua Ngay"}
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
