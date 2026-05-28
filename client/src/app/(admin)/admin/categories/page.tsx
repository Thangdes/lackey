"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/admin/categories/CategoryDialog";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { useCategoryList, useCreateCategory, useDeleteCategory, useUpdateCategory, useUploadCategoryThumbnail } from "@/hook/useCategory";
import { AdminPageHeader } from "@/components/admin/shared/AdminPageHeader";
import { AdminSearchBar } from "@/components/admin/shared/AdminSearchBar";
import slugify from "slugify";
import { toast } from "sonner";
import { FolderTree, Plus } from "lucide-react";

function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategoryList();
  const createMutation = useCreateCategory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const updateMutation = useUpdateCategory(editingId || "");
  const deleteMutation = useDeleteCategory();
  const uploadThumbMutation = useUploadCategoryThumbnail();

  const [query, setQuery] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return categories;
    const q = query.toLowerCase();
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, query]);

  const resetForm = useCallback(() => {
    setName("");
    setSlug("");
    setDescription("");
    setSelectedFile(null);
    setCurrentThumbnailUrl(null);
    setSaving(false);
  }, []);

  const handleCreateClick = useCallback(() => {
    setDialogMode("create");
    setEditingId(null);
    resetForm();
    setDialogOpen(true);
  }, [resetForm]);

  const handleEdit = useCallback((id: string) => {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    setDialogMode("edit");
    setEditingId(id);
    setName(c.name);
    setSlug(c.slug || slugify(c.name || "", { lower: true, strict: true }));
    setDescription(c.description ?? "");
    setCurrentThumbnailUrl(c.thumbnailUrl ?? null);
    setSelectedFile(null);
    setDialogOpen(true);
  }, [categories]);

  const handleDelete = useCallback((id: string) => {
    toast.promise(deleteMutation.mutateAsync(id), {
      loading: "Đang xóa danh mục…",
      success: "Đã xóa danh mục",
      error: "Xóa danh mục thất bại",
    });
  }, [deleteMutation]);

  const handleUpload = useCallback((id: string, file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Định dạng ảnh không hợp lệ. Chỉ chấp nhận PNG, JPG, WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh quá lớn. Kích thước tối đa 5MB.");
      return;
    }
    toast.promise(uploadThumbMutation.mutateAsync({ id, file }), {
      loading: "Đang tải ảnh lên…",
      success: "Cập nhật ảnh danh mục thành công",
      error: "Tải ảnh thất bại",
    });
  }, [uploadThumbMutation]);

  const handleNameChange = useCallback((v: string) => {
    setName(v);
    setSlug((prev) => (prev ? prev : slugify(v || "", { lower: true, strict: true })));
  }, []);

  const handleSlugChange = useCallback((v: string) => {
    setSlug(slugify(v || "", { lower: true, strict: true }));
  }, []);

  const handleDescriptionChange = useCallback((v: string) => {
    setDescription(v);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setSelectedFile(file);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      
      const safeSlug = slugify((slug || name) || "", { lower: true, strict: true });
      if (!safeSlug) {
        toast.error("Vui lòng nhập Tên hoặc Slug hợp lệ");
        return;
      }
      let categoryId: string;
      
      if (dialogMode === "create") {
        const p = createMutation.mutateAsync({ name, slug: safeSlug, description });
        await toast.promise(p, {
          loading: "Đang tạo danh mục…",
          success: "Tạo danh mục thành công",
          error: "Tạo danh mục thất bại",
        });
        const result = await p;
        categoryId = result.id;
      } else if (editingId) {
        await toast.promise(updateMutation.mutateAsync({ name, slug: safeSlug, description }), {
          loading: "Đang lưu thay đổi…",
          success: "Cập nhật danh mục thành công",
          error: "Cập nhật danh mục thất bại",
        });
        categoryId = editingId;
      } else {
        return;
      }

      
      if (selectedFile) {
        const allowed = ["image/png", "image/jpeg", "image/webp"];
        if (!allowed.includes(selectedFile.type)) {
          toast.error("Định dạng ảnh không hợp lệ. Chỉ chấp nhận PNG, JPG, WEBP.");
          return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast.error("Ảnh quá lớn. Kích thước tối đa 5MB.");
          return;
        }
        
        await toast.promise(uploadThumbMutation.mutateAsync({ id: categoryId, file: selectedFile }), {
          loading: "Đang tải ảnh lên…",
          success: "Cập nhật ảnh danh mục thành công",
          error: "Tải ảnh thất bại",
        });
      }

      setDialogOpen(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  }, [createMutation, description, dialogMode, editingId, name, resetForm, selectedFile, slug, updateMutation, uploadThumbMutation]);

  return (
    <div className="space-y-6 p-6">
      <AdminPageHeader
        icon={FolderTree}
        title="Danh mục"
        description="Quản lý danh mục sản phẩm"
        actions={
          <>
            <AdminSearchBar
              value={query}
              onChange={setQuery}
              placeholder="Tìm theo tên hoặc slug"
            />
            <Button type="button" onClick={handleCreateClick}>
              <Plus className="size-4" />
              Thêm
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Đang tải…</div>
      ) : (
        <CategoryTable items={filtered} onEdit={handleEdit} onDelete={handleDelete} onUpload={handleUpload} />
      )}

      <CategoryDialog
        open={dialogOpen}
        mode={dialogMode}
        name={name}
        slug={slug}
        description={description}
        thumbnailUrl={currentThumbnailUrl}
        saving={saving}
        onOpenChange={setDialogOpen}
        onNameChange={handleNameChange}
        onSlugChange={handleSlugChange}
        onDescriptionChange={handleDescriptionChange}
        onFileChange={handleFileChange}
        onSave={handleSave}
      />
    </div>
  );
}

export default CategoriesPage;