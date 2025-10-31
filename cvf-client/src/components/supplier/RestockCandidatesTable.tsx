"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RestockCandidate } from "@/service/supplier-dashboard.service";

export default function RestockCandidatesTable({ items, onRowClick }: { items: RestockCandidate[]; onRowClick?: (q: string) => void }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">Không có đề xuất.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sản phẩm</TableHead>
          <TableHead>Biến thể</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-right">Đã bán 30 ngày</TableHead>
          <TableHead className="text-right">Tồn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((r, idx) => (
          <TableRow
            key={`${r.variantId}-${idx}`}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={() => onRowClick?.(r.sku || r.variantName || r.productName)}
          >
            <TableCell className="font-medium">{r.productName}</TableCell>
            <TableCell>{r.variantName}</TableCell>
            <TableCell>{r.sku}</TableCell>
            <TableCell className="text-right">{r.totalSold30d}</TableCell>
            <TableCell className="text-right">{r.stockQuantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
