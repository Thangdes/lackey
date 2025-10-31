"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { ProductVariant, CreateProductPayload } from "@/type/product";
import { categoryService, type Category } from "@/service/category.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import slugify from "slugify";
import { PackagePlus, Save, X, Plus, Trash2 } from "lucide-react";
import { useSupplierList } from "@/hook/useSupplier";
import { AddVariantDialog } from "../[id]/components/VariantDialogs";
import { validateAndSuggestVariantName } from "@/utils/variantNameHelper";

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
  const thumbnailObjectUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail]);
  useEffect(() => {
    return () => { if (thumbnailObjectUrl) URL.revokeObjectURL(thumbnailObjectUrl); };
  }, [thumbnailObjectUrl]);

  useEffect(() => {
    categoryService
      .list()
      .then((cs) => setCategories(Array.isArray(cs) ? cs : []))
      .catch(() => setCategories([]));
  }, []);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => (c.name + " " + (c.slug || "")).toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  const filteredSuppliers = useMemo(() => {
    const q = supplierQuery.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, supplierQuery]);

  useEffect(() => {
    if (slugTouched) return; 
    const s = slugify(name || "", { lower: true, strict: true, trim: true, locale: "vi" });
    setSlug(s);
  }, [name, slugTouched]);

  useEffect(() => {
    const s = slug.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!s) { setSlugError(null); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const existing = await productService.getBySlug(s).catch(() => null);
        setSlugError(existing ? "Slug đã tồn tại" : null);
      } catch { setSlugError(null); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [slug]);

  const addImage = useCallback((url: string) => {
    const u = url.trim();
    if (!u) return;
    setImages((prev) => Array.from(new Set([...(prev || []), u])));
  }, []);
  const removeImage = useCallback((url: string) => setImages((prev) => (prev || []).filter((x) => x !== url)), []);
  const onDrop = useCallback((e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData('text/plain');
      const obj = JSON.parse(data);
      if (obj && typeof obj.index === 'number' && typeof obj.url === 'string') {
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

  const [variants, setVariants] = useState<Array<{ name: string; sku: string; price: number; discountPrice?: number; stockQuantity: number }>>([]);
  
  const [nvBaseName, setNvBaseName] = useState("");
  const [nvSku, setNvSku] = useState("");
  const [nvPrice, setNvPrice] = useState("");
  const [nvDiscountPrice, setNvDiscountPrice] = useState("");
  const [nvDiscountAmount, setNvDiscountAmount] = useState("");
  const [nvDiscountMode, setNvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [nvStock, setNvStock] = useState("");
  const [nvWeight, setNvWeight] = useState("");
  const [addingVariant, setAddingVariant] = useState(false);

  const nvFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(nvBaseName, nvWeight);
    return nameValidation.suggestedName || nvBaseName;
  }, [nvBaseName, nvWeight]);

  const addVariantLocal = useCallback(async () => {
    if (!nvFinalName.trim()) { toast.error("Tên biến thể không được để trống"); return; }
    if (!nvSku.trim()) { toast.error("SKU không được để trống"); return; }
    
    try {
      setAddingVariant(true);
      const priceNum = Number(nvPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) { toast.error("Giá phải là số không âm"); return; }
      
      const discountPct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
      if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) { toast.error("Phần trăm giảm giá phải từ 0 đến 100"); return; }
      
      const discountAmountNum = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
      if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) { toast.error("Giá sau giảm phải từ 0 đến Giá"); return; }
      
      const discountedPrice = nvDiscountMode === "AMOUNT"
        ? (discountAmountNum == null ? null : discountAmountNum)
        : (discountPct == null ? null : Math.max(0, Math.round(priceNum * (1 - (discountPct / 100)))));
      
      const stockNum = nvStock === "" ? 0 : Number(nvStock);
      if (!Number.isFinite(stockNum) || stockNum < 0) { toast.error("Kho phải là số không âm"); return; }
      
      setVariants((arr) => [...arr, { 
        name: nvFinalName.trim(), 
        sku: nvSku.trim(), 
        price: priceNum, 
        discountPrice: discountedPrice || undefined, 
        stockQuantity: stockNum 
      }]);
      
      setNvBaseName(""); setNvSku(""); setNvPrice(""); setNvDiscountPrice(""); setNvDiscountAmount(""); setNvDiscountMode("PERCENT"); setNvStock(""); setNvWeight("");
      toast.success("Đã thêm biến thể");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể thêm biến thể";
      toast.error(msg);
    } finally { 
      setAddingVariant(false); 
    }
  }, [nvFinalName, nvSku, nvPrice, nvDiscountPrice, nvDiscountAmount, nvDiscountMode, nvStock]);

  const handleCategoryQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCategoryQuery(e.target.value), []);
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value), []);
  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setSlugTouched(true); setSlug(e.target.value); }, []);
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value), []);
  const handleIsActiveChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setIsActive(e.target.checked), []);
  const handleInitialBuyCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setInitialBuyCount(e.target.value), []);
  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files?.[0] ?? null), []);
  const handleSupplierQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSupplierQuery(e.target.value), []);
  const handleImgKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); const v = imgUrlRef.current?.value || ''; addImage(v); if (imgUrlRef.current) imgUrlRef.current.value = ''; }
  }, [addImage]);
  const handleAddImageClick = useCallback(() => { const v = imgUrlRef.current?.value || ''; addImage(v); if (imgUrlRef.current) imgUrlRef.current.value = ''; }, [addImage]);
  const handleImageDragStart = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    const index = Number((e.currentTarget.dataset.index as string) ?? '-1'); const url = e.currentTarget.dataset.url as string; e.dataTransfer.setData('text/plain', JSON.stringify({ index, url }));
  }, []);
  const handleRemoveImageClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => { const url = e.currentTarget.dataset.url as string; if (url) removeImage(url); }, [removeImage]);
  const handleBackClick = useCallback(() => router.back(), [router]);
  const handleVariantRowDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = Number(e.currentTarget.dataset.index || '-1');
    setVariants((arr) => arr.filter((_, j) => j !== idx));
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
        ...(initialBuyCount !== "" ? { initialBuyCount: Math.max(0, Number(initialBuyCount) || 0) } : {}),
        variants: [],
      };
      const created = await productService.create(createPayload);
      let productId: string | undefined = created?.id;
      if (!productId) {
        try { const bySlug = await productService.getBySlug(slug); productId = bySlug?.id; } catch {}
      }
      if (productId && images.length > 0) {
      }
      if (productId && variants.length > 0) {
        for (const v of variants) {
          try {
            const pv: Omit<ProductVariant, "id"> & { stockQuantity?: number } = {
              name: v.name,
              sku: v.sku,
              price: v.price,
              ...(v.discountPrice != null ? { discountPrice: v.discountPrice } : {}),
              stockQuantity: v.stockQuantity,
            };
            await productService.addVariant(productId, pv);
          } catch (err) {
            console.error(err);
          }
        }
      }
      if (productId && thumbnail) {
        await productService.updateThumbnail(productId, thumbnail);
      }
      toast.success("Tạo sản phẩm thành công");
      router.push("/admin/products");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể tạo sản phẩm";
      toast.error(msg);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 inline-flex items-center gap-2">
        <PackagePlus className="size-5 text-muted-foreground" aria-hidden />
        Thêm sản phẩm
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={onSubmit} className="space-y-6 lg:col-span-8">
          <div className="rounded-lg border p-4 space-y-4">
          <label className="block text-sm mb-1">Danh mục</label>
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Tìm danh mục..."
              value={categoryQuery}
              onChange={handleCategoryQueryChange}
            />
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-64" aria-invalid={!categoryId}>
                <SelectValue placeholder="-- Chọn danh mục --" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!categoryId && <p className="text-xs text-red-600 mt-1">Vui lòng chọn danh mục</p>}

          <div className="pt-2">
            <label className="block text-sm mb-1">Nhà cung cấp</label>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                placeholder="Tìm nhà cung cấp..."
                value={supplierQuery}
                onChange={handleSupplierQueryChange}
              />
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="w-64" aria-invalid={!supplierId}>
                  <SelectValue placeholder="-- Chọn nhà cung cấp --" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSuppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!supplierId && <p className="text-xs text-red-600 mt-1">Vui lòng chọn nhà cung cấp</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <Input className="w-full" value={name} onChange={handleNameChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <Input className="w-full" value={slug} onChange={handleSlugChange} required aria-invalid={!!slugError} />
            {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea className="w-full border rounded p-2" value={description} onChange={handleDescriptionChange} rows={4} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div className="flex items-center gap-2">
              <input id="isActive" type="checkbox" checked={isActive} onChange={handleIsActiveChange} />
              <label htmlFor="isActive">Hiển thị</label>
            </div>
            <div>
              <label className="block text-sm mb-1">Lượt bán khởi tạo</label>
              <Input type="number" min={0} step="1" value={initialBuyCount} onChange={handleInitialBuyCountChange} placeholder="VD: 50" />
              <p className="text-[11px] text-muted-foreground mt-1">Số lượt bán ban đầu để hiển thị tổng đã bán hấp dẫn hơn.</p>
            </div>
          </div>
        </div>
        <Separator />
        <div className="rounded-lg border p-4 space-y-3">
          <label className="block text-sm mb-1">Thumbnail</label>
          <div className="border-2 border-dashed rounded-md p-4 bg-muted/20 hover:bg-muted/30 transition">
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            <p className="text-xs text-muted-foreground mt-1">Kéo & thả ảnh vào đây hoặc bấm để chọn file.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Ảnh bổ sung (URL)</label>
            <div className="flex gap-2">
              <Input ref={imgUrlRef} className="flex-1" placeholder="Dán URL ảnh và Enter" onKeyDown={handleImgKeyDown} />
              <Button type="button" variant="outline" onClick={handleAddImageClick} className="inline-flex items-center gap-1">
                <Plus className="size-4" aria-hidden />
                Thêm
              </Button>
            </div>
            {images.length > 0 && (
              <ul className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3" onDrop={onDrop} onDragOver={allowDrop}>
                {images.map((u, i) => (
                  <li key={u} className="relative group border rounded overflow-hidden" draggable data-index={i} data-url={u} onDragStart={handleImageDragStart}>
                    <div className="relative w-full h-28">
                      <Image src={u} alt="image" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" unoptimized />
                    </div>
                    <button type="button" className="absolute top-1 right-1 bg-white/90 border rounded px-1 text-xs hidden group-hover:flex items-center gap-1" data-url={u} onClick={handleRemoveImageClick}>
                      <Trash2 className="size-3" aria-hidden />
                      Xóa
                    </button>
                    <div className="pointer-events-none absolute left-2 top-2 hidden group-hover:block">
                      <div className="rounded border bg-white p-1 shadow-xl">
                        <Image src={u} alt="preview" width={192} height={192} className="w-48 h-48 object-cover rounded" unoptimized />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Separator />
        {/* Optional Variants section */}
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm mb-1 font-medium">Biến thể (tuỳ chọn)</label>
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
              onPriceChange={(v) => {
                setNvPrice(v);
                const p = Number(v);
                if (nvDiscountMode === "PERCENT") {
                  const pct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
                  if (Number.isFinite(p) && p >= 0 && pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
                    const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
                    setNvDiscountAmount(String(amt));
                  }
                }
              }}
              onDiscountPercentChange={(v) => {
                setNvDiscountPrice(v);
                const pct = Number(v);
                const p = Number(nvPrice);
                if (Number.isFinite(pct) && pct >= 0 && pct <= 100 && Number.isFinite(p) && p >= 0) {
                  const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
                  setNvDiscountAmount(String(amt));
                }
              }}
              onDiscountAmountChange={setNvDiscountAmount}
              onDiscountModeChange={setNvDiscountMode}
              onStockChange={setNvStock}
              onAdd={addVariantLocal}
            />
          </div>
          {variants.length > 0 ? (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Giá khuyến mãi</TableHead>
                    <TableHead>Kho</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((v, i) => (
                    <TableRow key={`${v.name}-${i}`}>
                      <TableCell>{v.name}</TableCell>
                      <TableCell>{v.sku}</TableCell>
                      <TableCell>{v.price}</TableCell>
                      <TableCell>{v.discountPrice ?? "—"}</TableCell>
                      <TableCell>{v.stockQuantity}</TableCell>
                      <TableCell>
                        <Button type="button" variant="ghost" data-index={i} onClick={handleVariantRowDelete} className="inline-flex items-center gap-1">
                          <Trash2 className="size-4" aria-hidden />
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Chưa có biến thể nào. Nhấn “+ Thêm biến thể” để thêm.</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading || !!slugError} className="inline-flex items-center gap-1">
            <Save className="size-4" aria-hidden />
            {loading ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={handleBackClick} className="inline-flex items-center gap-1">
            <X className="size-4" aria-hidden />
            Hủy
          </Button>
        </div>
        </form>

        <aside className="lg:col-span-4 ">
          <div className="rounded-lg border p-4 top-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Thêm sản phẩm</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Nhập Tên, Slug (tự sinh từ Tên), Mô tả, Danh mục, Ảnh.</li>
                  <li>Nhấn “Lưu” để tạo sản phẩm.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Xem nhanh ảnh</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="group w-14 h-14 rounded overflow-hidden bg-neutral-100 border">
                  {(
                    thumbnailObjectUrl || images[0]
                  ) ? (
                    <div className="relative w-14 h-14">
                      <Image
                        src={(thumbnailObjectUrl || images[0]) as string}
                        alt={name || "preview"}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-neutral-200" />
                  )}
                </div>
                {(thumbnailObjectUrl || images[0]) && (
                  <div className="pointer-events-none absolute left-16 top-0 hidden group-hover:block">
                    <div className="rounded border bg-white p-1 shadow-xl">
                      <Image
                        src={(thumbnailObjectUrl || images[0]) as string}
                        alt={name || "preview"}
                        width={192}
                        height={192}
                        className="w-48 h-48 object-cover rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-neutral-600">Ảnh xem nhanh (ưu tiên file thumbnail vừa chọn, sau đó ảnh đầu tiên)</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
