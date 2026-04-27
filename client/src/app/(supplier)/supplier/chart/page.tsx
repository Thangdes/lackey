"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supplierDashboardService, type SupplierRevenuePoint } from "@/service/supplier-dashboard.service";
import { Button } from "@/components/ui/button";
import RevenueLineChart from "@/components/supplier/RevenueLineChart";
import { currencyVND } from "@/components/supplier/utils";

export default function SupplierChartPage() {
  const [revDays, setRevDays] = useState<7 | 30>(30);
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<SupplierRevenuePoint[]>([]);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  const VND = currencyVND;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [rev, cnt] = await Promise.all([
          supplierDashboardService.revenueOverTime(revDays).catch(() => [] as SupplierRevenuePoint[]),
          supplierDashboardService.ordersCount(revDays).catch(() => ({ count: 0 })),
        ]);
        if (!cancelled) {
          setRevenue(Array.isArray(rev) ? rev : []);
          setOrdersCount(Number(cnt?.count || 0));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [revDays]);

  const total = useMemo(() => revenue.reduce((s, d) => s + Number(d.revenue || 0), 0), [revenue]);
  const latest = useMemo(() => Number(revenue[revenue.length - 1]?.revenue || 0), [revenue]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline"><Link href="/supplier">← Bảng điều khiển</Link></Button>
          <h1 className="text-xl font-semibold">Biểu đồ doanh thu</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`h-9 px-3 rounded-md border text-sm ${revDays === 7 ? 'bg-black text-white' : 'bg-white'}`}
            onClick={() => setRevDays(7)}
          >7 ngày</button>
          <button
            className={`h-9 px-3 rounded-md border text-sm ${revDays === 30 ? 'bg-black text-white' : 'bg-white'}`}
            onClick={() => setRevDays(30)}
          >30 ngày</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="rounded-md border p-3">
          <div className="text-neutral-500">Tổng doanh thu</div>
          <div className="font-semibold">{VND.format(total)}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-neutral-500">Ngày gần nhất</div>
          <div className="font-semibold">{VND.format(latest)}</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-neutral-500">Đơn trong {revDays} ngày</div>
          <div className="font-semibold">{ordersCount}</div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          {loading ? (
            <div className="text-sm text-neutral-600">Đang tải…</div>
          ) : revenue.length === 0 ? (
            <div className="text-sm text-neutral-600">Chưa có dữ liệu.</div>
          ) : (
            <RevenueLineChart data={revenue} height={340} valueFormatter={(v) => VND.format(Number(v))} />
          )}
        </div>
      </div>

      <div className="text-sm text-neutral-600">
        Gợi ý: Dùng bộ lọc 7/30 ngày để so sánh xu hướng doanh thu theo thời gian.
      </div>
    </div>
  );
}
