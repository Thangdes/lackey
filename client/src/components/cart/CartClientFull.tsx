"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/type/product";
import { useSmartCart } from "@/hook/useCart";
import type { SmartCartItem } from "@/type/cart";
import { formatVND } from "@/utils/format";
import { ROUTES } from "@/constant/route";
import { CART_UI } from "@/constant/ui";
import { ShoppingCart } from "lucide-react";
import { productService } from "@/service/product.service";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";
import { MobileCheckoutBar } from "./MobileCheckoutBar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiClipboard, FiShoppingBag } from "react-icons/fi";
import { useCartDiscount } from "@/hook/useCartDiscount";
import { useCartShippingFee } from "./hooks/useCartShippingFee";
import { AddressModal } from "../checkout/modals/AddressModal";

// Mock data for testing
const MOCK_CART_ITEMS: SmartCartItem[] = [
  {
    itemId: "mock-1",
    sku: "MK-ANIME-001",
    variantId: "var-1",
    productId: "prod-1",
    productName: "Móc khóa Naruto Uzumaki",
    productSlug: "moc-khoa-naruto",
    variantName: "Size M / Màu vàng",
    price: 45000,
    compareAt: 65000,
    quantity: 2,
    lineTotal: 90000,
    thumbnailUrl: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=200",
    canIncrease: true,
    canDecrease: true,
  },
  {
    itemId: "mock-2",
    sku: "MK-KPOP-002",
    variantId: "var-2",
    productId: "prod-2",
    productName: "Móc khóa BTS Jungkook",
    productSlug: "moc-khoa-bts",
    variantName: "Size L / Màu đen",
    price: 52000,
    compareAt: 75000,
    quantity: 1,
    lineTotal: 52000,
    thumbnailUrl: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=200",
    canIncrease: true,
    canDecrease: true,
  },
  {
    itemId: "mock-3",
    sku: "MK-GAME-003",
    variantId: "var-3",
    productId: "prod-3",
    productName: "Móc khóa League of Legends Yasuo",
    productSlug: "moc-khoa-lol",
    variantName: "Size M / Phiên bản giới hạn",
    price: 65000,
    compareAt: undefined,
    quantity: 1,
    lineTotal: 65000,
    thumbnailUrl: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=200",
    canIncrease: true,
    canDecrease: true,
  },
];

