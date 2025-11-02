"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { statusLabel, statusDescription } from "@/constant/order-status";
import type { SupplierRecentOrder } from "@/service/supplier-dashboard.service";

export default function RecentOrdersTable({ items, onRowClick }: { items: SupplierRecentOrder[]; onRowClick?: (id: string) => void }) {
  const VND = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
  if (!items || items.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">Chưa có dữ liệu.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-center">Trạng thái</TableHead>
          <TableHead className="text-right">SL của NCC</TableHead>
          <TableHead className="text-right">Doanh thu của bạn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((o) => (
          <TableRow
            key={o.id}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={() => onRowClick?.(o.id)}
          >
            <TableCell className="font-medium">{o.orderCode}</TableCell>
            <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
            <TableCell className="text-center">
              <StatusBadge status={(String(o.status||'').toUpperCase()==='COMPLETED'||String(o.status||'').toUpperCase()==='CONFIRMED')?'success':(String(o.status||'').toUpperCase()==='CANCELED'?'danger':(String(o.status||'').toUpperCase()==='PENDING_CONFIRMATION'?'warning':(String(o.status||'').toUpperCase()==='PREPARING_SHIPMENT'||String(o.status||'').toUpperCase()==='SHIPPED'?'info':'neutral')))} title={statusDescription(o.status)}>
                {statusLabel(o.status)}
              </StatusBadge>
            </TableCell>
            <TableCell className="text-right">{Number(o.supplierItemCount ?? 0)}</TableCell>
            <TableCell className="text-right text-rose-700 font-medium">{VND.format(Number((o.supplierRevenue as number | string | undefined) ?? o.totalAmount ?? 0))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
