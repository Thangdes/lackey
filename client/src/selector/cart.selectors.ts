import type { ServerCartItem, SmartCartItem } from "@/type/cart";
import type { LocalCartItem as TLocalCartItem } from "@/type/checkout";

export function selectSmartCartItems(serverItems: ServerCartItem[]): SmartCartItem[] {
  const items = serverItems || [];
  return items.map((it) => {
    return {
      itemId: it.id,
      variantId: it.productVariantId,
      quantity: it.quantity,
      productId: it?.product?.id || it?.productVariant?.product?.id,
      price: ((): number | undefined => {
        type MaybePricing = { effectivePrice?: unknown; discountPrice?: unknown; price?: unknown };
        const p = it as unknown as MaybePricing;
        const eff = p?.effectivePrice;
        if (typeof eff === "number" && Number.isFinite(eff)) return eff;
        const flatCandidate = p?.discountPrice ?? p?.price;
        const flat = typeof flatCandidate === "number" ? flatCandidate : Number(flatCandidate ?? NaN);
        const n = typeof flat === "number" ? flat : Number(flat ?? NaN);
        return Number.isFinite(n) ? n : undefined;
      })(),
      compareAt: (() => {
        const p = it as unknown as { price?: unknown; discountPrice?: unknown };
        const base = p?.price;
        const disc = p?.discountPrice;
        if (typeof base === "number" && typeof disc === "number" && disc > 0 && disc < base) return base;
        return undefined;
      })(),
      productName: it?.product?.name || ((): string | undefined => {
        const v = (it as unknown as { productName?: unknown })?.productName;
        return typeof v === "string" ? v : undefined;
      })() || it?.productVariant?.product?.name || "",
      variantName: ((): string | undefined => {
        const v = (it as unknown as { name?: unknown })?.name;
        return typeof v === "string" ? v : undefined;
      })() || it?.productVariant?.name || "",
      thumbnailUrl: it?.product?.thumbnailUrl || it?.productVariant?.product?.thumbnailUrl || null,
      sku: ((): string | undefined => {
        const v = (it as unknown as { sku?: unknown })?.sku;
        return typeof v === "string" ? v : undefined;
      })() || it?.productVariant?.sku || it.productVariantId,
      productSlug: it?.product?.slug || it?.productVariant?.product?.slug ||
        
        (it?.product?.id || it?.productVariant?.product?.id) || undefined,
      lineTotal: (() => {
        const v = (it as unknown as { lineTotal?: unknown })?.lineTotal;
        return typeof v === "number" ? v : undefined;
      })(),
      canIncrease: (it as unknown as { canIncrease?: boolean })?.canIncrease,
      canDecrease: (it as unknown as { canDecrease?: boolean })?.canDecrease,
      maxAddable: (it as unknown as { maxAddable?: number })?.maxAddable,
      isOutOfStock: (it as unknown as { isOutOfStock?: boolean })?.isOutOfStock,
      supplierName: ((): string | undefined => {
        const prod = it?.product as unknown as { supplier?: { name?: string } } | undefined;
        return prod?.supplier?.name;
      })(),
    };
  });
}

export function selectTotalItems(items: SmartCartItem[]): number {
  return (items || []).reduce((sum, it) => sum + Math.max(0, it.quantity || 0), 0);
}

export function toLocalCartItem(items: Array<{ sku: string; productName: string; variantId: string; variantName: string; price?: number; quantity: number; thumbnailUrl?: string | null; } & { productId?: string }>): TLocalCartItem[] {
  return (items || []).map((it) => ({
    sku: it.sku,
    productId: it.productId || it.variantId,
    productName: it.productName,
    variantId: it.variantId,
    variantName: it.variantName,
    price: it.price,
    quantity: it.quantity,
    thumbnailUrl: it.thumbnailUrl || undefined,
  }));
}
