"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type SimpleVariant = {
  name: string;
  sku: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
};

export type SimpleVariantsTableProps = {
  variants: SimpleVariant[];
  onDelete: (index: number) => void;
  VND: Intl.NumberFormat;
};

export default function SimpleVariantsTable({ variants, onDelete, VND }: SimpleVariantsTableProps) {
  if (variants.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Chưa có biến thể nào. Nhấn &quot;+ Thêm biến thể&quot; để thêm.
      </p>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Tên</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Giá KM</TableHead>
            <TableHead>Kho</TableHead>
            <TableHead className="w-[100px]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((v, i) => (
            <TableRow key={`${v.name}-${i}`}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.sku}</TableCell>
              <TableCell>{VND.format(v.price)}</TableCell>
              <TableCell>{v.discountPrice ? VND.format(v.discountPrice) : "—"}</TableCell>
              <TableCell>{v.stockQuantity}</TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(i)}
                  className="inline-flex items-center gap-1"
                >
                  <Trash2 className="size-4" aria-hidden />
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
