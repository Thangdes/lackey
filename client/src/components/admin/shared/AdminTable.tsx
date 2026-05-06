"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTableColumn<T> = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
};

export type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onRetry?: () => void;
  rowKey?: (item: T, index: number) => string | number;
  onRowClick?: (item: T, index: number) => void;
  className?: string;
};

export function AdminTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  emptyIcon,
  onRetry,
  rowKey,
  onRowClick,
  className,
}: AdminTableProps<T>) {
  const getRowKey = (item: T, index: number) => {
    if (rowKey) return rowKey(item, index);
    if (typeof item === "object" && item !== null && "id" in item) {
      return String((item as { id: unknown }).id);
    }
    return index;
  };

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    "font-medium",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                    col.className
                  )}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32">
                  <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    {emptyIcon}
                    <p className="text-sm">{emptyMessage}</p>
                    {onRetry && (
                      <Button variant="outline" size="sm" onClick={onRetry}>
                        <RotateCcw className="size-4" />
                        Thử lại
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={getRowKey(item, index)}
                  onClick={onRowClick ? () => onRowClick(item, index) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right",
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(item, index)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
