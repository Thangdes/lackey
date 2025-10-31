"use client";

import { useEffect, useState } from "react";
import { useMyOrdersPaginated } from "@/hook/useOrder";
import { statusClasses, statusDescription, statusLabel } from "@/constant/order-status";
import { formatDate, formatVND } from "@/utils/format";
import InlineCancel from "./InlineCancel";
import OrderInlineDetails from "./OrderInlineDetails";

export type OrderTabKey = "all" | "pending" | "confirmed" | "preparing" | "shipping" | "completed" | "canceled";

export default function OrderTabContent({
  activeTab,
  page,
  limit,
  q,
  fromDate,
  toDate,
  onPageChange,
  onLimitChange,
  onTotalChange,
  useServerFilter = false,
}: {
  activeTab: OrderTabKey;
  page: number;
  limit: number;
  q: string;
  fromDate: string;
  toDate: string;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onTotalChange?: (total: number) => void;
  useServerFilter?: boolean;
}) {
  const statusMap: Record<string, string | undefined> = {
    all: undefined,
    pending: "PENDING_CONFIRMATION",
    confirmed: "CONFIRMED",
    preparing: "PREPARING_SHIPMENT",
    shipping: "SHIPPED",
    completed: "COMPLETED",
    canceled: "CANCELED",
  };
  const status = statusMap[activeTab];
  // Persist expanded ids across pagination
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("profile_orders_expanded");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setExpandedIds(arr.filter(Boolean));
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("profile_orders_expanded", JSON.stringify(expandedIds));
    } catch {}
  }, [expandedIds]);
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const fetchParams = useServerFilter
    ? { page, limit, status, search: q, fromDate, toDate }
    : { page, limit, search: q, fromDate, toDate };
  const { data, isLoading, error } = useMyOrdersPaginated(fetchParams);
  const orders = data?.items ?? [];
  const filtered = useServerFilter
    ? orders
    : (() => {
        const up = (s: string) => String(s || '').toUpperCase();
        switch (activeTab) {
          case 'pending':
            return orders.filter(o => up(o.status) === 'PENDING_CONFIRMATION');
          case 'confirmed':
            return orders.filter(o => up(o.status) === 'CONFIRMED');
          case 'preparing':
            return orders.filter(o => up(o.status) === 'PREPARING_SHIPMENT');
          case 'shipping':
            return orders.filter(o => up(o.status) === 'SHIPPED');
          case 'completed':
            return orders.filter(o => up(o.status) === 'COMPLETED');
          case 'canceled':
            return orders.filter(o => up(o.status) === 'CANCELED');
          case 'all':
          default:
            return orders;
        }
      })();
  const displayTotal = filtered.length;
  useEffect(() => {
    onTotalChange?.(displayTotal);
  }, [displayTotal, onTotalChange]);
  const totalPages = Math.max(1, Math.ceil(displayTotal / (limit || 10)));

  return (
    <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl border border-black/10 bg-white shadow-sm">
      {isLoading ? (
        <div className="p-4 sm:p-5 text-sm text-center text-neutral-600 animate-pulse">Đang tải đơn hàng...</div>
      ) : error ? (
        <div className="p-4 sm:p-5 text-sm text-center text-red-600 bg-red-50 rounded-lg">Không thể tải danh sách đơn hàng.</div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="text-4xl sm:text-5xl mb-3">📦</div>
              <div className="text-sm sm:text-base text-black/60">Không có đơn hàng phù hợp.</div>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {filtered.map((o) => (
                <li key={o.id} className="p-3 sm:p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm sm:text-base truncate">Mã đơn: {o.orderCode || o.code || o.id}</div>
                      <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-medium ${statusClasses(o.status)}`} title={statusDescription(o.status)}>{statusLabel(o.status)}</span>
                        {o.createdAt && <span className="hidden sm:inline text-black/50">•</span>}
                        {o.createdAt && <span className="text-black/60">{formatDate(o.createdAt)}</span>}
                        {(() => {
                          const r = o as unknown as { deliveryCode?: string | null; carrier?: string | null; shippingCarrier?: string | null };
                          const dc = (r.deliveryCode || "").trim();
                          const carrier = (r.carrier || r.shippingCarrier || "").toString().trim();
                          if (!dc && !carrier) return null;
                          return (
                            <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-sky-800">
                              {carrier ? <strong className="font-semibold">{carrier}</strong> : null}
                              {carrier && dc ? <span>•</span> : null}
                              {dc ? <span>Mã vận chuyển: <span className="font-medium">{dc}</span></span> : null}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className="text-base sm:text-lg font-bold text-[#AE1C2C] whitespace-nowrap order-first sm:order-none">{formatVND((o as unknown as { totalAmount?: number; total?: number }).totalAmount ?? (o as unknown as { total?: number }).total ?? 0)}</div>
                      <div className="flex items-center gap-2">
                        {String(o.status || "").toUpperCase() === "PENDING_CONFIRMATION" && (
                          <InlineCancel orderId={o.id} orderCode={(o as unknown as { orderCode?: string; code?: string }).orderCode || (o as unknown as { code?: string }).code} />
                        )}
                        <button
                          type="button"
                          className="flex-1 sm:flex-none rounded-lg border border-black/15 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-black/5 transition-colors"
                          onClick={() => toggleExpanded(o.id)}
                          aria-expanded={expandedIds.includes(o.id)}
                        >
                          {expandedIds.includes(o.id) ? "Ẩn chi tiết" : "Xem chi tiết"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedIds.includes(o.id) && (
                    <OrderInlineDetails order={o} />
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-black/10 p-3 sm:p-4 bg-neutral-50">
            <div className="text-xs sm:text-sm text-black/60 text-center sm:text-left">
              <span className="font-medium">Trang {page} / {totalPages}</span>
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline mt-0.5 sm:mt-0">Tổng {displayTotal} đơn</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex-1 sm:flex-none rounded-lg border border-black/15 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                ← Trước
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none rounded-lg border border-black/15 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Sau →
              </button>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value) || 10)}
                className="rounded-lg border border-black/15 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium bg-white hover:bg-neutral-50 transition-colors"
                aria-label="Số dòng mỗi trang"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}/trang</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
