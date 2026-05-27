"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { CreateProductPayload } from "@/type/product";
import { categoryService, type Category } from "@/service/category.service";
import { supplierAdminService } from "@/service/supplier-admin.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import slugify from "slugify";
import { PackagePlus, Save, X } from "lucide-react";
import { useSupplierList } from "@/hook/useSupplier";
import { validateAndSuggestVariantName } from "@/utils/variantNameHelper";
import NewProductForm from "@/components/admin/products/NewProductForm";
import ProductImageManager from "@/components/admin/products/ProductImageManager";
import SimpleVariantsTable, { type SimpleVariant } from "@/components/admin/products/SimpleVariantsTable";
import { AdminFormDialog } from "@/components/admin/shared/AdminFormDialog";
import { AdminFormField } from "@/components/admin/shared/AdminFormField";

export default function NewProductPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const { data: suppliers = [], isLoading: suppliersLoading, isError: suppliersError } = useSupplierList();
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

  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [ccName, setCcName] = useState("");
  const [ccSlug, setCcSlug] = useState("");
  const [ccDescription, setCcDescription] = useState("");
  const [createCategorySaving, setCreateCategorySaving] = useState(false);

  const [createSupplierOpen, setCreateSupplierOpen] = useState(false);
  const [csName, setCsName] = useState("");
  const [csEmail, setCsEmail] = useState("");
  const [csContactName, setCsContactName] = useState("");
  const [csPhone, setCsPhone] = useState("");
  const [csAddress, setCsAddress] = useState("");
  const [createSupplierSaving, setCreateSupplierSaving] = useState(false);
  
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

  const reloadCategories = useCallback(async () => {
    try {
      const cs = await categoryService.list();
      setCategories(Array.isArray(cs) ? cs : []);
    } catch {
      setCategories([]);
    }
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

  const openCreateCategory = useCallback(() => {
    setCcName(categoryQuery.trim());
    setCcSlug(slugify(categoryQuery.trim() || "", { lower: true, strict: true, trim: true, locale: "vi" }));
    setCcDescription("");
    setCreateCategoryOpen(true);
  }, [categoryQuery]);

  const openCreateSupplier = useCallback(() => {
    setCsName(supplierQuery.trim());
    setCsEmail("");
    setCsContactName("");
    setCsPhone("");
    setCsAddress("");
    setCreateSupplierOpen(true);
  }, [supplierQuery]);

  const handleCreateCategorySave = useCallback(async () => {
    const name = ccName.trim();
    const safeSlug = slugify((ccSlug || name) || "", { lower: true, strict: true, trim: true, locale: "vi" });
    if (!name) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    if (!safeSlug) {
      toast.error("Vui lòng nhập slug hợp lệ");
      return;
    }

    try {
      setCreateCategorySaving(true);
      const created = await categoryService.create({ name, slug: safeSlug, description: ccDescription.trim() || undefined });
      await reloadCategories();
      setCategoryId(created.id);
      setCreateCategoryOpen(false);
      setCategoryQuery("");
      toast.success("Đã tạo danh mục");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Không thể tạo danh mục");
    } finally {
      setCreateCategorySaving(false);
    }
  }, [ccDescription, ccName, ccSlug, reloadCategories]);

  const handleCreateSupplierSave = useCallback(async () => {
    const name = csName.trim();
    const email = csEmail.trim();
    if (!name) {
      toast.error("Vui lòng nhập tên nhà cung cấp");
      return;
    }
    if (!email) {
      toast.error("Vui lòng nhập email liên hệ");
      return;
    }

    try {
      setCreateSupplierSaving(true);
      const created = await supplierAdminService.create({
        name,
        email,
        contactName: csContactName.trim() || undefined,
        phone: csPhone.trim() || undefined,
        address: csAddress.trim() || undefined,
      });
      await qc.invalidateQueries({ queryKey: ["suppliers"] });
      setSupplierId(created.id);
      setCreateSupplierOpen(false);
      setSupplierQuery("");
      toast.success("Đã tạo nhà cung cấp");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Không thể tạo nhà cung cấp");
    } finally {
      setCreateSupplierSaving(false);
    }
  }, [csAddress, csContactName, csEmail, csName, csPhone, qc]);

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
    if (variants.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 biến thể trước khi lưu");
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
        images,
        initialBuyCount: initialBuyCount === "" ? undefined : Number(initialBuyCount),
        variants: variants as unknown as CreateProductPayload["variants"],
      };
      const created = await productService.create(createPayload);
      if (thumbnail) {
        await productService.updateThumbnail(created.id, thumbnail);
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
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold inline-flex items-center gap-2">
          <PackagePlus className="size-5 text-muted-foreground" aria-hidden />
          Thêm sản phẩm mới
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => {
              const form = document.getElementById('admin-new-product-form') as HTMLFormElement | null;
              form?.requestSubmit();
            }}
            disabled={loading || !!slugError || !categoryId || !supplierId || variants.length === 0}
            className="inline-flex items-center gap-1"
          >
            <Save className="size-4" aria-hidden />
            {loading ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={handleBackClick} className="inline-flex items-center gap-1">
            <X className="size-4" aria-hidden />
            Hủy
          </Button>
        </div>
      </div>

      <form id="admin-new-product-form" onSubmit={onSubmit} className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                suppliersLoading={suppliersLoading}
                suppliersError={suppliersError}
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
                onCreateCategoryClick={openCreateCategory}
                onCreateSupplierClick={openCreateSupplier}
              />
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-semibold">Biến thể mặc định</h2>
                  <div className="text-xs text-muted-foreground">
                    Bạn có thể tạo sản phẩm nhanh với 1 biến thể. Có thể thêm nhiều biến thể sau.
                  </div>
                </div>
                <Button type="button" onClick={addVariantLocal} disabled={addingVariant}>
                  {addingVariant ? "Đang thêm…" : "Thêm biến thể"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tên cơ bản (không bao gồm khối lượng)</label>
                  <Input placeholder="Ví dụ: Hạt điều rang muối" value={nvBaseName} onChange={(e) => setNvBaseName(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Khối lượng (gram)</label>
                  <Input type="number" min={0} step="1" placeholder="Ví dụ: 500" value={nvWeight} onChange={(e) => setNvWeight(e.target.value)} />
                </div>

                <div className="sm:col-span-2">
                  <div className="p-3 bg-muted/40 border rounded text-sm">
                    <div className="text-muted-foreground">Tên biến thể sẽ tạo:</div>
                    <div className="font-semibold mt-1">{nvFinalName || "(Nhập tên cơ bản và khối lượng)"}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input placeholder="SKU" value={nvSku} onChange={(e) => setNvSku(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                  <Input type="number" min={0} step="1" placeholder="Giá" value={nvPrice} onChange={(e) => setNvPrice(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Khuyến mãi</label>
                  <select
                    aria-label="Chế độ khuyến mãi"
                    className="border rounded px-2 py-2 text-sm w-full bg-background"
                    value={nvDiscountMode}
                    onChange={(e) => setNvDiscountMode(e.target.value as "PERCENT" | "AMOUNT")}
                  >
                    <option value="PERCENT">Theo %</option>
                    <option value="AMOUNT">Giá sau giảm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá trị</label>
                  {nvDiscountMode === "PERCENT" ? (
                    <Input type="number" min={0} max={100} step="1" placeholder="%" value={nvDiscountPrice} onChange={(e) => setNvDiscountPrice(e.target.value)} />
                  ) : (
                    <Input type="number" min={0} step="1" placeholder="Giá sau giảm" value={nvDiscountAmount} onChange={(e) => setNvDiscountAmount(e.target.value)} />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kho</label>
                  <Input type="number" min={0} step="1" placeholder="Kho" value={nvStock} onChange={(e) => setNvStock(e.target.value)} />
                </div>
                <div className="text-sm text-muted-foreground flex items-end">
                  {(() => {
                    const p = Number(nvPrice);
                    if (!Number.isFinite(p) || p < 0) return null;
                    if (nvDiscountMode === "AMOUNT") {
                      const amt = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
                      if (amt == null || !Number.isFinite(amt) || amt < 0) return null;
                      return `Giá sau giảm: ${VND.format(Math.max(0, Math.min(amt, p)))}`;
                    }
                    const pct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
                    if (pct == null || !Number.isFinite(pct) || pct < 0 || pct > 100) return null;
                    const after = Math.max(0, Math.round(p * (1 - pct / 100)));
                    return `Giá sau giảm: ${VND.format(after)}`;
                  })()}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-medium mb-2">Danh sách biến thể</h3>
                <SimpleVariantsTable variants={variants} onDelete={handleVariantDelete} VND={VND} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
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
          </div>
        </div>

        <Separator className="my-6" />

        <div className="sticky bottom-0 bg-background/80 backdrop-blur border rounded-lg p-3 flex items-center justify-end gap-2">
          <Button type="submit" disabled={loading || !!slugError || !categoryId || !supplierId || variants.length === 0} className="inline-flex items-center gap-1">
            <Save className="size-4" aria-hidden />
            {loading ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={handleBackClick} className="inline-flex items-center gap-1">
            <X className="size-4" aria-hidden />
            Hủy
          </Button>
        </div>
      </form>

      <AdminFormDialog
        open={createCategoryOpen}
        onOpenChange={setCreateCategoryOpen}
        title="Thêm danh mục"
        description="Tạo danh mục mới"
        onSave={handleCreateCategorySave}
        saving={createCategorySaving}
        saveLabel="Tạo"
        maxWidth="md"
      >
        <AdminFormField
          label="Tên danh mục"
          value={ccName}
          onChange={(v) => {
            setCcName(v);
            setCcSlug((prev) => (prev ? prev : slugify(v || "", { lower: true, strict: true, trim: true, locale: "vi" })));
          }}
          placeholder="Ví dụ: Thực phẩm"
          required
          disabled={createCategorySaving}
        />
        <AdminFormField
          label="Slug"
          value={ccSlug}
          onChange={(v) => setCcSlug(v)}
          placeholder="vi-du: thuc-pham"
          required
          disabled={createCategorySaving}
        />
        <AdminFormField
          label="Mô tả"
          type="textarea"
          value={ccDescription}
          onChange={setCcDescription}
          placeholder="Mô tả ngắn về danh mục"
          disabled={createCategorySaving}
          rows={3}
          maxLength={1000}
        />
      </AdminFormDialog>

      <AdminFormDialog
        open={createSupplierOpen}
        onOpenChange={setCreateSupplierOpen}
        title="Thêm nhà cung cấp"
        description="Tạo nhà cung cấp mới"
        onSave={handleCreateSupplierSave}
        saving={createSupplierSaving}
        saveLabel="Tạo"
        maxWidth="md"
      >
        <AdminFormField
          label="Tên nhà cung cấp"
          value={csName}
          onChange={setCsName}
          placeholder="VD: Công ty ABC"
          required
          disabled={createSupplierSaving}
        />
        <AdminFormField
          label="Email liên hệ"
          type="email"
          value={csEmail}
          onChange={setCsEmail}
          placeholder="name@company.com"
          required
          disabled={createSupplierSaving}
        />
        <AdminFormField
          label="Tên người liên hệ"
          value={csContactName}
          onChange={setCsContactName}
          placeholder="Nguyễn Văn A"
          disabled={createSupplierSaving}
        />
        <AdminFormField
          label="Số điện thoại"
          value={csPhone}
          onChange={setCsPhone}
          placeholder="0901 234 567"
          disabled={createSupplierSaving}
        />
        <AdminFormField
          label="Địa chỉ"
          value={csAddress}
          onChange={setCsAddress}
          placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
          disabled={createSupplierSaving}
        />
      </AdminFormDialog>
    </div>
  );
}
