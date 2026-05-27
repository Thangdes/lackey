"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ADMIN_UPDATABLE_STATUSES, statusDescription, statusLabel } from "@/constant/order-status";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useUpdateDeliveryCode, useUpdateOrderStatus } from "@/hook/useOrder";
import type { OrderSummary } from "@/type/order";
import { formatDate, formatVND } from "@/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
 

export type OrderRowProps = {
  order: OrderSummary;
  selected: boolean;
  onToggle: (on: boolean) => void;
};

export default function OrderRow(props: OrderRowProps) {
  const { order, selected, onToggle } = props;
  const [newStatus, setNewStatus] = useState(order.status);
  const [deliveryCode, setDeliveryCode] = useState<string>(() => {
    const r = order as unknown as Record<string, unknown>;
    const v = r && typeof r.deliveryCode === "string" ? (r.deliveryCode as string) : undefined;
    return v ?? "";
  });

  useEffect(() => {
    setNewStatus(order.status);
  }, [order.status]);

  const updateStatus = useUpdateOrderStatus(order.id);
  const updateCode = useUpdateDeliveryCode(order.id);
  const statusUpper = String(order.status || "").toUpperCase();
  const [openConfirm, setOpenConfirm] = useState(false);

  const paymentMethod: string | undefined = useMemo(() => {
    const r = order as unknown as { paymentMethod?: string; payment?: { method?: string } ; method?: string };
    return r?.paymentMethod || r?.payment?.method || r?.method || undefined;
  }, [order]);
  const eta: string | undefined = useMemo(() => {
    const r = order as unknown as Record<string, unknown>;
    const fields = ["estimatedDelivery", "deliveryEstimate"] as const;
    for (const k of fields) {
      const v = r?.[k];
      if (typeof v === "string") return v;
    }
    return typeof (order as { estimatedDelivery?: string })?.estimatedDelivery === "string"
      ? (order as { estimatedDelivery?: string }).estimatedDelivery
      : typeof (order as { deliveryEstimate?: string })?.deliveryEstimate === "string"
      ? (order as { deliveryEstimate?: string }).deliveryEstimate
      : undefined;
  }, [order]);

  const handleToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.target.checked);
  }, [onToggle]);

  const handleStatusChange = useCallback((v: string) => {
    setNewStatus(v);
  }, []);

  const handleSaveStatus = useCallback(() => {
    updateStatus.mutate({ status: newStatus });
  }, [newStatus, updateStatus]);

  const handleDeliveryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryCode(e.target.value);
  }, []);

  const performSaveDelivery = useCallback(async () => {
    try {
      const allowed = statusUpper === "CONFIRMED" || statusUpper === "PREPARING_SHIPMENT";
      if (!allowed) {
        try {
          await updateStatus.mutateAsync({ status: "PREPARING_SHIPMENT" });
        } catch {
          await updateStatus.mutateAsync({ status: "CONFIRMED" });
        }
      }

      const code = String(deliveryCode || "").trim();
      if (!code) return;
      const updated = await updateCode.mutateAsync(code);
      const nextStatus = String((updated as unknown as { status?: string })?.status || "").toUpperCase();
      if (code && nextStatus === "SHIPPED") {
        setNewStatus("SHIPPED");
        toast.success("Đã cập nhật mã vận chuyển • Trạng thái: Đã bàn giao vận chuyển");
      } else {
        toast.success("Đã cập nhật mã vận chuyển");
      }
      setOpenConfirm(false);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err ?? "");
      let msg = "Cập nhật mã vận chuyển thất bại";
      const lower = raw.toLowerCase();
      if (lower.includes("unique constraint") || lower.includes("delivery_code") || lower.includes("p2002")) {
        msg = "Mã vận chuyển đã tồn tại. Vui lòng dùng mã khác.";
      } else if (lower.includes("must be in confirmed") || lower.includes("preparing_shipment")) {
        msg = "Chỉ có thể nhập mã khi đơn ở trạng thái Đã xác nhận/Chuẩn bị giao.";
      } else if (!raw && updateCode.isError) {
        msg = "Không thể cập nhật mã vận chuyển. Vui lòng thử lại.";
      } else if (raw) {
        msg = raw;
      }
      toast.error(msg);
    }
  }, [deliveryCode, statusUpper, updateCode, updateStatus]);

  const copyToClipboard = useCallback(async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (label) toast.success(`Đã copy ${label}`);
      else toast.success("Đã copy");
    } catch {}
  }, []);

  const deliveryCodeText = useMemo(() => {
    const dc = (order as unknown as { deliveryCode?: string | null })?.deliveryCode;
    return typeof dc === "string" && dc.trim() ? dc.trim() : undefined;
  }, [order]);
  const notesText = useMemo(() => {
    const n = (order as unknown as { notes?: string | null })?.notes;
    return typeof n === "string" && n.trim() ? n.trim() : undefined;
  }, [order]);
  const discountAmount = useMemo(() => {
    const v = (order as unknown as { discountAmount?: number })?.discountAmount;
    return typeof v === "number" && isFinite(v) ? v : 0;
  }, [order]);

  return (
    <tr className="border-t border-black/10">
      <td className="p-3 align-top"><input type="checkbox" checked={selected} onChange={handleToggle} /></td>
      <td className="p-3 align-top">
        <div className="font-medium truncate flex items-center gap-2">
          <span className="truncate">{order.orderCode || (order as unknown as { code?: string }).code || order.id}</span>
          <Button type="button" variant="outline" size="sm" className="h-6 px-2 text-[11px]" onClick={() => copyToClipboard(order.orderCode || (order as unknown as { code?: string }).code || order.id, "mã đơn")}>
            Copy
          </Button>
        </div>
        <div className="text-xs text-black/60">{formatDate(order.createdAt)}</div>
        {deliveryCodeText && (
          <div className="text-[11px] text-black/60 mt-0.5">Mã vận chuyển: <span className="font-medium">{deliveryCodeText}</span></div>
        )}
        {notesText && (
          <div className="text-[11px] text-black/60 mt-0.5 truncate" title={notesText}>Ghi chú: <span className="font-medium">{notesText}</span></div>
        )}
        {(paymentMethod || eta) && (
          <div className="text-[11px] text-black/50 mt-0.5">
            {paymentMethod && <span>Thanh toán: {paymentMethod}</span>}
            {paymentMethod && eta && <span> • </span>}
            {eta && <span>Dự kiến giao: {formatDate(eta)}</span>}
          </div>
        )}
      </td>
      <td className="p-3 align-top">
        {(() => {
          const raw = String(paymentMethod || '').toUpperCase();
          const isVietQR = raw.includes('VIETQR');
          const isCOD = raw.includes('COD');
          const type = isVietQR ? 'QR' : (isCOD ? 'COD' : (raw || '-'));
          const cls = isVietQR
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : (isCOD ? 'text-slate-700 bg-slate-50 border-slate-200' : 'text-slate-700 bg-slate-50 border-slate-200');
          return (
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{type}</span>
          );
        })()}
      </td>
      <td className="p-3 align-top">
        {(() => {
          const anyOrder = order as unknown as { isGuest?: boolean; userId?: string | null };
          const isGuest = typeof anyOrder?.isGuest === 'boolean' ? anyOrder.isGuest : !anyOrder?.userId;
          const label = isGuest ? 'Guest' : 'User';
          const cls = isGuest
            ? 'text-amber-700 bg-amber-50 border-amber-200'
            : 'text-indigo-700 bg-indigo-50 border-indigo-200';
          return (
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
          );
        })()}
      </td>
      <td className="p-3 align-top">
        {(() => {
          const s = String(newStatus || "").toUpperCase();
          const variant =
            s === "COMPLETED" || s === "CONFIRMED" ? "success" :
            s === "CANCELED" ? "danger" :
            s === "PENDING_CONFIRMATION" ? "warning" :
            s === "PREPARING_SHIPMENT" || s === "SHIPPED" ? "info" :
            "neutral";
          return (
            <StatusBadge status={variant} title={statusDescription(newStatus)}>
              {statusLabel(newStatus)}
            </StatusBadge>
          );
        })()}
      </td>
      <td className="p-3 align-top text-right font-medium">
        <div className="text-rose-700">{formatVND(order.totalAmount ?? (order as unknown as { total?: number }).total ?? 0)}</div>
        {discountAmount > 0 && (
          <div className="text-[11px] text-rose-600">- {formatVND(discountAmount)}</div>
        )}
      </td>
      <td className="p-3 align-top">
        <div className="flex gap-2 items-center">
          <Select value={newStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="min-w-[220px]" title={statusDescription(newStatus || order.status)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_UPDATABLE_STATUSES.map((s) => (<SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button type="button" size="sm" className="text-xs" disabled={updateStatus.isPending || newStatus === order.status} onClick={handleSaveStatus}>
            {updateStatus.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </td>
      <td className="p-3 align-top">
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <input className="rounded border px-2 py-1 text-xs" placeholder="Nhập mã vận chuyển" value={deliveryCode} onChange={handleDeliveryChange} />
            <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
              <AlertDialogTrigger asChild>
                <Button type="button" size="sm" variant="outline" className="text-xs" disabled={updateCode.isPending || !deliveryCode}>
                  {updateCode.isPending ? "Đang lưu..." : "Cập nhật"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận cập nhật mã vận chuyển</AlertDialogTitle>
                  <AlertDialogDescription>Hành động này sẽ lưu mã vận chuyển vào hệ thống.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={performSaveDelivery}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          { typeof (order as unknown as Record<string, unknown>)?.deliveryCode === "string" ? (
            <div className="text-[11px] text-black/50 flex items-center gap-2">
              <span>Mã hiện tại: {String((order as unknown as { deliveryCode?: string }).deliveryCode)}</span>
              <Button type="button" variant="ghost" size="sm" className="h-5 px-1 text-[11px]" onClick={() => copyToClipboard(String((order as unknown as { deliveryCode?: string }).deliveryCode), "mã vận chuyển")}>Copy</Button>
            </div>
          ) : null }
        </div>
      </td>
      <td className="p-3 align-top text-right">
        <Link href={`/admin/orders/${order.id}`} className="text-xs rounded-full border px-3 py-1.5 hover:bg-black/5">Xem</Link>
      </td>
    </tr>
  );
}
