"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { postService } from "@/service/post.service";
import { useUpdatePost, useDeletePost, useUploadPostThumbnail } from "@/hook/usePost";
import type { BlogPost } from "@/type/blog";
import { FileText, Save, Upload, Trash2, ArrowLeft } from "lucide-react";
import slugify from "slugify";

export default function AdminBlogEditPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [resolvedId, setResolvedId] = useState<string>("");
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const uploadThumb = useUploadPostThumbnail();

  const canSave = useMemo(() => (form.title?.trim() && form.slug?.trim()), [form.title, form.slug]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await postService.admin.getById(id);
      setResolvedId(String(data.id));
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        contentHtml: data.contentHtml,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        isPublished: data.isPublished,
        coverImage: data.coverImage,
      });
      setSlugTouched(false);
    } catch {
      toast.error("Không tìm thấy bài viết. Vui lòng mở từ danh sách.");
      router.replace("/admin/blog");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement & HTMLTextAreaElement;
    if (name === "title") {
      const nextTitle = value;
      setForm((prev) => {
        const next: Partial<BlogPost> = { ...prev, title: nextTitle };
        if (!slugTouched) {
          next.slug = slugify(nextTitle || "", { lower: true, strict: true, trim: true, locale: "vi" });
        }
        return next;
      });
      return;
    }
    if (name === "slug") {
      setSlugTouched(true);
      const normalized = slugify(value || "", { lower: true, strict: true, trim: true, locale: "vi" });
      setForm((prev) => ({ ...prev, slug: normalized }));
      return;
    }
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }, [slugTouched]);

  

  const onResetSlug = useCallback(() => {
    const next = slugify((form.title || ""), { lower: true, strict: true, trim: true, locale: "vi" });
    setForm((prev) => ({ ...prev, slug: next }));
    setSlugTouched(true);
  }, [form.title]);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  }, []);

  const onSave = useCallback(async () => {
    if (!canSave || saving) return;
    if (!resolvedId) { toast.error("Thiếu ID bài viết"); return; }
    setSaving(true);
    try {
      await updatePost.mutateAsync({ id: resolvedId, payload: form });
      if (file) {
        try { await uploadThumb.mutateAsync({ id: String(resolvedId), file }); } catch {}
      }
      toast.success("Đã lưu bài viết");
      await load();
    } catch {
      toast.error("Không thể lưu bài viết");
    } finally {
      setSaving(false);
    }
  }, [canSave, saving, resolvedId, form, file, load, updatePost, uploadThumb]);

  const onDelete = useCallback(async () => {
    const targetId = resolvedId || id;
    if (!targetId) { toast.error("Thiếu ID bài viết"); return; }
    if (deleting) return;
    if (!confirm("Xác nhận xóa bài viết?")) return;
    setDeleting(true);
    try {
      await deletePost.mutateAsync(targetId);
      toast.success("Đã xóa bài viết");
      router.push("/admin/blog");
    } catch {
      toast.error("Không thể xóa bài viết");
    } finally {
      setDeleting(false);
    }
  }, [id, resolvedId, deleting, router, deletePost]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold inline-flex items-center gap-2">
          <FileText className="size-6 text-muted-foreground" aria-hidden />
          Sửa bài viết
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="inline-flex items-center gap-2">
            <Link href="/admin/blog">
              <ArrowLeft className="size-4" aria-hidden />
              Quay lại
            </Link>
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={deleting} className="inline-flex items-center gap-2">
            <Trash2 className="size-4" aria-hidden />
            Xóa
          </Button>
          <Button onClick={onSave} disabled={!canSave || saving} className="inline-flex items-center gap-2">
            <Save className="size-4" aria-hidden />
            Lưu
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-600">Đang tải…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input name="title" value={form.title || ""} onChange={onChange} placeholder="Nhập tiêu đề" />
              <p className="text-xs text-muted-foreground">Slug sẽ tự tạo theo tiêu đề (nếu bạn chưa chỉnh tay).</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <div className="flex items-center gap-2">
                <Input name="slug" value={form.slug || ""} onChange={onChange} placeholder="vi-du-bai-viet" />
                <Button type="button" variant="outline" size="sm" onClick={onResetSlug}>Đặt lại</Button>
              </div>
              <p className="text-xs text-muted-foreground">Chỉ gồm chữ thường, số và dấu gạch ngang.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả ngắn</label>
              <textarea name="excerpt" value={form.excerpt || ""} onChange={onChange} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="Tóm tắt nội dung" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nội dung (HTML)</label>
              <textarea name="contentHtml" value={form.contentHtml || ""} onChange={onChange} rows={10} className="w-full rounded-md border px-3 py-2 text-sm font-mono" placeholder="<p>Nội dung...</p>" />
              <p className="text-xs text-muted-foreground">
                Nội dung ở dạng HTML. Bạn có thể soạn thảo tại
                {" "}
                <a href="https://onlinehtmleditor.dev/" target="_blank" rel="noopener noreferrer" className="underline">
                  onlinehtmleditor.dev
                </a>
                {" "}
                rồi xuất HTML và dán vào ô này.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-sm">{form.isPublished ? "Đã đăng" : "Nháp"}</span>
                <Switch checked={Boolean(form.isPublished)} onCheckedChange={(v: boolean) => setForm((prev) => ({ ...prev, isPublished: v }))} />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Title</label>
              <Input name="metaTitle" value={form.metaTitle || ""} onChange={onChange} placeholder="SEO title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SEO Description</label>
              <textarea name="metaDescription" value={form.metaDescription || ""} onChange={onChange} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="SEO description" />
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Ảnh thumbnail</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={onFileChange} />
                  {file && (
                    <Button type="button" variant="ghost" onClick={() => setFile(null)} className="text-xs">Bỏ chọn</Button>
                  )}
                  <Button type="button" disabled={!file} onClick={async () => {
                    if (!file) return;
                    const targetId = resolvedId || id;
                    if (!targetId) { toast.error("Thiếu ID bài viết"); return; }
                    try {
                      await uploadThumb.mutateAsync({ id: String(targetId), file });
                      toast.success("Đã cập nhật ảnh");
                    } catch {
                      toast.error("Không thể tải ảnh");
                    }
                  }} className="inline-flex items-center gap-2" variant="outline">
                    <Upload className="size-4" aria-hidden />
                    Tải ảnh
                  </Button>
                </div>
                {previewUrl ? (
                  <div className="border rounded-md p-2 inline-flex items-center gap-3">
                    <Image src={previewUrl} alt="Xem trước" width={96} height={96} className="h-24 w-24 object-cover rounded" unoptimized />
                    <div className="text-xs text-muted-foreground">Ảnh xem trước (sẽ thay thế khi bạn bấm Tải ảnh).</div>
                  </div>
                ) : form.coverImage ? (
                  <div className="border rounded-md p-2 inline-flex items-center gap-3">
                    <Image src={String(form.coverImage)} alt="Thumbnail hiện tại" width={96} height={96} className="h-24 w-24 object-cover rounded" unoptimized />
                    <div className="text-xs text-muted-foreground">Ảnh hiện tại của bài viết.</div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Chưa có ảnh. Chọn ảnh để tải lên.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
