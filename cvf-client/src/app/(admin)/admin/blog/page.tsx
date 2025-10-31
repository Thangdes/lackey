"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { postService } from "@/service/post.service";
import type { BlogPost } from "@/type/blog";
import { Newspaper, Plus, Pencil, Trash2, Search, RotateCcw } from "lucide-react";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold inline-flex items-center gap-2">
          <Newspaper className="size-6 text-muted-foreground" aria-hidden />
          Blog
        </h1>
        <div className="flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <Input placeholder="Tìm theo tiêu đề hoặc slug..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
          <Button type="button" variant="outline" onClick={load} className="inline-flex items-center gap-2">
            <RotateCcw className="size-4" aria-hidden />
            Làm mới
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trang</span>
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={loading || page <= 1}>Trước</Button>
            <span className="text-sm w-8 text-center">{page}</span>
            <Button type="button" variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={loading || items.length < limit}>Sau</Button>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">Mỗi trang</span>
            <select value={limit} onChange={(e) => { setPage(1); setLimit(Number(e.target.value) || 20); }} className="border rounded px-2 py-1 text-sm">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <Button asChild className="inline-flex items-center gap-2">
            <Link href="/admin/blog/new">
              <Plus className="size-4" aria-hidden />
              Viết bài
            </Link>
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Gợi ý: Nhập tiêu đề rõ ràng, slug sẽ tự tạo. Bài viết ở trạng thái Nháp sẽ không hiển thị công khai.
      </p>

      {loading ? (
        <div className="text-sm text-neutral-600">Đang tải…</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Ảnh</TableHead>
              <TableHead className="break-words">Tiêu đề</TableHead>
              <TableHead className="break-words">Slug</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[160px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p, idx) => (
              <TableRow key={(p.id || p.slug || String(idx)) as string}>
                <TableCell className="relative">
                  <div className="group w-10 h-10 rounded overflow-hidden bg-neutral-100">
                    {p.coverImage ? (
                      <Image src={p.coverImage} alt={p.title || "thumb"} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </div>
                  {p.coverImage && (
                    <div className="pointer-events-none absolute left-12 top-1 hidden group-hover:block">
                      <div className="rounded border bg-white p-1 shadow-xl">
                        <Image src={p.coverImage} alt={p.title || "thumb"} width={160} height={160} className="w-40 h-40 object-cover rounded" unoptimized />
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium break-words max-w-[320px]">{p.title}</TableCell>
                <TableCell className="break-words max-w-[240px]">{p.slug}</TableCell>
                <TableCell>
                  {p.isPublished ? <Badge>Đã đăng</Badge> : <Badge variant="outline">Nháp</Badge>}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button asChild variant="outline" size="sm" className="inline-flex items-center gap-2">
                    <Link href={`/admin/blog/${p.id}`}>
                      <Pencil className="size-4" aria-hidden />
                      Sửa
                    </Link>
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(p.id)} className="inline-flex items-center gap-2">
                    <Trash2 className="size-4" aria-hidden />
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
