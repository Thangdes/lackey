"use client";
import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TopSellingProduct } from "@/service/supplier-dashboard.service";

export default function TopSellingTable({ items }: { items: TopSellingProduct[] }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">Chưa có dữ liệu.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[56px]">Ảnh</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Biến thể</TableHead>
          <TableHead className="text-right">SL bán</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p, idx) => (
          <TableRow key={`${p.productName}-${p.variantName}-${idx}`}>
            <TableCell>
              {p.thumbnailUrl ? (
                <Image src={p.thumbnailUrl} alt={p.productName} width={40} height={40} className="rounded object-cover" unoptimized />
              ) : (
                <div className="w-10 h-10 bg-neutral-200 rounded" />
              )}
            </TableCell>
            <TableCell className="font-medium">{p.productName}</TableCell>
            <TableCell>{p.variantName}</TableCell>
            <TableCell className="text-right">{p.totalSold}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
