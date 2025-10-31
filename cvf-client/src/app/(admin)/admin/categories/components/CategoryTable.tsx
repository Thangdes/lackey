"use client";
import React, { useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DEFAULT_CATEGORY_IMAGE } from "@/constant/image";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  thumbnailUrl?: string | null;
};

export type CategoryTableProps = {
  items: CategoryRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpload?: (id: string, file: File) => void;
};

export function CategoryTable(props: CategoryTableProps) {
  const { items, onEdit, onDelete, onUpload } = props;

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onEdit(id);
  }, [onEdit]);

  const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onDelete(id);
  }, [onDelete]);

  const handlePickFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUpload) return;
    const id = e.currentTarget.dataset.id as string;
    const file = e.currentTarget.files?.[0];
    if (id && file) onUpload(id, file);
    // reset so selecting same file again still triggers change
    e.currentTarget.value = "";
  }, [onUpload]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ảnh</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.thumbnailUrl || DEFAULT_CATEGORY_IMAGE}
                alt={c.name}
                className="h-10 w-10 rounded object-cover border bg-muted"
                loading="lazy"
              />
            </TableCell>
            <TableCell className="font-medium">{c.name}</TableCell>
            <TableCell>{c.slug}</TableCell>
            <TableCell className="max-w-[420px] truncate">{c.description || ""}</TableCell>
            <TableCell className="space-x-2">
              <button type="button" className="px-2 py-1 border rounded text-xs" data-id={c.id} onClick={handleEdit}>Sửa</button>
              <label className="px-2 py-1 border rounded text-xs cursor-pointer inline-block">
                Ảnh
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  data-id={c.id}
                  onChange={handlePickFile}
                />
              </label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="px-2 py-1 border rounded text-xs">Xóa</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                    <AlertDialogDescription>Không thể hoàn tác. Bạn chắc chắn muốn xóa danh mục này?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction data-id={c.id} onClick={handleDelete}>Xóa</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

