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
import { Button } from "@/components/ui/button";

export default function CartMiniClient({ hideMiniAction, highlightSku: forceHighlightSku }: { hideMiniAction?: boolean; highlightSku?: string; }) {
  const cart = useSmartCart();
  const items = (cart.items as SmartCartItem[]);

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
      <div className="p-4 text-sm text-neutral-600">Giỏ hàng của bạn đang trống.</div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh] border-none flex-1">
      <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-3 divide-y divide-black/10 border-t border-black/10">
        {items.map((it) => (
          <div key={it.sku} className="py-3">
            <CartItemRow
              item={it}
              highlight={highlightSku === it.sku}
              maxStock={stockMap.get(it.sku)}
              onChangeQty={onChangeQty}
              onRemove={onRemove}
              formatVND={formatVND}
              mode={"mini"}
            />
          </div>
        ))}
      </div>
      {!hideMiniAction && (
        <div className="mt-auto pt-4 border-t border-black/10 py-2 px-4">
          <Button asChild className="w-full rounded-lg">
            <Link href={ROUTES.cart}>
              Xem giỏ hàng
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
