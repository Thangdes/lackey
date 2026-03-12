"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DEFAULT_CATEGORY_IMAGE } from "@/constant/image";
import { AdminFormDialog } from "@/components/admin/shared/AdminFormDialog";
import { AdminFormField } from "@/components/admin/shared/AdminFormField";
import { UploadCloud } from "lucide-react";

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

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (onFileChange) onFileChange(file);
  }, [onFileChange]);

  const displayImage = selectedFile ? URL.createObjectURL(selectedFile) : (thumbnailUrl || DEFAULT_CATEGORY_IMAGE);

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm danh mục" : "Sửa danh mục"}
      description={mode === "create" ? "Tạo một danh mục mới" : "Cập nhật thông tin danh mục"}
      onSave={onSave}
      saving={saving}
      saveLabel={mode === "create" ? "Tạo" : "Cập nhật"}
    >
      <AdminFormField
        label="Tên danh mục"
        value={name}
        onChange={onNameChange}
        placeholder="Ví dụ: Điện thoại"
        error={nameError}
        required
      />

      <AdminFormField
        label="Slug"
        value={slug}
        onChange={onSlugChange}
        placeholder="vi-du: dien-thoai"
        error={slugError}
        hint="URL thân thiện cho danh mục"
        required
      />

      <AdminFormField
        label="Mô tả"
        type="textarea"
        value={description}
        onChange={onDescriptionChange}
        placeholder="Mô tả ngắn về danh mục"
        rows={3}
        maxLength={1000}
        hint="Tối đa 1000 ký tự"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Ảnh thumbnail</label>
        <div className="border-2 border-dashed rounded-lg p-4 bg-muted/20 hover:bg-muted/30 transition">
          <div className="flex flex-col items-center gap-3">
            {displayImage && (
              <Image
                src={displayImage}
                alt="Preview"
                width={120}
                height={120}
                className="rounded-lg object-cover"
              />
            )}
            <div className="flex flex-col items-center gap-2">
              <Button type="button" variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <UploadCloud className="size-4" />
                  Chọn ảnh
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                PNG, JPG, WEBP (tối đa 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminFormDialog>
  );
}