export default function CartClientFull({ forceHighlightSku }: { forceHighlightSku?: string }) {
  const cart = useSmartCart();
  const sp = useSearchParams();
  
  // Toggle mock data for testing
  const [useMockData, setUseMockData] = useState(false);
  const items = useMockData ? MOCK_CART_ITEMS : (cart.items as SmartCartItem[]);

  const subtotal = cart.totals?.subtotal ?? 0;
  const { options, selectedCode, appliedCode, discountAmount, applyingDiscount, onSelect, onClear } = useCartDiscount(subtotal);
  
  const {
    shippingFee,
    loading: shippingLoading,
    currentAddress,
    addressModalOpen,
    openAddressModal,
    closeAddressModal,
    refreshAddresses,
  } = useCartShippingFee(items, subtotal);
  const [highlightSku, setHighlightSku] = useState<string | null>(null);
  const totalsMissing = !cart.totals;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDev = process.env.NODE_ENV !== 'production';
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    try { if (typeof window !== 'undefined') setShowDebug(window.localStorage.getItem('debugCart') === '1'); } catch {}
  }, []);
  const toggleDebug = useCallback(() => {
    const next = !showDebug;
    setShowDebug(next);
    try { if (typeof window !== 'undefined') window.localStorage.setItem('debugCart', next ? '1' : '0'); } catch {}
  }, [showDebug]);

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

  const [freeShipThreshold] = useState<number>(0); 
  const effectiveShipping = (freeShipThreshold > 0 && subtotal >= freeShipThreshold) ? 0 : shippingFee;
  const total = useMemo(() => Math.max(0, (cart.totals?.totalAfterDiscount ?? 0) + effectiveShipping), [cart.totals?.totalAfterDiscount, effectiveShipping]);

  useEffect(() => {
    const sku = sp?.get("highlight");
    if (!sku) return;
    setHighlightSku(sku);
    const id = `cart-item-${sku}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const t = setTimeout(() => setHighlightSku(null), 4000);
    return () => clearTimeout(t);
  }, [sp]);

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
  
  const handleChangeAddress = useCallback(() => {
    openAddressModal();
  }, [openAddressModal]);
  
  const handleAddressSaved = useCallback(async (payload: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
    isDefault: boolean;
  }) => {
    try {
      localStorage.setItem(
        "defaultAddress",
        JSON.stringify({
          recipient_name: payload.fullName,
          phone_number: payload.phone,
          street: payload.street,
          ward: payload.ward,
          district: payload.district,
          city: payload.city,
        }),
      );
    } catch {
      // Silently handle error
    }
    
    await refreshAddresses();
    closeAddressModal();
  }, [refreshAddresses, closeAddressModal]);

  if (!mounted) {
    return null;
  }

  if (cart.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShoppingCart size={28} />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-red-700">Không thể tải giỏ hàng</h2>
        <p className="mt-2 text-red-600/80">Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (mounted && items.length === 0 && !useMockData) {
    return (
      <div className="bg-white p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center bg-gray-100 text-gray-500 rounded-full">
          <ShoppingCart size={28} />
        </div>
        <h2 className="mt-3 text-xl font-semibold text-gray-900">{CART_UI.empty}</h2>
        <p className="mt-2 text-gray-600">{CART_UI.emptyHelp}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href={ROUTES.products} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors">
            <FiShoppingBag />
            {CART_UI.continue}
          </Link>
          <button
            onClick={() => setUseMockData(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Load Mock Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isDev && !showDebug && (
        <button
          type="button"
          onClick={toggleDebug}
          className="fixed z-40 bottom-4 right-4 rounded px-2.5 py-1.5 text-xs bg-black text-white shadow hover:bg-black/90"
          aria-label="Toggle cart debug"
        >
          Debug Cart
        </button>
      )}
      {isDev && showDebug && (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs p-3 space-y-1">
          <div className="flex items-center justify-between">
            <strong>Cart Debug (client)</strong>
            <button type="button" onClick={toggleDebug} className="text-[11px] underline">Hide</button>
          </div>
          <div>items: {items.length}</div>
          <div>totals: {cart.totals ? JSON.stringify(cart.totals) : 'null'}</div>
          <div>error: {cart.error ? String(cart.error) : 'null'}</div>
        </div>
      )}
      {totalsMissing && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2" role="alert">
          Thiếu totals từ Backend: Vui lòng kiểm tra API /cart trả về totals.
        </div>
      )}
      {mounted ? (
        <div className="mb-3 flex items-center justify-end lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-full px-3 py-1.5 text-sm inline-flex items-center gap-2">
                <FiClipboard />
                {CART_UI.summary}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] min-h-[50vh] p-0 flex flex-col">
              <SheetHeader className="shrink-0 px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
                <SheetTitle className="text-base sm:text-lg truncate">{CART_UI.summary}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 pb-8">
                <CartSummary
                  subtotal={subtotal}
                  effectiveShipping={effectiveShipping}
                  total={total}
                  itemsLength={items.length}
                  options={options}
                  selectedCode={selectedCode}
                  appliedCode={appliedCode}
                  discountAmount={discountAmount}
                  applyingDiscount={applyingDiscount}
                  onSelect={onSelect}
                  onClearDiscount={onClear}
                  formatVND={formatVND}
                  savings={cart.totals?.savings}
                  shippingLoading={shippingLoading}
                  currentAddress={currentAddress}
                  onChangeAddress={handleChangeAddress}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      ) : null}
      {/* Cart Header */}
      <div className="mb-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900">
          Shopping cart ({items.length})
        </h1>
        <Link
          href={ROUTES.products}
          className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
        >
          Shop some of our faves
        </Link>
      </div>

      {/* Toggle Mock Data Button (Dev only) */}
      {isDev && (
        <button
          onClick={() => setUseMockData(!useMockData)}
          className="mb-4 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {useMockData ? 'Using Mock Data' : 'Use Real Data'}
        </button>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart Items Table */}
        <div className="lg:col-span-2">
          {/* Table Header - Desktop only */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 pb-4 mb-4 border-b border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          {/* Cart Items */}
          <div className="space-y-0">
            {items.map((it) => (
              <CartItemRow
                key={it.sku}
                item={it}
                highlight={highlightSku === it.sku}
                maxStock={stockMap.get(it.sku)}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
                formatVND={formatVND}
                mode="minimal"
              />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-1 lg:sticky lg:top-24 self-start">
          <CartSummary
            subtotal={subtotal}
            effectiveShipping={effectiveShipping}
            total={total}
            itemsLength={items.length}
            options={options}
            selectedCode={selectedCode}
            appliedCode={appliedCode}
            discountAmount={discountAmount}
            applyingDiscount={applyingDiscount}
            onSelect={onSelect}
            onClearDiscount={onClear}
            formatVND={formatVND}
            savings={cart.totals?.savings}
            shippingLoading={shippingLoading}
            currentAddress={currentAddress}
            onChangeAddress={handleChangeAddress}
          />
        </aside>
      </div>

      <MobileCheckoutBar
        total={total}
        formatVND={formatVND}
        continueLabel={CART_UI.continue}
        checkoutLabel={CART_UI.checkout}
      />
      
      {/* Address Modal */}
      <AddressModal
        open={addressModalOpen}
        onClose={closeAddressModal}
        onSave={handleAddressSaved}
      />
    </>
  );
}
