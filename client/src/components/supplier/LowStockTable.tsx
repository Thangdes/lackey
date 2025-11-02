"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type LowStockRow = { product: string; name: string; sku: string; stockQuantity?: number };

export default function LowStockTable({ rows, onRowClick }: { rows: LowStockRow[]; onRowClick?: (q: string) => void }) {
  if (!rows || rows.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">Không có cảnh báo.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sản phẩm</TableHead>
          <TableHead>Biến thể</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead className="text-right">Tồn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, idx) => (
          <TableRow
            key={`${r.sku}-${idx}`}
            className={onRowClick ? "cursor-pointer" : undefined}
            onClick={() => onRowClick?.(r.sku || r.name || r.product)}
          >
            <TableCell className="font-medium">{r.product}</TableCell>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.sku}</TableCell>
            <TableCell className="text-right">{r.stockQuantity ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
