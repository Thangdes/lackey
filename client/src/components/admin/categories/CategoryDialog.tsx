"use client";
import React, { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DEFAULT_CATEGORY_IMAGE } from "@/constant/image";

export type CategoryDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  name: string;
  slug: string;
  description: string;
  thumbnailUrl?: string | null;
  saving?: boolean;
  nameError?: string;
  slugError?: string;
  onOpenChange: (open: boolean) => void;
  onNameChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onFileChange?: (file: File | null) => void;
  onSave: () => void;
};

export function CategoryDialog(props: CategoryDialogProps) {
  const { open, mode, name, slug, description, thumbnailUrl, saving, nameError, slugError, onOpenChange, onNameChange, onSlugChange, onDescriptionChange, onFileChange, onSave } = props;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpen = useCallback((o: boolean) => onOpenChange(o), [onOpenChange]);
  const handleName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value), [onNameChange]);
  const handleSlug = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSlugChange(e.target.value), [onSlugChange]);
  const handleDesc = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => onDescriptionChange(e.target.value), [onDescriptionChange]);
  const handleSave = useCallback(() => onSave(), [onSave]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (onFileChange) onFileChange(file);
  }, [onFileChange]);

  const displayImage = selectedFile ? URL.createObjectURL(selectedFile) : (thumbnailUrl || DEFAULT_CATEGORY_IMAGE);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm danh mục" : "Sửa danh mục"}</DialogTitle>
          <DialogDescription>{mode === "create" ? "Tạo một danh mục mới" : "Cập nhật thông tin danh mục"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <Input value={name} onChange={handleName} placeholder="Tên danh mục" />
            {nameError && <p className="text-xs text-red-600 mt-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <Input value={slug} onChange={handleSlug} placeholder="ví dụ: dien-thoai" />
            {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea
              className="min-h-[88px] w-full rounded-md border border-black/15 p-2 text-sm focus:outline-none"
              placeholder="Mô tả danh mục"
              value={description}
              onChange={handleDesc}
              maxLength={1000}
            />
            <div className="mt-1 text-[12px] text-black/50">Tối đa 1000 ký tự.</div>
          </div>
          <div>
            <label className="block text-sm mb-1">Ảnh thumbnail</label>
            <div className="border-2 border-dashed rounded-md p-4 bg-muted/20 hover:bg-muted/30 transition">
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground mt-1">Kéo & thả ảnh vào đây hoặc bấm để chọn file.</p>
            </div>
            {displayImage && (
              <div className="mt-2 flex items-center gap-3">
                <div className="group relative">
                  <div className="w-14 h-14 rounded overflow-hidden bg-neutral-100 border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pointer-events-none absolute left-16 top-0 hidden group-hover:block">
                    <div className="rounded border bg-white p-1 shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayImage}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">Ảnh xem nhanh (ưu tiên file vừa chọn, sau đó ảnh hiện tại)</div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={!!saving}>{saving ? "Đang lưu…" : "Lưu"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
