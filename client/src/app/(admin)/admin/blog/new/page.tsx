"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useCreatePost, useUploadPostThumbnail } from "@/hook/usePost";
import slugify from "slugify";
import type { BlogPost } from "@/type/blog";
import { FilePlus2, Save, X } from "lucide-react";

export default function AdminBlogNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const createPost = useCreatePost();
  const uploadThumb = useUploadPostThumbnail();

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    contentHtml: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
  });

  const canSave = useMemo(() => (form.title?.trim() && form.slug?.trim()), [form.title, form.slug]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

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

  

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const created = await createPost.mutateAsync(form);
      if (file) {
        try { await uploadThumb.mutateAsync({ id: String(created.id), file }); } catch {}
      }
      toast.success("Đã tạo bài viết");
      router.push(`/admin/blog`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Không thể tạo bài viết";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }, [canSave, saving, form, file, router, createPost, uploadThumb]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold inline-flex items-center gap-2">
          <FilePlus2 className="size-6 text-muted-foreground" aria-hidden />
          Tạo bài viết
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="inline-flex items-center gap-2">
            <Link href="/admin/blog">
              <X className="size-4" aria-hidden />
              Hủy
            </Link>
          </Button>
          <Button onClick={onSubmit} disabled={!canSave || saving} className="inline-flex items-center gap-2">
            <Save className="size-4" aria-hidden />
            Lưu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tiêu đề</label>
            <Input name="title" value={form.title || ""} onChange={onChange} placeholder="Nhập tiêu đề" />
            <p className="text-xs text-muted-foreground">Slug sẽ tự tạo theo tiêu đề (có thể chỉnh tay nếu cần).</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input name="slug" value={form.slug || ""} onChange={onChange} placeholder="vi-du-bai-viet" />
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
              </div>
              {previewUrl ? (
                <div className="border rounded-md p-2 inline-flex items-center gap-3">
                  <Image src={previewUrl} alt="Xem trước" width={96} height={96} className="h-24 w-24 object-cover rounded" unoptimized />
                  <div className="text-xs text-muted-foreground">Ảnh xem trước (sẽ tải lên sau khi tạo bài viết).</div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Chưa chọn ảnh. Có thể thêm sau ở trang sửa bài.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
