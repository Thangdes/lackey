"use client";
import React, { useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/admin/StatusBadge";

export type DiscountRow = {
  id: string;
  code: string;
  description?: string | null;
  type: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  value: number | string;
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  minAmount?: number | string | null;
};

export type DiscountTableProps = {
  items: DiscountRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function formatMoneyLike(v: unknown) {
  const n = Number(v);
  if (Number.isNaN(n)) return String(v ?? "");
  return n.toLocaleString("vi-VN");
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}

export function DiscountTable(props: DiscountTableProps) {
  const { items, onEdit, onDelete } = props;

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onEdit(id);
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onDelete(id);
  }, [onDelete]);

  const arr = Array.isArray(items) ? items : [];

  return (
    <Table className="relative">
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow>
          <TableHead>Mã</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Giá trị</TableHead>
          <TableHead>Tối thiểu</TableHead>
          <TableHead>Bắt đầu</TableHead>
          <TableHead>Kết thúc</TableHead>
          <TableHead>Hoạt động</TableHead>
          <TableHead className="max-w-[260px]">Mô tả</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {arr.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
              Chưa có mã giảm giá nào.
            </TableCell>
          </TableRow>
        )}
        {arr.map((d) => {
          const valueText = d.type === "PERCENTAGE" ? `${Number(d.value)}%` : `${formatMoneyLike(d.value)} đ`;
          const minText = d.minAmount ? `${formatMoneyLike(d.minAmount)} đ` : "—";
          return (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.code}</TableCell>
              <TableCell>{d.type === "PERCENTAGE" ? "Phần trăm" : "Cố định"}</TableCell>
              <TableCell>{valueText}</TableCell>
              <TableCell>{minText}</TableCell>
              <TableCell>{formatDate(d.startDate)}</TableCell>
              <TableCell>{formatDate(d.endDate)}</TableCell>
              <TableCell>
                <StatusBadge status={d.isActive ? "success" : "danger"}>
                  {d.isActive ? "Đang hoạt động" : "Tạm tắt"}
                </StatusBadge>
              </TableCell>
              <TableCell className="max-w-[260px] truncate">{d.description || ""}</TableCell>
              <TableCell className="space-x-2">
                <button type="button" className="px-2 py-1 border rounded text-xs" data-id={d.id} onClick={handleEdit}>Sửa</button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button type="button" className="px-2 py-1 border rounded text-xs">Xóa</button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>Không thể hoàn tác. Bạn chắc chắn muốn xóa mã giảm giá này?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction data-id={d.id} onClick={handleDelete}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
