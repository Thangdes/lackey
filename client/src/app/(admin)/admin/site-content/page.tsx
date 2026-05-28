"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { siteContentAdminService, type ContentType, type SiteContentAdminItem, type CreateSiteContentPayload, type UpdateSiteContentPayload } from "@/service/site-content-admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageIcon, Quote, Image as ImageLucide, Plus, RefreshCw, Save, Trash2, UploadCloud } from "lucide-react";

const TYPES: ContentType[] = ["BANNER", "TESTIMONIAL", "GALLERY"];

export default function SiteContentAdminPage() {
  const [type, setType] = useState<ContentType>("BANNER");
  const [items, setItems] = useState<SiteContentAdminItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await siteContentAdminService.list(type);
      setItems(data || []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Tải danh sách thất bại";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold inline-flex items-center gap-2">
          {type === "BANNER" ? <ImageLucide className="size-5 text-muted-foreground" /> : <Quote className="size-5 text-muted-foreground" />}
          Quản lý Site Content
        </h1>
        <div className="flex items-center gap-2">
          <div className="inline-flex border rounded overflow-hidden">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={["px-3 py-1.5 text-sm", type === t ? "bg-foreground text-background" : "bg-background text-foreground"].join(" ")}
              >
                {t === "BANNER" ? "Banner" : t === "TESTIMONIAL" ? "Testimonial" : "Gallery"}
              </button>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={fetchList} className="inline-flex items-center gap-2">
            <RefreshCw className="size-4" /> Tải lại
          </Button>
        </div>
      </div>

      <CreateForm type={type} onCreated={fetchList} />

      <div className="border rounded-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-2 w-[120px]">Loại</th>
              <th className="text-left p-2">Tiêu đề</th>
              {type === "TESTIMONIAL" && <th className="text-left p-2">Tác giả</th>}
              {type === "TESTIMONIAL" && <th className="text-left p-2">Vai trò</th>}
              <th className="text-left p-2">Thumbnail</th>
              <th className="text-left p-2 w-[120px]">Thứ tự</th>
              <th className="text-left p-2 w-[120px]">Hiển thị</th>
              <th className="text-right p-2 w-[180px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3 text-muted-foreground" colSpan={type === "TESTIMONIAL" ? 8 : 6}>Đang tải…</td></tr>
            ) : (items.length === 0 ? (
              <tr><td className="p-3 text-muted-foreground" colSpan={type === "TESTIMONIAL" ? 8 : 6}>Chưa có nội dung.</td></tr>
            ) : items.map((it, index) => (
              <EditableRow
                key={it.id}
                item={it}
                index={index}
                onSaved={fetchList}
                onDeleted={fetchList}
              />
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateForm({ type, onCreated }: { type: ContentType; onCreated?: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<string>("0");
  const [isPublished, setIsPublished] = useState<boolean>(true);

  const [linkUrl, setLinkUrl] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (type === "TESTIMONIAL" && !authorName.trim()) return false; 
    return true;
  }, [title, type, authorName]);

  const reset = () => {
    setTitle("");
    setThumbnailUrl("");
    setDisplayOrder("0");
    setIsPublished(true);
    setLinkUrl("");
    setContent("");
    setAuthorName("");
    setAuthorTitle("");
  };

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload: CreateSiteContentPayload = {
        type,
        title: title.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        displayOrder: Number.isFinite(Number(displayOrder)) ? Number(displayOrder) : 0,
        isPublished,
      };
      if (type === "BANNER") {
        
        payload.linkUrl = linkUrl.trim() || undefined;
      } else {
        payload.content = content.trim() || undefined;
        payload.authorName = authorName.trim();
        payload.authorTitle = authorTitle.trim() || undefined;
      }
      await siteContentAdminService.create(payload);
      toast.success("Đã tạo nội dung");
      reset();
      onCreated?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Tạo nội dung thất bại";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, type, title, thumbnailUrl, displayOrder, isPublished, linkUrl, content, authorName, authorTitle, onCreated]);

  return (
    <div className="border rounded-md p-3 space-y-3">
      <div className="text-sm font-medium inline-flex items-center gap-2">
        <Plus className="size-4" /> Thêm {type === "BANNER" ? "Banner" : "Testimonial"}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-2">
          <label className="text-sm">Tiêu đề</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === "BANNER" ? "VD: Banner khuyến mãi" : "VD: Trải nghiệm tuyệt vời"} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Thumbnail URL</label>
          <div className="flex gap-2">
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://…" />
            <span className="inline-flex items-center text-muted-foreground"><ImageIcon className="size-4" /></span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm">Thứ tự hiển thị</label>
          <Input value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} type="number" min={0} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Trạng thái</label>
          <div className="flex items-center gap-2 text-sm">
            <input id="pub" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            <label htmlFor="pub">Công khai</label>
          </div>
        </div>

        {type === "BANNER" && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm">Link URL (tùy chọn)</label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://… hoặc /products" />
          </div>
        )}

        {type === "TESTIMONIAL" && (
          <>
            <div className="space-y-2 md:col-span-3">
              <label className="text-sm">Nội dung (tùy chọn)</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="Cảm nhận của khách hàng" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Tên tác giả</label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="VD: Nguyễn A" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Vai trò (tùy chọn)</label>
              <Input value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} placeholder="VD: Khách hàng thân thiết" />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit} disabled={!canSubmit || submitting}>
          {submitting ? "Đang lưu…" : "Thêm"}
        </Button>
      </div>
    </div>
  );
}

