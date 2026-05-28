"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { Product } from "@/type/product";
import { useSmartCart } from "@/hook/useCart";
import type { SmartCartItem } from "@/type/cart";
import { formatVND } from "@/utils/format";
import { ROUTES } from "@/constant/route";
import { productService } from "@/service/product.service";
import { CartItemRow } from "./CartItemRow";
import { Truck } from "lucide-react";

export default function CartMiniClient({ highlightSku: forceHighlightSku, hideMiniAction }: { highlightSku?: string; hideMiniAction?: boolean; }) {
  const cart = useSmartCart();
  const items = (cart.items as SmartCartItem[]);

  const FREE_SHIPPING_THRESHOLD = 500000;
  const subtotal = cart.totals?.subtotal ?? 0;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const [highlightSku, setHighlightSku] = useState<string | null>(null);

  const [stockMap, setStockMap] = useState<Map<string, number>>(new Map());
  const productIdsKey = useMemo(() => {
    const ids = Array.from(new Set(items.map(it => it.productId).filter(Boolean))) as string[];
    ids.sort();
    return ids.join(",");
  }, [items]);
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      try {
        const ids = productIdsKey ? productIdsKey.split(",") : [];
        if (ids.length === 0) { if (!aborted) setStockMap(new Map()); return; }
        const results = await Promise.allSettled(ids.map((id) => productService.getById(id)));
        const map = new Map<string, number>();
        for (const r of results) {
          if (r.status === "fulfilled") {
            const p = r.value as Product;
            for (const v of (p.variants ?? [])) {
              const sku = v.sku || v.id;
              if (sku) map.set(sku, Math.max(0, v.stockQuantity ?? 0));
            }
          }
        }
        if (!aborted) setStockMap(map);
      } catch {
        if (!aborted) setStockMap(new Map());
      }
    };
    run();
    return () => { aborted = true; };
  }, [productIdsKey]);

  const onChangeQty = useCallback((sku: string, qty: number) => {
    const maxStock = stockMap.get(sku);
    const upper = typeof maxStock === "number" && maxStock > 0 ? maxStock : 99;
    const next = Math.max(0, Math.min(upper, Math.floor(qty)));
    const item = items.find((it) => it.sku === sku);
    if (!item) {
      return;
    }
    if (item.itemId) {
      cart.updateQty(item.itemId, next);
    } else if (item.variantId) {
      const delta = next - item.quantity;
      if (delta > 0) {
        cart.add(item.variantId, delta);
      } else if (delta < 0) {
        if (item.itemId) {
          cart.updateQty?.(item.itemId, next);
        }
      }
    }
  }, [cart, items, stockMap]);

  const onRemove = useCallback((sku: string) => {
    onChangeQty(sku, 0);
  }, [onChangeQty]);

  useEffect(() => {
    if (!forceHighlightSku) return;
    setHighlightSku(forceHighlightSku);
    const id = `cart-item-${forceHighlightSku}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const t = setTimeout(() => setHighlightSku(null), 4000);
    return () => clearTimeout(t);
  }, [forceHighlightSku]);

  if (cart.error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Không thể tải giỏ hàng. Vui lòng thử lại sau.
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="text-center">
          <p className="text-base text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
          <Link
            href={ROUTES.products}
            className="inline-block px-6 py-3 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {}
      <div className="shrink-0 px-6 py-4 bg-gray-50">
        {hasFreeShipping ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <Truck className="w-4 h-4" />
            <span>Bạn đã được miễn phí ship!</span>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-600 mb-2">
              Thêm <span className="font-semibold text-gray-900">{formatVND(remaining)}</span> để được miễn phí ship
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        <div className="space-y-4">
          {items.map((it) => (
            <CartItemRow
              key={it.sku}
              item={it}
              highlight={highlightSku === it.sku}
              maxStock={stockMap.get(it.sku)}
              onChangeQty={onChangeQty}
              onRemove={onRemove}
              formatVND={formatVND}
              mode="mini"
            />
          ))}
        </div>
      </div>

      {}
      <div className="shrink-0 border-t border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900 uppercase">
              TỔNG CỘNG
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatVND(subtotal)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            Thuế và phí ship sẽ được tính khi thanh toán
          </p>

          <Link
            href={ROUTES.checkout}
            className="block w-full py-3 bg-[#fff100] hover:bg-[#ffed00] border-2 border-black text-black text-center text-sm font-bold uppercase tracking-wide transition-colors"
          >
            THANH TOÁN NGAY
          </Link>

          {!hideMiniAction && (
            <Link
              href={ROUTES.cart}
              className="block w-full py-3 mt-2 text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Xem giỏ hàng
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
