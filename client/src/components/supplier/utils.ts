import type { RevenuePoint, RecentOrder, InventoryItem } from "@/type/supplier";

export const currencyVND = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function calcTotalRevenue(points: RevenuePoint[]): number {
  return points.reduce((s, d) => s + Number(d.revenue || 0), 0);
}

export function getNewestOrderTimestamp(orders: RecentOrder[]): number | null {
  const newest = orders
    .map((o) => new Date(o.createdAt).getTime())
    .filter((t) => Number.isFinite(t) && t > 0)
    .sort((a, b) => b - a)[0];
  return newest || null;
}

export function pickLowStockRows(inventory: InventoryItem[], lowThreshold = 5, limit = 8) {
  return inventory
    .flatMap((p) => (p.variants || []).map((v) => ({ product: p.name, ...v })))
    .filter((v) => (v.stockQuantity ?? 0) <= lowThreshold)
    .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
    .slice(0, limit);
}
