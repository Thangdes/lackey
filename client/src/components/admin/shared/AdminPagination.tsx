"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminPaginationProps = {
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  className?: string;
};

export function AdminPagination({ page, limit, total, onPageChange, onLimitChange, className }: AdminPaginationProps) {
  const totalPages = total ? Math.ceil(total / limit) : 0;
  const canGoPrev = page > 1;
  const canGoNext = total ? page < totalPages : false;

  const startItem = total ? (page - 1) * limit + 1 : 0;
  const endItem = total ? Math.min(page * limit, total) : 0;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Hiển thị</span>
        <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
          <SelectTrigger className="h-8 w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        {total !== undefined && (
          <span>
            ({startItem}-{endItem} / {total})
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={!canGoPrev}>
          <ChevronLeft className="size-4" />
          Trước
        </Button>
        <div className="text-sm font-medium px-2">
          Trang {page}
          {totalPages > 0 && ` / ${totalPages}`}
        </div>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={!canGoNext}>
          Sau
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
