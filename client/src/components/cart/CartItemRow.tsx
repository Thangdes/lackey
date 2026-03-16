"use client";

import type { SmartCartItem } from "@/type/cart";
import { CART_UI } from "@/constant/ui";
import PriceWithDiscount from "./parts/PriceWithDiscount";
import QuantityStepper from "./parts/QuantityStepper";
import Subtotal from "./parts/Subtotal";
import CartItemMedia from "./parts/CartItemMedia";
import CartItemInfo from "./parts/CartItemInfo";
import React, { useEffect, useRef, useState } from "react";
import { showInfoToast } from "@/components/toast/AppToast";
import Link from "next/link";
import { buildProductDetailPath } from "@/constant/route";
import { Trash2 } from "lucide-react";

export type CartItemRowProps = {
  item: SmartCartItem;
  highlight?: boolean;
  maxStock?: number | null;
  onChangeQty: (sku: string, qty: number) => void;
  onRemove: (sku: string) => void;
  formatVND: (n?: number) => string;
  mode: string
};

export function CartItemRow({ item: it, highlight, maxStock, onChangeQty, onRemove, formatVND, mode }: CartItemRowProps) {
  const [swipeX, setSwipeX] = useState(0);
  const startXRef = useRef<number | null>(null);
  const activeSwipe = mode === 'mini';
  const threshold = 80;
  const [incLoading, setIncLoading] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const lastIncRef = useRef<number>(0);
  const lastDecRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { itemId?: string; error?: string };
        if (detail?.itemId && it.itemId && detail.itemId === it.itemId) {
          setRowError(detail.error || 'Không thể cập nhật số lượng.');
          window.setTimeout(() => setRowError(null), 2000);
        }
      } catch {}
    };
    if (typeof window !== 'undefined') window.addEventListener('cart:update-error', handler as EventListener);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('cart:update-error', handler as EventListener); };
  }, [it.itemId]);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!activeSwipe) return;
    startXRef.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!activeSwipe) return;
    const sx = startXRef.current;
    if (sx == null) return;
    const dx = e.touches[0].clientX - sx;
    setSwipeX(Math.min(0, dx));
  };
  const onTouchEnd = () => {
    if (!activeSwipe) return;
    if (Math.abs(swipeX) > threshold) {
      onRemove(it.sku);
    }
    setSwipeX(0);
    startXRef.current = null;
  };

  if (mode === 'mini') {
    return (
      <div
        id={`cart-item-${it.sku}`}
        className={`flex items-center gap-3 pb-4 border-b border-gray-200 last:border-b-0 ${highlight ? "bg-amber-50" : ""}`}
      >
        <CartItemMedia item={it} size="sm" />
        
        <div className="flex-1 min-w-0">
          <Link
            href={buildProductDetailPath(it.productSlug || it.productId || "")}
            className="text-sm font-bold text-gray-900 hover:text-gray-700 line-clamp-1 block"
          >
            {it.productName}
          </Link>
          
          {it.variantName && (
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
              {it.variantName}
            </p>
          )}
          
          <p className="text-sm font-bold text-gray-900 mt-1">
            {formatVND(it.price)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center border-2 border-gray-300 rounded-none bg-white">
            <button
              onClick={() => {
                if (it.quantity <= 1) { onRemove(it.sku); return; }
                onChangeQty(it.sku, it.quantity - 1);
              }}
              disabled={decLoading || it.canDecrease === false}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-bold text-gray-900 border-x-2 border-gray-300">
              {it.quantity}
            </span>
            <button
              onClick={() => onChangeQty(it.sku, it.quantity + 1)}
              disabled={incLoading || it.canIncrease === false}
              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => onRemove(it.sku)}
            className="p-1 hover:bg-gray-100 rounded-none transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={14} className="text-gray-500 hover:text-red-600" />
          </button>
        </div>

        {rowError && (
          <p className="absolute bottom-1 left-0 right-0 text-[10px] text-red-600 text-center">{rowError}</p>
        )}
      </div>
    );
  }
  
  if (mode === 'minimal') {
    return (
      <div
        id={`cart-item-${it.sku}`}
        className={
          `flex items-center gap-3 sm:gap-4 py-4 sm:py-5 border-b border-gray-200 last:border-b-0 ` +
          (highlight ? "bg-amber-50" : "bg-white")
        }
      >
        <CartItemMedia item={it} size="md" />
        <div className="flex-1 min-w-0">
          <Link
            href={buildProductDetailPath(it.productSlug || it.productId || "")}
            className="text-sm sm:text-base font-medium text-gray-900 hover:text-gray-700 hover:underline line-clamp-2 block mb-1"
          >
            {it.productName}
          </Link>
          {it.variantName && (
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              {it.variantName}
            </p>
          )}
          <p className="text-sm sm:text-base font-semibold text-gray-900">
            {formatVND(it.price)}
          </p>
          {typeof it.compareAt === 'number' && typeof it.price === 'number' && it.compareAt > it.price && (
            <p className="text-xs text-gray-500 line-through">
              {formatVND(it.compareAt)}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              onClick={() => {
                if (it.quantity <= 1) { onRemove(it.sku); return; }
                onChangeQty(it.sku, it.quantity - 1);
              }}
              disabled={decLoading || it.canDecrease === false}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-bold text-gray-900 border-x border-gray-300">
              {it.quantity}
            </span>
            <button
              onClick={() => onChangeQty(it.sku, it.quantity + 1)}
              disabled={incLoading || it.canIncrease === false}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {rowError && (
            <p className="text-[10px] text-red-600 text-center whitespace-nowrap">{rowError}</p>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2 shrink-0 min-w-[100px]">
          <span className="text-base font-bold text-gray-900">
            {formatVND(it.lineTotal)}
          </span>
          <button
            onClick={() => onRemove(it.sku)}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            aria-label={`Remove ${it.productName}`}
          >
            <Trash2 size={14} />
            <span className="hidden lg:inline">Xóa</span>
          </button>
        </div>

        <button
          onClick={() => onRemove(it.sku)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded transition-colors shrink-0"
          aria-label="Remove item"
        >
          <Trash2 size={16} className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative border-b">
      {activeSwipe && (
        <div className="absolute inset-0 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-end pr-4 text-red-600 text-sm select-none">
          {CART_UI.remove || 'Xóa'}
        </div>
      )}
      <div
        id={`cart-item-${it.sku}`}
        className={
          `${mode === 'mini' ? "" : "rounded-2xl"}` +
          " relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 " +
          (
            highlight
              ? "border border-amber-400 bg-amber-50 ring-2 ring-amber-300"
              : mode === 'mini'
                ? "border-0 bg-white"
                : "border border-black/10 bg-white"
          )
        }
        style={activeSwipe ? { transform: `translateX(${swipeX}px)`, transition: swipeX === 0 ? 'transform 150ms ease-out' : 'none' } : undefined}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <CartItemMedia item={it} size={mode === 'mini' ? 'sm' : 'md'} />
        <div className="min-w-0 w-full flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 sm:gap-4">
          <div className="min-w-0 flex flex-col gap-1.5 sm:gap-2">
            <CartItemInfo item={it} maxStock={maxStock} nameClampLines={mode === 'mini' ? 1 : 2} compact={mode === 'mini'} hideStockOnMobile={mode === 'mini'} hideVariantOnMobile={mode === 'mini'} />
            <div className={`space-y-1 text-xs text-neutral-600 ${mode === 'mini' ? 'hidden sm:block' : ''}`}>
              <div className="flex flex-col gap-0.5">
                <div>Mã: <span className="font-semibold text-neutral-800">{it.sku}</span></div>
                {typeof maxStock === 'number' ? (
                  <div className={maxStock <= 5 ? 'text-orange-600' : 'text-green-600'}>
                    {maxStock <= 5 ? 'Sắp hết' : 'Còn'}: <span className="font-semibold">{maxStock}</span>
                  </div>
                ) : null}
                {typeof it.price === 'number' && typeof it.compareAt === 'number' && it.compareAt > it.price ? (
                  <div className="text-emerald-600">
                    Tiết kiệm: <span className="font-semibold">{formatVND((it.compareAt - it.price) * Math.max(0, it.quantity || 0))}</span>
                  </div>
                ) : null}
                {(it.productSlug || it.productId) ? (
                  <div className="mt-1">
                    <Link href={buildProductDetailPath(it.productSlug || it.productId || "")} className="text-xs text-[var(--color-seagull-700)] hover:text-[var(--color-seagull-800)] hover:underline font-medium">
                      Xem sản phẩm →
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:gap-3 items-start sm:items-end w-full sm:w-auto">
            <PriceWithDiscount price={it.price} compareAt={it.compareAt} formatVND={formatVND} hideCompareOnMobile={mode === 'mini'} />

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <QuantityStepper
                quantity={it.quantity}
                maxStock={maxStock}
                onDecrease={() => {
                  if (it.quantity <= 1) { onRemove(it.sku); return; }
                  if (it.canDecrease === false) { setRowError('Không thể giảm số lượng'); window.setTimeout(() => setRowError(null), 1800); return; }
                  const now = Date.now();
                  if (now - lastDecRef.current < 300) return;
                  lastDecRef.current = now;
                  setDecLoading(true);
                  try { onChangeQty(it.sku, it.quantity - 1); } finally { window.setTimeout(() => setDecLoading(false), 400); }
                }}
                onIncrease={() => {
                  if (it.canIncrease === false) { setRowError('Không thể tăng số lượng'); window.setTimeout(() => setRowError(null), 1800); return; }
                  const now = Date.now();
                  if (now - lastIncRef.current < 300) return; 
                  lastIncRef.current = now;
                  setIncLoading(true);
                  try {
                    onChangeQty(it.sku, it.quantity + 1);
                  } finally {
                    window.setTimeout(() => setIncLoading(false), 400);
                  }
                }}
                onCapReached={() => showInfoToast({ title: "Tối đa trong kho", message: "Bạn đã đạt số lượng tối đa còn trong kho." })}
                increasing={incLoading}
                decreasing={decLoading}
                qtyAriaLabel={CART_UI.qtyFor(it.productName)}
                decreaseLabel={CART_UI.qtyDecrease}
                increaseLabel={CART_UI.qtyIncrease}
                leftButtonClassName={`${mode === 'mini' ? 'h-10 w-10' : 'h-8 w-8'} sm:h-10 sm:w-10 rounded-r-none bg-black/70`}
                rightButtonClassName={`${mode === 'mini' ? 'h-10 w-10' : 'h-8 w-8'} sm:h-10 sm:w-10 rounded-l-none`}
                quantityWidthClassName={`${mode === 'mini' ? 'w-9' : 'w-7'} sm:w-10`}
              />
            </div>

            {rowError ? (
              <div className="text-[11px] text-red-600" aria-live="polite">{rowError}</div>
            ) : null}

            <div className={`mt-2 p-2 bg-gray-50 rounded-lg border ${mode === 'mini' ? 'hidden sm:block' : ''}`}>
              <Subtotal price={it.price} quantity={it.quantity} lineTotal={it.lineTotal} formatVND={formatVND} label={CART_UI.subtotal} compact={mode === 'mini'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
