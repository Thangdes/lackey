"use client";

import { useEffect, useState } from "react";
import { useMyOrdersPaginated } from "@/hook/useOrder";
import { statusClasses, statusDescription, statusLabel } from "@/constant/order-status";
import { formatDate, formatVND } from "@/utils/format";
import InlineCancel from "./InlineCancel";
import OrderInlineDetails from "./OrderInlineDetails";
import { PackageOpen } from "lucide-react";

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
    <div className="mt-4 rounded-xl border border-neutral-200 bg-white overflow-hidden">
      {isLoading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-neutral-500 animate-pulse">
           <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
           <span className="text-sm">Đang tải đơn hàng...</span>
        </div>
      ) : error ? (
        <div className="p-8 text-sm text-center text-red-600 bg-red-50">Không thể tải danh sách đơn hàng.</div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                <PackageOpen size={32} />
              </div>
              <h3 className="text-base font-medium text-black mb-1">Không có đơn hàng</h3>
              <p className="text-sm text-neutral-500 max-w-sm">Không tìm thấy đơn hàng nào phù hợp với trạng thái hoặc bộ lọc hiện tại.</p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {filtered.map((o) => (
                <li key={o.id} className="p-4 sm:p-5 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-black truncate">Mã đơn: {o.orderCode || o.code || o.id}</span>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${statusClasses(o.status)}`} title={statusDescription(o.status)}>
                          {statusLabel(o.status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                        {o.createdAt && <span>{formatDate(o.createdAt)}</span>}
                        {(() => {
                          const r = o as unknown as { deliveryCode?: string | null; carrier?: string | null; shippingCarrier?: string | null };
                          const dc = (r.deliveryCode || "").trim();
                          const carrier = (r.carrier || r.shippingCarrier || "").toString().trim();
                          if (!dc && !carrier) return null;
                          return (
                            <>
                              <span className="hidden sm:inline text-neutral-300">•</span>
                              <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-0.5 text-neutral-700">
                                {carrier ? <span className="font-medium">{carrier}</span> : null}
                                {carrier && dc ? <span className="text-neutral-400">|</span> : null}
                                {dc ? <span>Mã: <span className="font-medium text-black">{dc}</span></span> : null}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3 shrink-0">
                      <div className="text-base sm:text-lg font-bold text-[#AE1C2C]">
                        {formatVND((o as unknown as { totalAmount?: number; total?: number }).totalAmount ?? (o as unknown as { total?: number }).total ?? 0)}
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {String(o.status || "").toUpperCase() === "PENDING_CONFIRMATION" && (
                          <InlineCancel orderId={o.id} orderCode={(o as unknown as { orderCode?: string; code?: string }).orderCode || (o as unknown as { code?: string }).code} />
                        )}
                        <button
                          type="button"
                          className="flex-1 sm:flex-none justify-center inline-flex items-center rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-50 transition-colors"
                          onClick={() => toggleExpanded(o.id)}
                          aria-expanded={expandedIds.includes(o.id)}
                        >
                          {expandedIds.includes(o.id) ? "Ẩn chi tiết" : "Xem chi tiết"}
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedIds.includes(o.id) && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <OrderInlineDetails order={o} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-200 p-4 bg-neutral-50/50">
            <div className="text-sm text-neutral-500 text-center sm:text-left">
              <span className="font-medium text-black">Trang {page} / {totalPages}</span>
              <span className="hidden sm:inline mx-2 text-neutral-300">|</span>
              <span className="block sm:inline mt-1 sm:mt-0">Tổng {displayTotal} đơn</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                className="flex-1 sm:flex-none rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium bg-white text-black hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                ← Trước
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium bg-white text-black hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Sau →
              </button>
              <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value) || 10)}
                className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-colors"
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
