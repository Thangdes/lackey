"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type ProductsBulkActionsProps = {
  selectedCount: number;
  onBulkShow: () => void;
  onBulkHide: () => void;
  onBulkDelete: () => void;
};

export default function ProductsBulkActions({
  selectedCount,
  onBulkShow,
  onBulkHide,
  onBulkDelete,
}: ProductsBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/40">
      <div className="text-sm">
        Đã chọn {selectedCount} sản phẩm trên trang này
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={onBulkShow}>
          Hiển thị
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onBulkHide}>
          Ẩn
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onBulkDelete}
          className="inline-flex items-center gap-2"
        >
          <Trash2 className="size-4" aria-hidden /> Xóa đã chọn
        </Button>
      </div>
    </div>
  );
}
