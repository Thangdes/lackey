"use client";

import React, { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useAdminRatings, useDeleteRating } from "@/hook/useRatingAdmin";
import { buildProductDetailPath } from "@/constant/route";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/shared/AdminSearchBar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/shared/AdminTable";
import { AdminActionButtons } from "@/components/admin/shared/AdminActionButtons";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";

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

  const handleSearchChange = useCallback((value: string) => {
    setPage(1);
    setQuery(value);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    toast.promise(deleteMutation.mutateAsync(id), {
      loading: "Đang xóa đánh giá…",
      success: "Đã xóa đánh giá",
      error: (e) => (e instanceof Error ? e.message : "Xóa đánh giá thất bại"),
    });
  }, [deleteMutation]);

  const columns: AdminTableColumn<AdminRatingItem>[] = useMemo(() => [
    {
      key: "createdAt",
      label: "Thời gian",
      width: "140px",
      render: (item) => new Date(item.createdAt).toLocaleString("vi-VN"),
    },
    {
      key: "productName",
      label: "Sản phẩm",
      render: (item) => (
        <Link href={buildProductDetailPath(item.productSlug)} className="hover:underline text-primary">
          {item.productName}
        </Link>
      ),
    },
    {
      key: "variantName",
      label: "Biến thể",
      width: "120px",
      render: (item) => item.variantName || "—",
    },
    {
      key: "customerName",
      label: "Khách hàng",
      width: "140px",
    },
    {
      key: "orderCode",
      label: "Đơn hàng",
      width: "120px",
    },
    {
      key: "rating",
      label: "Sao",
      width: "80px",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{item.rating}</span>
        </div>
      ),
    },
    {
      key: "comment",
      label: "Nội dung",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.comment}>
          {item.comment || "—"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      width: "80px",
      align: "right",
      render: (item) => (
        <AdminActionButtons
          onDelete={() => handleDelete(item.id)}
          deleteDescription="Bạn có chắc chắn muốn xóa đánh giá này?"
        />
      ),
    },
  ], [handleDelete]);

  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader
        icon={Star}
        title="Đánh giá"
        description="Quản lý đánh giá sản phẩm từ khách hàng"
        actions={
          <AdminSearchBar
            value={query}
            onChange={handleSearchChange}
            placeholder="Tìm theo sản phẩm, khách hàng, nội dung"
            className="max-w-md"
          />
        }
      />

      <AdminTable
        columns={columns}
        data={(data?.items as AdminRatingItem[]) || []}
        loading={isLoading}
        emptyMessage="Chưa có đánh giá nào"
        emptyIcon={<Star className="size-12 text-muted-foreground/30" />}
      />

      <AdminPagination
        page={page}
        limit={PAGE_SIZE}
        total={data?.total}
        onPageChange={setPage}
        onLimitChange={() => {}}
      />
    </div>
  );
}
