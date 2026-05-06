"use client";
import React from "react";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminActionButtonsProps = {
  onEdit?: () => void;
  onDelete?: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
};

export function AdminActionButtons({
  onEdit,
  onDelete,
  deleteTitle = "Xác nhận xóa",
  deleteDescription = "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.",
  editLabel = "Sửa",
  deleteLabel = "Xóa",
  className,
}: AdminActionButtonsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-4" />
          <span className="sr-only md:not-sr-only">{editLabel}</span>
        </Button>
      )}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Trash2 className="size-4 text-destructive" />
              <span className="sr-only md:not-sr-only">{deleteLabel}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteTitle}</AlertDialogTitle>
              <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} className="bg-destructive text-white hover:bg-destructive/90">
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
