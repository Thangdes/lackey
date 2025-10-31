"use client";

import React, { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminRatings, useDeleteRating } from "@/hook/useRatingAdmin";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { buildProductDetailPath } from "@/constant/route";

const PAGE_SIZE = 20;

type AdminRatingItem = {
  id: string;
  productName: string;
  productSlug: string;
  variantName?: string;
  customerName: string;
  orderCode: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function RatingsAdminPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground p-2">Đang tải…</div>}>
      <RatingsAdminClient />
    </Suspense>
  );
}

function RatingsAdminClient() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const { data, isLoading } = useAdminRatings({ page, search: query.trim() || undefined });
  const deleteMutation = useDeleteRating();

  const canGoPrev = useMemo(() => page > 1, [page]);
  const canGoNext = useMemo(() => page * PAGE_SIZE < (data?.total ?? 0), [page, data?.total]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setQuery(e.target.value);
  }, []);

  const handlePrevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setPage((p) => p + 1), []);

  const handleDelete = useCallback(async (id: string) => {
    toast.promise(deleteMutation.mutateAsync(id), {
      loading: "Đang xóa đánh giá…",
      success: "Đã xóa đánh giá",
      error: (e) => (e instanceof Error ? e.message : "Xóa đánh giá thất bại"),
    });
  }, [deleteMutation]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2">
          <Star className="size-5 text-muted-foreground" aria-hidden />
          Đánh giá
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Tìm theo sản phẩm, khách hàng, nội dung" value={query} onChange={handleSearchChange} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Đang tải…</div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Thời gian</th>
                <th className="text-left p-2">Sản phẩm</th>
                <th className="text-left p-2">Biến thể</th>
                <th className="text-left p-2">Khách hàng</th>
                <th className="text-left p-2">Đơn hàng</th>
                <th className="text-left p-2">Sao</th>
                <th className="text-left p-2">Nội dung</th>
                <th className="text-right p-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(data?.items?.length ?? 0) === 0 ? (
                <tr>
                  <td className="p-3 text-center text-muted-foreground" colSpan={8}>Không có đánh giá.</td>
                </tr>
              ) : (
                (data?.items as AdminRatingItem[]).map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2 whitespace-nowrap">{new Date(it.createdAt).toLocaleString()}</td>
                    <td className="p-2 whitespace-nowrap max-w-[240px] truncate">
                      <Link className="hover:underline" href={buildProductDetailPath(it.productSlug || it.productName)}>{it.productName}</Link>
                    </td>
                    <td className="p-2 whitespace-nowrap max-w-[200px] truncate">{it.variantName || "—"}</td>
                    <td className="p-2 whitespace-nowrap max-w-[200px] truncate">{it.customerName || "—"}</td>
                    <td className="p-2 whitespace-nowrap">{it.orderCode}</td>
                    <td className="p-2 whitespace-nowrap">{"★".repeat(Math.max(0, Math.min(5, Math.round(it.rating))))}</td>
                    <td className="p-2 max-w-[360px] truncate" title={it.comment}>{it.comment}</td>
                    <td className="p-2 text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" size="sm" variant="outline" className="inline-flex items-center gap-1">
                            <Trash2 className="size-4" aria-hidden />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể hoàn tác. Đánh giá sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(it.id)}>Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-black/60">Trang {page} · Tổng {data?.total ?? 0}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled={!canGoPrev} onClick={handlePrevPage} className="inline-flex items-center gap-2">
            <ChevronLeft className="size-4" aria-hidden />
            Trước
          </Button>
          <Button type="button" variant="outline" disabled={!canGoNext} onClick={handleNextPage} className="inline-flex items-center gap-2">
            Sau
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