function EditableRow({
  item,
  index,
  onSaved,
  onDeleted,
}: {
  item: SiteContentAdminItem;
  index: number;
  onSaved?: () => void;
  onDeleted?: () => void;
}) {
  const [title, setTitle] = useState(item.title || "");
  const [authorName, setAuthorName] = useState(item.authorName || "");
  const [authorTitle, setAuthorTitle] = useState(item.authorTitle || "");
  const [isPublished, setIsPublished] = useState<boolean>(!!item.isPublished);
  const [displayOrder, setDisplayOrder] = useState<number>(item.displayOrder ?? index);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const payload: UpdateSiteContentPayload = {
        title: title.trim(),
        authorName: item.type === "TESTIMONIAL" ? authorName.trim() || undefined : undefined,
        authorTitle: item.type === "TESTIMONIAL" ? authorTitle.trim() || undefined : undefined,
        isPublished,
        displayOrder,
      };
      await siteContentAdminService.update(item.id, payload);
      toast.success("Đã lưu");
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  }, [title, authorName, authorTitle, isPublished, displayOrder, item.id, item.type, onSaved]);

  const del = useCallback(async () => {
    try {
      await siteContentAdminService.remove(item.id);
      toast.success("Đã xóa");
      onDeleted?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Xóa thất bại");
    }
  }, [item.id, onDeleted]);

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget; 
    const f = inputEl.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      await siteContentAdminService.uploadThumbnail(item.id, f);
      toast.success("Đã cập nhật hình");
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Tải hình thất bại");
    } finally {
      setUploading(false);
      if (inputEl) inputEl.value = ""; 
    }
  }, [item.id, onSaved]);

  return (
    <tr className="border-t">
      <td className="p-2 whitespace-nowrap align-middle">{item.type}</td>
      <td className="p-2 align-middle">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" />
      </td>
      {item.type === "TESTIMONIAL" && (
        <td className="p-2 align-middle">
          <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Tên tác giả" />
        </td>
      )}
      {item.type === "TESTIMONIAL" && (
        <td className="p-2 align-middle">
          <Input value={authorTitle} onChange={(e) => setAuthorTitle(e.target.value)} placeholder="Vai trò" />
        </td>
      )}
      <td className="p-2 align-middle">
        <div className="flex items-center gap-2">
          {item.thumbnailUrl ? (
            <a className="text-primary hover:underline truncate max-w-[180px]" href={item.thumbnailUrl} target="_blank" rel="noreferrer">Xem hình</a>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
          <label className="inline-flex items-center gap-1 text-xs px-2 py-1 border rounded cursor-pointer">
            <UploadCloud className="size-3" /> Tải lên
            <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={uploading} />
          </label>
        </div>
      </td>
      <td className="p-2 align-middle">
        <Input type="number" min={0} value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)} />
      </td>
      <td className="p-2 align-middle">
        <div className="flex items-center gap-2 text-sm">
          <input id={`pub-${item.id}`} type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <label htmlFor={`pub-${item.id}`}>Công khai</label>
        </div>
      </td>
      <td className="p-2 align-middle text-right">
        <div className="inline-flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={save} disabled={saving} className="inline-flex items-center gap-1">
            <Save className="size-4" /> Lưu
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={del} className="inline-flex items-center gap-1 text-red-600">
            <Trash2 className="size-4" /> Xóa
          </Button>
        </div>
      </td>
    </tr>
  );
}
