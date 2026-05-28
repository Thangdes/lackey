"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { Product, UpdateProductPayload } from "@/type/product";
import { categoryService, type Category } from "@/service/category.service";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import slugify from "slugify";
import { VariantsTable } from "@/components/admin/products/VariantsTable";
import { AddVariantDialog, EditVariantDialog } from "@/components/admin/products/VariantDialogs";
import { Package, Save, X } from "lucide-react";
import ProductBasicInfoForm from "@/components/admin/products/ProductBasicInfoForm";
import ProductImageManager from "@/components/admin/products/ProductImageManager";
import { useProductVariants } from "@/hook/useProductVariants";

export default function EditProductPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Product | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const imgUrlRef = useRef<HTMLInputElement | null>(null);

  
  const variantsHook = useProductVariants(id, data, setData);

  const thumbnailObjectUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail]);
  
  useEffect(() => {
    return () => {
      if (thumbnailObjectUrl) URL.revokeObjectURL(thumbnailObjectUrl);
    };
  }, [thumbnailObjectUrl]);

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [pendingPreviews]);

  useEffect(() => {
    const run = async () => {
      try {
        const p = await productService.getById(id);
        setData(p);
        setImages(p.images || []);
        setCategoryId(p.categoryId || "");
      } finally {
        setLoading(false);
      }
    };
    if (id) run();
  }, [id]);

  useEffect(() => {
    categoryService
      .list()
      .then((cs) => setCategories(Array.isArray(cs) ? cs : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!data || slugTouched) return;
    const s = slugify(data.name || "", { lower: true, strict: true, trim: true, locale: "vi" });
    if (data.slug !== s) setData({ ...(data as Product), slug: s });
  }, [data, slugTouched]);

  useEffect(() => {
    if (!data) return;
    const s = data.slug?.trim();
    if (!s) {
      setSlugError(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const existing = await productService.getBySlug(s).catch(() => null);
        setSlugError(existing && existing.id !== data.id ? "Slug đã tồn tại" : null);
      } catch {
        setSlugError(null);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data]);

  const addImage = useCallback((url: string) => {
    const u = url.trim();
    if (!u) return;
    setImages((prev) => Array.from(new Set([...(prev || []), u])));
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      const obj = JSON.parse(data);
      if (obj && typeof obj.index === "number" && typeof obj.url === "string") {
        setImages((prev) => {
          const arr = [...prev];
          const from = obj.index as number;
          const to = Math.max(0, Math.min(arr.length - 1, arr.findIndex((x) => x === obj.url)));
          if (from >= 0 && from < arr.length && to >= 0) {
            const [mv] = arr.splice(from, 1);
            arr.splice(to, 0, mv);
          }
          return arr;
        });
      }
    } catch {}
  }, []);

  const allowDrop = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const handleCategoryQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryQuery(e.target.value);
  }, []);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setData((prev) => (prev ? ({ ...(prev as Product), name: v }) : prev));
  }, []);

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSlugTouched(true);
    setData((prev) => (prev ? ({ ...(prev as Product), slug: v }) : prev));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setData((prev) => (prev ? ({ ...(prev as Product), description: v }) : prev));
  }, []);

  const handleIsActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setData((prev) => (prev ? ({ ...(prev as Product), isActive: checked }) : prev));
  }, []);

  const handleThumbnailFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnail(e.target.files?.[0] ?? null);
  }, []);

  const handleImgUrlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = imgUrlRef.current?.value || "";
        addImage(val);
        if (imgUrlRef.current) imgUrlRef.current.value = "";
      }
    },
    [addImage]
  );

  const handleAddImageButtonClick = useCallback(() => {
    const val = imgUrlRef.current?.value || "";
    addImage(val);
    if (imgUrlRef.current) imgUrlRef.current.value = "";
  }, [addImage]);

  const handleImageDragStart = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    const index = Number((e.currentTarget.dataset.index as string) ?? "-1");
    const url = e.currentTarget.dataset.url as string;
    e.dataTransfer.setData("text/plain", JSON.stringify({ index, url }));
  }, []);

  const handleRemoveImageClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      const url = e.currentTarget.dataset.url as string;
      if (!url) return;

      if (data && !data.images?.includes(url)) {
        setImages((prev) => prev.filter((x) => x !== url));
        return;
      }

      try {
        const updated = await productService.removeImage(id, url);
        setImages(updated.images || []);
        showSuccessToast({ title: "Đã xóa ảnh" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Không thể xóa ảnh";
        showErrorToast({ title: "Không thể xóa ảnh", message: msg });
      }
    },
    [id, data]
  );

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) {
      setPendingFiles([]);
      setPendingPreviews([]);
      return;
    }
    const previews = files.map((f) => URL.createObjectURL(f));
    setPendingPreviews((old) => {
      old.forEach((u) => URL.revokeObjectURL(u));
      return previews;
    });
    setPendingFiles(files);
  }, []);

  const handleUploadImages = useCallback(async () => {
    if (!pendingFiles.length) return;
    try {
      setUploading(true);
      const updated = await productService.addImages(id, pendingFiles);
      setImages(updated.images || []);
      setPendingFiles([]);
      setPendingPreviews((old) => {
        old.forEach((u) => URL.revokeObjectURL(u));
        return [];
      });
      showSuccessToast({ title: "Đã tải lên ảnh bổ sung" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể tải ảnh";
      showErrorToast({ title: "Không thể tải ảnh", message: msg });
    } finally {
      setUploading(false);
    }
  }, [id, pendingFiles]);

  const handleCancelClick = useCallback(() => {
    router.back();
  }, [router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || slugError || !categoryId) return;
    setSaving(true);
    try {
      const payload: UpdateProductPayload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isActive: data.isActive ?? true,
        categoryId,
        images,
      };
      await productService.update(id, payload);
      if (thumbnail) {
        await productService.updateThumbnail(id, thumbnail);
      }
      showSuccessToast({ title: "Lưu sản phẩm thành công" });
      router.push("/admin/products");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể lưu sản phẩm";
      showErrorToast({ title: "Không thể lưu sản phẩm", message: msg });
      return;
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải…</div>;
  if (!data) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
        <Package className="size-5 text-muted-foreground" aria-hidden />
        Sửa sản phẩm
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={onSubmit} className="space-y-6 lg:col-span-8">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-4">Thông tin cơ bản</h2>
            <ProductBasicInfoForm
              product={data}
              categoryId={categoryId}
              categories={categories}
              categoryQuery={categoryQuery}
              slugError={slugError}
              onNameChange={handleNameChange}
              onSlugChange={handleSlugChange}
              onDescriptionChange={handleDescriptionChange}
              onIsActiveChange={handleIsActiveChange}
              onCategoryChange={setCategoryId}
              onCategoryQueryChange={handleCategoryQueryChange}
            />
          </div>

          <Separator />

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-4">Hình ảnh</h2>
            <ProductImageManager
              thumbnailUrl={data.thumbnailUrl || undefined}
              thumbnailObjectUrl={thumbnailObjectUrl}
              images={images}
              pendingPreviews={pendingPreviews}
              uploading={uploading}
              onThumbnailFileChange={handleThumbnailFileChange}
              onImgUrlKeyDown={handleImgUrlKeyDown}
              onAddImageButtonClick={handleAddImageButtonClick}
              onImageDragStart={handleImageDragStart}
              onDrop={onDrop}
              onAllowDrop={allowDrop}
              onRemoveImageClick={handleRemoveImageClick}
              onFilesChange={handleFilesChange}
              onUploadImages={handleUploadImages}
              imgUrlRef={imgUrlRef as React.RefObject<HTMLInputElement>}
            />
          </div>

          <Separator />

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Biến thể sản phẩm</h2>
              <AddVariantDialog
                triggerLabel="+ Thêm biến thể"
                baseName={variantsHook.nvBaseName}
                sku={variantsHook.nvSku}
                price={variantsHook.nvPrice}
                weight={variantsHook.nvWeight}
                discountPercent={variantsHook.nvDiscountPrice}
                discountAmount={variantsHook.nvDiscountAmount}
                discountMode={variantsHook.nvDiscountMode}
                stock={variantsHook.nvStock}
                disabled={variantsHook.addingVariant}
                onBaseNameChange={variantsHook.setNvBaseName}
                onSkuChange={variantsHook.setNvSku}
                onWeightChange={variantsHook.setNvWeight}
                onPriceChange={variantsHook.setNvPrice}
                onDiscountPercentChange={variantsHook.setNvDiscountPrice}
                onDiscountAmountChange={variantsHook.setNvDiscountAmount}
                onDiscountModeChange={variantsHook.handleNvDiscountModeChange}
                onStockChange={variantsHook.setNvStock}
                onAdd={variantsHook.onAddVariant}
              />
            </div>
            <VariantsTable
              variants={data.variants || []}
              onEdit={variantsHook.onVariantEdit}
              onDelete={variantsHook.onVariantDelete}
              onNameBlur={async () => {}}
              onSkuBlur={async () => {}}
              onPriceBlur={async () => {}}
              onStockBlur={async () => {}}
              onDiscountSave={async () => {}}
              onStockSave={async () => {}}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving || !!slugError || !categoryId} className="inline-flex items-center gap-1">
              <Save className="size-4" aria-hidden />
              {saving ? "Đang lưu…" : "Lưu"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancelClick} className="inline-flex items-center gap-1">
              <X className="size-4" aria-hidden />
              Hủy
            </Button>
          </div>
        </form>
      </div>

      <EditVariantDialog
        open={variantsHook.evOpen}
        baseName={variantsHook.evBaseName}
        sku={variantsHook.evSku}
        price={variantsHook.evPrice}
        weight={variantsHook.evWeight}
        discountPercent={variantsHook.evDiscountPrice}
        discountAmount={variantsHook.evDiscountAmount}
        discountMode={variantsHook.evDiscountMode}
        stock={variantsHook.evStock}
        saving={variantsHook.evSaving}
        onOpenChange={variantsHook.setEvOpen}
        onBaseNameChange={variantsHook.setEvBaseName}
        onSkuChange={variantsHook.setEvSku}
        onWeightChange={variantsHook.setEvWeight}
        onPriceChange={variantsHook.setEvPrice}
        onDiscountPercentChange={variantsHook.setEvDiscountPrice}
        onDiscountAmountChange={variantsHook.setEvDiscountAmount}
        onDiscountModeChange={variantsHook.handleEvDiscountModeChange}
        onStockChange={variantsHook.setEvStock}
        onSave={variantsHook.onEditVariantSave}
      />
    </div>
  );
}
