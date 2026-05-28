"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supplierDashboardService, type SupplierSummary, type TopSellingProduct, type SupplierRecentOrder, type SupplierRevenuePoint } from "@/service/supplier-dashboard.service";
import { Button } from "@/components/ui/button";
import RevenueLineChart from "@/components/supplier/RevenueLineChart";
import TopSellingTable from "@/components/supplier/TopSellingTable";
import RecentOrdersTable from "@/components/supplier/RecentOrdersTable";
import LowStockTable from "@/components/supplier/LowStockTable";
import { useRecentOrdersNewBadge } from "@/hook/supplier/useRecentOrdersNewBadge";
import { currencyVND, calcTotalRevenue, pickLowStockRows } from "@/components/supplier/utils";

export default function SupplierDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SupplierSummary | null>(null);
  const [top, setTop] = useState<TopSellingProduct[]>([]);
  const [recent, setRecent] = useState<SupplierRecentOrder[]>([]);
  const [inventory, setInventory] = useState<Array<{ name: string; variants: { name: string; sku: string; stockQuantity: number }[] }>>([]);
  const [revDays, setRevDays] = useState<7 | 30>(30);
  const [revenue, setRevenue] = useState<SupplierRevenuePoint[]>([]);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [ordersCount30d, setOrdersCount30d] = useState<number>(0);

  const VND = currencyVND;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [sum, top5, rec, inv, rev, oc] = await Promise.all([
          supplierDashboardService.summary().catch(() => null),
          supplierDashboardService.topSellingProducts().catch(() => []),
          supplierDashboardService.recentOrders().catch(() => []),
          supplierDashboardService.inventoryReport().catch(() => []),
          supplierDashboardService.revenueOverTime(revDays).catch(() => []),
          supplierDashboardService.ordersCount(30).catch(() => ({ count: 0 })),
        ]);
        if (!cancelled) {
          setSummary(sum as SupplierSummary | null);
          setTop(Array.isArray(top5) ? top5 : []);
          setRecent(Array.isArray(rec) ? rec : []);
          setInventory(Array.isArray(inv) ? inv : []);
          setRevenue(Array.isArray(rev) ? rev : []);
          setOrdersCount30d(Number(oc?.count || 0));
          try {
            const lastSeen = localStorage.getItem("supplier:lastOrderAt");
            const newest = (Array.isArray(rec) ? rec : [])
              .map((o) => new Date(o.createdAt).getTime())
              .sort((a, b) => b - a)[0];
            if (newest) {
              if (lastSeen) setHasNewOrders(newest > Number(lastSeen));
              localStorage.setItem("supplier:lastOrderAt", String(newest));
            }
          } catch {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [revDays]);

  const hasNewFromPoll = useRecentOrdersNewBadge(30000);

  const lowStockRows = useMemo(() => pickLowStockRows(inventory, 5, 8), [inventory]);

  const showNewOrdersBanner = hasNewOrders || hasNewFromPoll;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bảng điều khiển nhà cung cấp</h1>
        <div className="space-x-2">
          <Button asChild variant="outline"><Link href="/supplier/orders">Xem đơn hàng</Link></Button>
        </div>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
        Lưu ý: Nhà cung cấp hiện <span className="font-semibold">không thể đăng/tạo sản phẩm</span>. Vui lòng liên hệ quản trị viên nếu bạn cần hỗ trợ.
      </div>

      {showNewOrdersBanner && (
        <div className="rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm text-blue-900">
          Có đơn hàng mới kể từ lần cuối bạn kiểm tra. <Link className="underline" href="/supplier/orders">Xem ngay</Link>
        </div>
      )}

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-md border p-4 bg-white">
            <div className="text-xs text-muted-foreground">Doanh thu (tổng)</div>
            <div className="text-lg font-semibold mt-1">{summary ? VND.format(Number(summary.totalRevenue || 0)) : (loading ? "—" : "0")}</div>
          </div>
          <div className="rounded-md border p-4 bg-white">
            <div className="text-xs text-muted-foreground">Doanh thu (tháng này)</div>
            <div className="text-lg font-semibold mt-1">{summary ? VND.format(Number(summary.revenueThisMonth || 0)) : (loading ? "—" : "0")}</div>
          </div>
          <div className="rounded-md border p-4 bg-white">
            <div className="text-xs text-muted-foreground">Sản phẩm</div>
            <div className="text-lg font-semibold mt-1">{summary ? Number(summary.totalProducts || 0) : (loading ? "—" : "0")}</div>
          </div>
          <div className="rounded-md border p-4 bg-white">
            <div className="text-xs text-muted-foreground flex items-center justify-between">
              <span>Đơn cần xử lý</span>
            </div>
            <div className="text-lg font-semibold mt-1">{summary ? Number(summary.pendingOrdersCount || 0) : (loading ? "—" : "0")}</div>
          </div>
          <div className="rounded-md border p-4 bg-white lg:col-span-2">
            <div className="text-xs text-muted-foreground">Đơn trong 30 ngày</div>
            <div className="text-lg font-semibold mt-1">{ordersCount30d}</div>
          </div>
        </div>
      </section>

      {}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Link href="/supplier/chart" className="rounded-xl border p-4 hover:bg-neutral-50 transition inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center text-lg">📈</div>
            <div>
              <div className="font-semibold">Biểu đồ doanh thu</div>
              <div className="text-sm text-neutral-600">Xem doanh thu theo ngày</div>
            </div>
          </Link>
          <Link href="/supplier/orders" className="rounded-xl border p-4 hover:bg-neutral-50 transition inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center text-lg">🧾</div>
            <div>
              <div className="font-semibold">Xem tất cả đơn hàng</div>
              <div className="text-sm text-neutral-600">Theo dõi đơn mới và trạng thái xử lý</div>
            </div>
          </Link>
          <Link href="/supplier/inventory" className="rounded-xl border p-4 hover:bg-neutral-50 transition inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center text-lg">📦</div>
            <div>
              <div className="font-semibold">Quản lý tồn kho</div>
              <div className="text-sm text-neutral-600">Cập nhật số lượng, kiểm tra sắp hết</div>
            </div>
          </Link>
          <Link href="/supplier/profile" className="rounded-xl border p-4 hover:bg-neutral-50 transition inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center text-lg">👤</div>
            <div>
              <div className="font-semibold">Cập nhật hồ sơ</div>
              <div className="text-sm text-neutral-600">Thông tin liên hệ, địa chỉ nhận hàng</div>
            </div>
          </Link>
          <Link href="/supplier/help" className="rounded-xl border p-4 hover:bg-neutral-50 transition inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-black text-white flex items-center justify-center text-lg">❓</div>
            <div>
              <div className="font-semibold">Hướng dẫn</div>
              <div className="text-sm text-neutral-600">Cách sử dụng nhanh</div>
            </div>
          </Link>
        </div>
      </section>

      {}
      <section id="chart" className="rounded-md border overflow-hidden">
        <div className="px-4 py-2 border-b font-medium flex items-center justify-between">
          <span>Biểu đồ doanh thu</span>
          <div className="flex items-center gap-2">
            <button
              className={`h-8 px-3 rounded-md border text-sm ${revDays === 7 ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setRevDays(7)}
            >7 ngày</button>
            <button
              className={`h-8 px-3 rounded-md border text-sm ${revDays === 30 ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setRevDays(30)}
            >30 ngày</button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {revenue.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-md border p-3">
                <div className="text-neutral-500">Tổng doanh thu</div>
                <div className="font-semibold">{VND.format(calcTotalRevenue(revenue))}</div>
              </div>
              <div className="rounded-md border p-3">
                <div className="text-neutral-500">Ngày gần nhất</div>
                <div className="font-semibold">{VND.format(Number(revenue[revenue.length - 1]?.revenue || 0))}</div>
              </div>
            </div>
          )}
          {revenue.length === 0 ? (
            <div className="text-sm text-neutral-600">Chưa có dữ liệu.</div>
          ) : (
            <RevenueLineChart data={revenue} height={220} valueFormatter={(v) => VND.format(Number(v))} />
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md border overflow-hidden">
          <div className="px-4 py-2 border-b font-medium">Top sản phẩm bán chạy</div>
          <div className="p-2">
            <TopSellingTable items={top} />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="px-4 py-2 border-b font-medium flex items-center justify-between">
            <span>Đơn hàng gần đây</span>
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center justify-center h-5 rounded-full bg-neutral-100 px-2 border">{recent.length}</span>
              {showNewOrdersBanner && <span className="text-blue-600">Có đơn mới</span>}
            </span>
          </div>
          <div className="p-2">
            <RecentOrdersTable items={recent} onRowClick={(id) => router.push(`/supplier/orders/${id}`)} />
          </div>
        </div>
      </section>

      {}
      <section className="rounded-md border overflow-hidden">
        <div className="px-4 py-2 border-b font-medium">Cảnh báo tồn kho thấp</div>
        <div className="p-2">
          <LowStockTable rows={lowStockRows} onRowClick={(q) => router.push(`/supplier/inventory?q=${encodeURIComponent(q)}`)} />
        </div>
      </section>
    </div>
  );
}
