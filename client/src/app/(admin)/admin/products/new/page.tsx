"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { CreateProductPayload } from "@/type/product";
import { categoryService, type Category } from "@/service/category.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import slugify from "slugify";
import { PackagePlus, Save, X } from "lucide-react";
import { useSupplierList } from "@/hook/useSupplier";
import { AddVariantDialog } from "@/components/admin/products/VariantDialogs";
import { validateAndSuggestVariantName } from "@/utils/variantNameHelper";
import NewProductForm from "@/components/admin/products/NewProductForm";
import ProductImageManager from "@/components/admin/products/ProductImageManager";
import SimpleVariantsTable, { type SimpleVariant } from "@/components/admin/products/SimpleVariantsTable";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const { data: suppliers = [] } = useSupplierList();
  const [supplierId, setSupplierId] = useState<string>("");
  const [supplierQuery, setSupplierQuery] = useState("");
  const imgUrlRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [initialBuyCount, setInitialBuyCount] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [slugError, setSlugError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [variants, setVariants] = useState<SimpleVariant[]>([]);
  
  const [nvBaseName, setNvBaseName] = useState("");
  const [nvSku, setNvSku] = useState("");
  const [nvPrice, setNvPrice] = useState("");
  const [nvDiscountPrice, setNvDiscountPrice] = useState("");
  const [nvDiscountAmount, setNvDiscountAmount] = useState("");
  const [nvDiscountMode, setNvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [nvStock, setNvStock] = useState("");
  const [nvWeight, setNvWeight] = useState("");
  const [addingVariant, setAddingVariant] = useState(false);

  const VND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);
  const thumbnailObjectUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail]);

  const nvFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(nvBaseName, nvWeight);
    return nameValidation.suggestedName || nvBaseName;
  }, [nvBaseName, nvWeight]);

  useEffect(() => {
    return () => {
      if (thumbnailObjectUrl) URL.revokeObjectURL(thumbnailObjectUrl);
    };
  }, [thumbnailObjectUrl]);

  useEffect(() => {
    categoryService
      .list()
      .then((cs) => setCategories(Array.isArray(cs) ? cs : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (slugTouched) return;
    const s = slugify(name || "", { lower: true, strict: true, trim: true, locale: "vi" });
    setSlug(s);
  }, [name, slugTouched]);

  useEffect(() => {
    const s = slug.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!s) {
      setSlugError(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const existing = await productService.getBySlug(s).catch(() => null);
        setSlugError(existing ? "Slug đã tồn tại" : null);
      } catch {
        setSlugError(null);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [slug]);

  const addImage = useCallback((url: string) => {
    const u = url.trim();
    if (!u) return;
    setImages((prev) => Array.from(new Set([...(prev || []), u])));
  }, []);

  const removeImage = useCallback(
    (url: string) => setImages((prev) => (prev || []).filter((x) => x !== url)),
    []
  );

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

  const addVariantLocal = useCallback(async () => {
    if (!nvFinalName.trim()) {
      toast.error("Tên biến thể không được để trống");
      return;
    }
    if (!nvSku.trim()) {
      toast.error("SKU không được để trống");
      return;
    }

    try {
      setAddingVariant(true);
      const priceNum = Number(nvPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        toast.error("Giá phải là số không âm");
        return;
      }

      const discountPct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
      if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) {
        toast.error("Phần trăm giảm giá phải từ 0 đến 100");
        return;
      }

      const discountAmountNum = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
      if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) {
        toast.error("Giá sau giảm phải từ 0 đến Giá");
        return;
      }

      const discountedPrice =
        nvDiscountMode === "AMOUNT"
          ? discountAmountNum == null
            ? null
            : discountAmountNum
          : discountPct == null
          ? null
          : Math.max(0, Math.round(priceNum * (1 - discountPct / 100)));

      const stockNum = nvStock === "" ? 0 : Number(nvStock);
      if (!Number.isFinite(stockNum) || stockNum < 0) {
        toast.error("Kho phải là số không âm");
        return;
      }

      setVariants((arr) => [
        ...arr,
        {
          name: nvFinalName.trim(),
          sku: nvSku.trim(),
          price: priceNum,
          discountPrice: discountedPrice || undefined,
          stockQuantity: stockNum,
        },
      ]);

      setNvBaseName("");
      setNvSku("");
      setNvPrice("");
      setNvDiscountPrice("");
      setNvDiscountAmount("");
      setNvDiscountMode("PERCENT");
      setNvStock("");
      setNvWeight("");
      toast.success("Đã thêm biến thể");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể thêm biến thể";
      toast.error(msg);
    } finally {
      setAddingVariant(false);
    }
  }, [nvFinalName, nvSku, nvPrice, nvDiscountPrice, nvDiscountAmount, nvDiscountMode, nvStock]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);
  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugTouched(true);
    setSlug(e.target.value);
  }, []);
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), []);
  const handleIsActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setIsActive(e.target.checked), []);
  const handleInitialBuyCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setInitialBuyCount(e.target.value), []);
  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files?.[0] ?? null), []);
  const handleCategoryQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCategoryQuery(e.target.value), []);
  const handleSupplierQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSupplierQuery(e.target.value), []);

  const handleImgKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const v = imgUrlRef.current?.value || "";
        addImage(v);
        if (imgUrlRef.current) imgUrlRef.current.value = "";
      }
    },
    [addImage]
  );

  const handleAddImageClick = useCallback(() => {
    const v = imgUrlRef.current?.value || "";
    addImage(v);
    if (imgUrlRef.current) imgUrlRef.current.value = "";
  }, [addImage]);

  const handleImageDragStart = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    const index = Number((e.currentTarget.dataset.index as string) ?? "-1");
    const url = e.currentTarget.dataset.url as string;
    e.dataTransfer.setData("text/plain", JSON.stringify({ index, url }));
  }, []);

  const handleRemoveImageClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const url = e.currentTarget.dataset.url as string;
      if (url) removeImage(url);
    },
    [removeImage]
  );

  const handleBackClick = useCallback(() => router.back(), [router]);

  const handleVariantDelete = useCallback((index: number) => {
    setVariants((arr) => arr.filter((_, j) => j !== index));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError || !categoryId || !supplierId) {
      if (!categoryId) toast.error("Vui lòng chọn danh mục");
      if (!supplierId) toast.error("Vui lòng chọn nhà cung cấp");
      return;
    }
    setLoading(true);
    try {
      const createPayload: CreateProductPayload = {
        name,
        slug,
        description,
        isActive,
        categoryId,
        supplierId,
        initialBuyCount: initialBuyCount === "" ? undefined : Number(initialBuyCount),
        variants: variants as unknown as CreateProductPayload["variants"],
      };
      const created = await productService.create(createPayload);
      if (thumbnail) {
        await productService.updateThumbnail(created.id, thumbnail);
      }
      // Add images if needed (skip if no method available)
      if (images.length > 0) {
        // Images will be added separately if API supports it
      }
      toast.success("Đã tạo sản phẩm");
      router.push("/admin/products");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Không thể tạo sản phẩm";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
        <PackagePlus className="size-5 text-muted-foreground" aria-hidden />
        Thêm sản phẩm mới
      </h1>

      <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-4">Thông tin cơ bản</h2>
          <NewProductForm
            name={name}
            slug={slug}
            description={description}
            isActive={isActive}
            categoryId={categoryId}
            categories={categories}
            categoryQuery={categoryQuery}
            supplierId={supplierId}
            suppliers={suppliers}
            supplierQuery={supplierQuery}
            initialBuyCount={initialBuyCount}
            slugError={slugError}
            onNameChange={handleNameChange}
            onSlugChange={handleSlugChange}
            onDescriptionChange={handleDescriptionChange}
            onIsActiveChange={handleIsActiveChange}
            onCategoryChange={setCategoryId}
            onCategoryQueryChange={handleCategoryQueryChange}
            onSupplierChange={setSupplierId}
            onSupplierQueryChange={handleSupplierQueryChange}
            onInitialBuyCountChange={handleInitialBuyCountChange}
          />
        </div>

        <Separator />

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold mb-4">Hình ảnh</h2>
          <ProductImageManager
            thumbnailUrl={undefined}
            thumbnailObjectUrl={thumbnailObjectUrl}
            images={images}
            pendingPreviews={[]}
            uploading={false}
            onThumbnailFileChange={handleThumbnailChange}
            onImgUrlKeyDown={handleImgKeyDown}
            onAddImageButtonClick={handleAddImageClick}
            onImageDragStart={handleImageDragStart}
            onDrop={onDrop}
            onAllowDrop={allowDrop}
            onRemoveImageClick={handleRemoveImageClick}
            onFilesChange={() => {}}
            onUploadImages={() => {}}
            imgUrlRef={imgUrlRef as React.RefObject<HTMLInputElement>}
          />
        </div>

        <Separator />

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Biến thể sản phẩm</h2>
            <AddVariantDialog
              triggerLabel="+ Thêm biến thể"
              baseName={nvBaseName}
              sku={nvSku}
              price={nvPrice}
              weight={nvWeight}
              discountPercent={nvDiscountPrice}
              discountAmount={nvDiscountAmount}
              discountMode={nvDiscountMode}
              stock={nvStock}
              disabled={addingVariant}
              onBaseNameChange={setNvBaseName}
              onSkuChange={setNvSku}
              onWeightChange={setNvWeight}
              onPriceChange={setNvPrice}
              onDiscountPercentChange={setNvDiscountPrice}
              onDiscountAmountChange={setNvDiscountAmount}
              onDiscountModeChange={setNvDiscountMode}
              onStockChange={setNvStock}
              onAdd={addVariantLocal}
            />
          </div>
          <SimpleVariantsTable variants={variants} onDelete={handleVariantDelete} VND={VND} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !!slugError || !categoryId || !supplierId} className="inline-flex items-center gap-1">
            <Save className="size-4" aria-hidden />
            {loading ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={handleBackClick} className="inline-flex items-center gap-1">
            <X className="size-4" aria-hidden />
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
