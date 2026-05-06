"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { postService } from "@/service/post.service";
import type { BlogPost } from "@/type/blog";
import { Newspaper, Plus, RotateCcw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/shared/AdminSearchBar";
import { AdminTable, type AdminTableColumn } from "@/components/admin/shared/AdminTable";
import { AdminActionButtons } from "@/components/admin/shared/AdminActionButtons";
import { AdminPagination } from "@/components/admin/shared/AdminPagination";

export default function AdminBlogListPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground p-2">Đang tải…</div>}>
      <AdminBlogListClient />
    </Suspense>
  );
}

function AdminBlogListClient() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await postService.admin.list({ page, limit });
      setItems(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không thể tải danh sách bài viết";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => (p.title || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q));
  }, [items, query]);

  const onDelete = useCallback(async (id: string | number) => {
    const s = String(id || "").trim();
    if (!s) {
      toast.error("Thiếu ID bài viết");
      return;
    }
    try {
      await postService.admin.delete(s);
      toast.success("Đã xóa bài viết");
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không thể xóa bài viết";
      toast.error(msg);
    }
  }, [load]);

  const columns: AdminTableColumn<BlogPost>[] = useMemo(() => [
    {
      key: "thumbnail",
      label: "Ảnh",
      width: "80px",
      render: (item) => (
        <Image
          src={item.thumbnailUrl || "/placeholder.png"}
          alt={item.title || ""}
          width={60}
          height={40}
          className="rounded object-cover"
        />
      ),
    },
    {
      key: "title",
      label: "Tiêu đề",
      render: (item) => (
        <div className="space-y-1">
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">/{item.slug}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "120px",
      render: (item) => (
        <Badge variant={item.published ? "default" : "secondary"}>
          {item.published ? "Đã xuất bản" : "Nháp"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      width: "140px",
      render: (item) => new Date(item.createdAt || "").toLocaleDateString("vi-VN"),
    },
    {
      key: "actions",
      label: "",
      width: "120px",
      align: "right",
      render: (item) => (
        <AdminActionButtons
          onEdit={() => window.location.href = `/admin/blog/${item.id}/edit`}
          onDelete={() => onDelete(item.id)}
          deleteDescription="Bạn có chắc chắn muốn xóa bài viết này?"
        />
      ),
    },
  ], [onDelete]);

  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader
        icon={Newspaper}
        title="Blog"
        description="Quản lý bài viết blog"
        actions={
          <>
            <AdminSearchBar
              value={query}
              onChange={setQuery}
              placeholder="Tìm theo tiêu đề hoặc slug..."
            />
            <Button type="button" variant="outline" onClick={load}>
              <RotateCcw className="size-4" />
              Làm mới
            </Button>
            <Button asChild>
              <Link href="/admin/blog/create">
                <Plus className="size-4" />
                Thêm bài viết
              </Link>
            </Button>
          </>
        }
      />

      <AdminTable
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="Chưa có bài viết nào"
        emptyIcon={<Newspaper className="size-12 text-muted-foreground/30" />}
        onRetry={load}
      />

      <AdminPagination
        page={page}
        limit={limit}
        total={items.length}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </div>
  );
}
