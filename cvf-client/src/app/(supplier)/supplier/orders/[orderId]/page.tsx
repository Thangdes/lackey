"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supplierDashboardService, type SupplierOrderDetail } from "@/service/supplier-dashboard.service";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { statusLabel, statusDescription } from "@/constant/order-status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SupplierOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params?.orderId) ? params?.orderId[0] : (params?.orderId as string);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SupplierOrderDetail | null>(null);

  const VND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const detail = await supplierDashboardService.orderById(orderId);
        if (!cancelled) setData(detail);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [orderId]);

  const supplierRevenue = useMemo(() => {
    if (!data) return 0;
    return (data.orderItems || []).reduce((sum, it) => sum + Number(it.priceAtPurchase || 0) * (it.quantity || 0), 0);
  }, [data]);

  const copy = async (text?: string, label?: string) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      if (label) toast.success(`Đã copy ${label}`);
      else toast.success("Đã copy");
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="text-xl font-semibold">Đơn hàng {data?.orderCode || orderId}</div>
          <div className="text-sm text-muted-foreground">Tạo lúc: {data ? new Date(data.createdAt).toLocaleString() : "—"}</div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={(String(data?.status||'').toUpperCase() === 'COMPLETED' || String(data?.status||'').toUpperCase() === 'CONFIRMED') ? 'success' : (String(data?.status||'').toUpperCase() === 'CANCELED' ? 'danger' : (String(data?.status||'').toUpperCase() === 'PENDING_CONFIRMATION' ? 'warning' : (String(data?.status||'').toUpperCase() === 'PREPARING_SHIPMENT' || String(data?.status||'').toUpperCase() === 'SHIPPED' ? 'info' : 'neutral')))} title={statusDescription(data?.status)}>
            {statusLabel(data?.status)}
          </StatusBadge>
          {data?.orderCode && (
            <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => copy(data?.orderCode, 'mã đơn')}>
              Copy mã đơn
            </Button>
          )}
          {(() => {
            const dc = (data as unknown as { deliveryCode?: unknown })?.deliveryCode;
            return typeof dc === 'string' && dc;
          })() && (
            <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => copy(String((data as unknown as { deliveryCode?: string })?.deliveryCode), 'mã vận chuyển')}>
              Copy mã vận chuyển
            </Button>
          )}
          <Button variant="outline" onClick={() => router.push("/supplier/orders")}>Quay lại</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-md border overflow-hidden">
            <div className="px-4 py-2 border-b font-medium">Sản phẩm của bạn trong đơn</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]">Ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Biến thể</TableHead>
                  <TableHead className="text-right">SL</TableHead>
                  <TableHead className="text-right">Đơn giá</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Đang tải…</TableCell></TableRow>
                )}
                {!loading && (data?.orderItems?.length || 0) === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Không có mục hàng.</TableCell></TableRow>
                )}
                {!loading && (data?.orderItems || []).map((it, idx) => {
                  const name = it.productVariant?.product?.name || "Sản phẩm";
                  const variantName = it.productVariant?.name || it.productVariant?.sku || "Biến thể";
                  const thumb = it.productVariant?.product?.thumbnailUrl || undefined;
                  const price = Number(it.priceAtPurchase || 0);
                  const quantity = Number(it.quantity || 0);
                  return (
                    <TableRow key={`${idx}-${variantName}`}>
                      <TableCell>
                        {thumb ? (
                          <Image src={thumb} alt={name} width={40} height={40} className="rounded object-cover" unoptimized />
                        ) : (
                          <div className="w-10 h-10 bg-neutral-200 rounded" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{variantName}</TableCell>
                      <TableCell className="text-right">{quantity}</TableCell>
                      <TableCell className="text-right text-rose-700 font-medium">{VND.format(price)}</TableCell>
                      <TableCell className="text-right text-rose-700 font-semibold">{VND.format(price * quantity)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Doanh thu của bạn trong đơn</div>
            <div className="text-xl font-semibold mt-1 text-rose-700">{VND.format(Number(supplierRevenue || 0))}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Địa chỉ giao</div>
            <div className="text-sm mt-1">
              {data?.shippingAddress ? (
                <>
                  <div>Phường/Xã: {data.shippingAddress.ward}</div>
                  <div>Quận/Huyện: {data.shippingAddress.district}</div>
                  <div>Tỉnh/TP: {data.shippingAddress.city}</div>
                </>
              ) : (
                <div>—</div>
              )}
            </div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">Thanh toán</div>
            <div className="space-y-1 mt-1 text-sm">
              {(data?.payments || []).map((p, idx) => {
                const st = String(p.status || '').toUpperCase();
                const variant = st === 'SUCCESS' ? 'success' : st === 'PENDING' ? 'info' : 'danger';
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span>{p.method}</span>
                    <StatusBadge status={variant}>{st}</StatusBadge>
                  </div>
                );
              })}
              {(data?.payments || []).length === 0 && <div>—</div>}
            </div>
          </div>
          {data?.notes && (
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">Ghi chú</div>
              <div className="mt-1 text-sm whitespace-pre-wrap">{data.notes}</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Link href="/supplier/orders" className="text-sm underline">Quay lại danh sách</Link>
      </div>
    </div>
  );
}
