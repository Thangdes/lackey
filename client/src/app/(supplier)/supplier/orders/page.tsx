"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supplierDashboardService, type SupplierOrderListItem } from "@/service/supplier-dashboard.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { statusLabel, statusDescription } from "@/constant/order-status";
import { toast } from "sonner";

export default function SupplierOrdersPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Đang tải...</div>}>
      <SupplierOrdersClient />
    </Suspense>
  );
}

function SupplierOrdersClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SupplierOrderListItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const VND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);

  const statusVariant = (s?: string) => {
    const v = String(s || '').toUpperCase();
    if (v === 'COMPLETED' || v === 'CONFIRMED') return 'success' as const;
    if (v === 'CANCELED') return 'danger' as const;
    if (v === 'PENDING_CONFIRMATION') return 'warning' as const;
    if (v === 'PREPARING_SHIPMENT' || v === 'SHIPPED') return 'info' as const;
    return 'neutral' as const;
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supplierDashboardService.orders({ page, limit, status });
      setItems(res.data || []);
      setTotal(res.meta?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    const s = sp?.get("status");
    const pg = sp?.get("page");
    const lm = sp?.get("limit");
    if (s && s !== "ALL") setStatus(s);
    if (pg) setPage(Math.max(1, Number(pg) || 1));
    if (lm) setLimit(Math.min(100, Math.max(5, Number(lm) || 20)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    if (page !== 1) q.set("page", String(page));
    if (limit !== 20) q.set("limit", String(limit));
    const qs = q.toString();
    router.replace(qs ? `?${qs}` : "?");
  }, [status, page, limit, router]);

  useEffect(() => { load(); }, [load]);

  const totalPages = useMemo(() => (total && limit ? Math.max(1, Math.ceil(total / limit)) : 1), [total, limit]);

  const filteredItems = useMemo(() => {
    const start = dateFrom ? new Date(dateFrom).getTime() : undefined;
    const end = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1 : undefined;
    if (!start && !end) return items;
    return items.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      if (start && t < start) return false;
      if (end && t > end) return false;
      return true;
    });
  }, [items, dateFrom, dateTo]);

  const copy = async (text?: string, label?: string) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      toast.success(label ? `Đã copy ${label}` : "Đã copy");
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Đơn hàng của tôi</h1>
          <span className="inline-flex items-center h-6 rounded-full bg-neutral-100 px-2 border text-xs text-neutral-600">{filteredItems.length} / {total}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select value={status ?? "ALL"} onValueChange={(v) => setStatus(v === "ALL" ? undefined : v)}>
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING_CONFIRMATION">Chờ xác nhận</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="PREPARING_SHIPMENT">Chuẩn bị giao</SelectItem>
              <SelectItem value="SHIPPED">Đã gửi</SelectItem>
              <SelectItem value="COMPLETED">Hoàn tất</SelectItem>
              <SelectItem value="CANCELED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-[150px]" aria-label="Từ ngày" />
            <span className="text-neutral-500 text-sm">→</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-[150px]" aria-label="Đến ngày" />
            {(dateFrom || dateTo) && (
              <Button variant="outline" onClick={() => { setDateFrom(""); setDateTo(""); }}>Xóa ngày</Button>
            )}
          </div>
          <Button variant="outline" onClick={() => { setStatus(undefined); setPage(1); }}>Xóa lọc</Button>
          <div className="hidden md:flex items-center gap-1">
            <Button size="sm" variant={status === "CONFIRMED" ? "default" : "outline"} onClick={() => { setStatus("CONFIRMED"); setPage(1); }}>Đã xác nhận</Button>
            <Button size="sm" variant={status === "PREPARING_SHIPMENT" ? "default" : "outline"} onClick={() => { setStatus("PREPARING_SHIPMENT"); setPage(1); }}>Chuẩn bị giao</Button>
            <Button size="sm" variant={status === "SHIPPED" ? "default" : "outline"} onClick={() => { setStatus("SHIPPED"); setPage(1); }}>Đã gửi</Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-white">
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="text-neutral-500">Mã đơn</TableHead>
              <TableHead className="text-neutral-500">Ngày tạo</TableHead>
              <TableHead className="text-center text-neutral-500">Trạng thái</TableHead>
              <TableHead className="text-right text-neutral-500">SL của NCC</TableHead>
              <TableHead className="text-right text-neutral-500">Doanh thu NCC</TableHead>
              <TableHead></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Đang tải…</TableCell>
              </TableRow>
              )}
              {!loading && filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Không có đơn hàng.</TableCell>
              </TableRow>
              )}
              {!loading && filteredItems.map((o, idx) => (
              <TableRow key={o.id} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50 hover:bg-neutral-100"}>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-2">
                    <span>{o.orderCode}</span>
                    <Button type="button" size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => copy(o.orderCode, 'mã đơn')}>Copy</Button>
                  </span>
                </TableCell>
                <TableCell className="text-neutral-700">{new Date(o.createdAt).toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={statusVariant(o.status)} title={statusDescription(o.status)}>
                    {statusLabel(o.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-right">{o.supplierItemCount}</TableCell>
                <TableCell className="text-right font-medium text-rose-700">{VND.format(Number(o.supplierRevenue || 0))}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/supplier/orders/${o.id}`} className="text-sm underline">Chi tiết</Link>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Tổng: {total}</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Trang trước</Button>
          <Input readOnly value={`${page} / ${totalPages}`} className="w-24 text-center h-8" />
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Trang sau</Button>
          <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
            <SelectTrigger className="w-28 h-8"><SelectValue placeholder="Số dòng" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / trang</SelectItem>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
