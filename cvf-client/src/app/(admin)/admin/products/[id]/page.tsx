"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { Product, ProductVariant, UpdateProductPayload } from "@/type/product";
import { categoryService, type Category } from "@/service/category.service";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import slugify from "slugify";
import { VariantsTable } from "./components/VariantsTable";
import { AddVariantDialog, EditVariantDialog } from "./components/VariantDialogs";
import { Package, Save, X, Plus, Trash2 } from "lucide-react";
import { validateAndSuggestVariantName, extractBaseNameFromVariant } from "@/utils/variantNameHelper";

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
  const [nvBaseName, setNvBaseName] = useState(""); 
  const [nvSku, setNvSku] = useState("");
  const [nvPrice, setNvPrice] = useState<string>("");
  const [nvDiscountPrice, setNvDiscountPrice] = useState<string>("");
  const [nvDiscountAmount, setNvDiscountAmount] = useState<string>("");
  const [nvDiscountMode, setNvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [nvStock, setNvStock] = useState<string>("");
  const [nvWeight, setNvWeight] = useState<string>(""); 
  const [addingVariant, setAddingVariant] = useState(false);

  const [evOpen, setEvOpen] = useState(false);
  const [evSaving, setEvSaving] = useState(false);
  const [evVid, setEvVid] = useState<string>("");
  const [evBaseName, setEvBaseName] = useState(""); 
  const [evSku, setEvSku] = useState("");
  const [evPrice, setEvPrice] = useState<string>("");
  const [evDiscountPrice, setEvDiscountPrice] = useState<string>("");
  const [evDiscountAmount, setEvDiscountAmount] = useState<string>("");
  const [evDiscountMode, setEvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [evStock, setEvStock] = useState<string>("");
  const [evWeight, setEvWeight] = useState<string>(""); 

  const nvFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(nvBaseName, nvWeight);
    return nameValidation.suggestedName || nvBaseName;
  }, [nvBaseName, nvWeight]);

  const evFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(evBaseName, evWeight);
    return nameValidation.suggestedName || evBaseName;
  }, [evBaseName, evWeight]);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(c => (c.name + " " + (c.slug || "")).toLowerCase().includes(q));
  }, [categories, categoryQuery]);

  const thumbnailObjectUrl = useMemo(() => (thumbnail ? URL.createObjectURL(thumbnail) : null), [thumbnail]);
  useEffect(() => {
    return () => { if (thumbnailObjectUrl) URL.revokeObjectURL(thumbnailObjectUrl); };
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
    if (!s) { setSlugError(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const existing = await productService.getBySlug(s).catch(() => null);
        setSlugError(existing && existing.id !== data.id ? "Slug đã tồn tại" : null);
      } catch { setSlugError(null); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [data]);

  const addImage = useCallback((url: string) => {
    const u = url.trim();
    if (!u) return;
    setImages((prev) => Array.from(new Set([...(prev || []), u])));
  }, []);
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

  const refreshVariants = useCallback(async () => {
    if (!id) return;
    const vs = await productService.listVariants(id);
    setData((d) => (d ? ({ ...(d as Product), variants: vs }) : d));
  }, [id]);

  const onVariantNameBlur = useCallback(async (vid: string, value: string) => {
    const v = data?.variants?.find(x => x.id === vid);
    if (!data || !v || value === v.name) return;
    try {
      await productService.updateVariant(id, vid, { name: value });
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu tên biến thể" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu tên biến thể";
      showErrorToast({ title: "Lỗi lưu tên biến thể", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantStockSave = useCallback(async (vid: string, num: number) => {
    if (!Number.isFinite(num) || num < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Kho phải là số không âm" }); return; }
    const v = data?.variants?.find(x => x.id === vid) as ProductVariant | undefined;
    const current = v?.stockQuantity ?? 0;
    if (!data || current === num) return;
    try {
      await productService.updateVariant(id, vid, { stockQuantity: num });
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu kho" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu kho";
      showErrorToast({ title: "Lỗi lưu kho", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantDiscountSave = useCallback(async (vid: string, discountedPrice: number | null) => {
    const v = data?.variants?.find(x => x.id === vid) as ProductVariant | undefined;
    if (!data || !v) return;
    const priceNum = Number(v.price ?? 0);
    let payload: Partial<Omit<ProductVariant, "id">> = {};
    if (discountedPrice == null) {
      payload = { discountPrice: null };
    } else {
      const safe = Math.max(0, Math.min(Number(discountedPrice), priceNum));
      if (v.discountPrice != null && Number(v.discountPrice) === safe) return;
      payload = { discountPrice: safe };
    }
    try {
      await productService.updateVariant(id, vid, payload);
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu khuyến mãi" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu khuyến mãi";
      showErrorToast({ title: "Lỗi lưu khuyến mãi", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantSkuBlur = useCallback(async (vid: string, value: string) => {
    const v = data?.variants?.find(x => x.id === vid);
    if (!data || !v || (v.sku || "") === value) return;
    try {
      await productService.updateVariant(id, vid, { sku: value || undefined });
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu SKU" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu SKU";
      showErrorToast({ title: "Lỗi lưu SKU", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantPriceBlur = useCallback(async (vid: string, num: number) => {
    if (!Number.isFinite(num) || num < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá phải là số không âm" }); return; }
    const v = data?.variants?.find(x => x.id === vid) as ProductVariant | undefined;
    const current = v?.price;
    if (!data || current === num) return;
    try {
      await productService.updateVariant(id, vid, { price: num });
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu giá" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu giá";
      showErrorToast({ title: "Lỗi lưu giá", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantStockBlur = useCallback(async (vid: string, num: number) => {
    if (!Number.isFinite(num) || num < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Kho phải là số không âm" }); return; }
    const v = data?.variants?.find(x => x.id === vid) as ProductVariant | undefined;
    const current = v?.stockQuantity ?? 0;
    if (!data || current === num) return;
    try {
      await productService.updateVariant(id, vid, { stockQuantity: num });
      await refreshVariants();
      showSuccessToast({ title: "Đã lưu kho" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi lưu kho";
      showErrorToast({ title: "Lỗi lưu kho", message: msg });
    }
  }, [data, id, refreshVariants]);

  const onVariantEdit = useCallback((vid: string) => {
    const v = data?.variants?.find(x => x.id === vid) as ProductVariant | undefined;
    if (!v) return;
    
    const baseName = extractBaseNameFromVariant(v.name || "");
    const extractedWeight = v.weight || 0; 
    
    setEvVid(v.id);
    setEvBaseName(baseName);
    setEvWeight(String(extractedWeight));
    setEvSku(v.sku || "");
    setEvPrice(String(v.price ?? 0));
    if (v.discountPrice != null && v.price) {
      const p = Number(v.price) || 0;
      const dp = Number(v.discountPrice);
      const pct = p > 0 && dp < p ? Math.round((1 - dp / p) * 100) : 0;
      setEvDiscountPrice(pct ? String(pct) : "");
      setEvDiscountAmount(String(dp));
      setEvDiscountMode("AMOUNT");
    } else { setEvDiscountPrice(""); setEvDiscountAmount(""); }
    setEvStock(String(v.stockQuantity ?? 0));
    setEvOpen(true);
  }, [data]);

  const onVariantDelete = useCallback(async (vid: string) => {
    try {
      await productService.removeVariant(id, vid);
      await refreshVariants();
      showSuccessToast({ title: "Đã xóa biến thể" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("Cannot delete variant because it is associated with existing orders")) {
        showErrorToast({ title: "Không thể xóa biến thể", message: "Đang được liên kết với các đơn hàng hiện có." });
      } else {
        showErrorToast({ title: "Không thể xóa biến thể", message: msg || "Không thể xóa biến thể" });
      }
    }
  }, [id, refreshVariants]);

  const onAddVariant = useCallback(async () => {
    if (!data) return;
    try {
      setAddingVariant(true);
      const priceNum = Number(nvPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá phải là số không âm" }); setAddingVariant(false); return; }
      const discountPct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
      if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Phần trăm giảm giá phải từ 0 đến 100" }); setAddingVariant(false); return; }
      const discountAmountNum = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
      if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá sau giảm phải từ 0 đến Giá" }); setAddingVariant(false); return; }
      const discountedPrice = nvDiscountMode === "AMOUNT"
        ? (discountAmountNum == null ? null : discountAmountNum)
        : (discountPct == null ? null : Math.max(0, Math.round(priceNum * (1 - (discountPct / 100)))));
      const payload: Omit<ProductVariant, "id"> & { stockQuantity?: number } = {
        name: nvFinalName,
        sku: nvSku || "",
        price: priceNum,
        ...(discountedPrice != null ? { discountPrice: discountedPrice } : {}),
        stockQuantity: nvStock === "" ? 0 : Number(nvStock),
      };
      await productService.addVariant(id, payload);
      await refreshVariants();
      setNvBaseName(""); setNvSku(""); setNvPrice(""); setNvDiscountPrice(""); setNvDiscountAmount(""); setNvDiscountMode("PERCENT"); setNvStock(""); setNvWeight("");
      showSuccessToast({ title: "Đã thêm biến thể" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể thêm biến thể";
      showErrorToast({ title: "Không thể thêm biến thể", message: msg });
    } finally { setAddingVariant(false); }
  }, [data, id, nvFinalName, nvSku, nvPrice, nvDiscountPrice, nvDiscountAmount, nvDiscountMode, nvStock, nvWeight, refreshVariants]);

  const onEditVariantSave = useCallback(async () => {
    if (!data || !evVid) return;
    const priceNum = Number(evPrice);
    if (!Number.isFinite(priceNum) || priceNum < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá phải là số không âm" }); return; }
    const discountPct = evDiscountPrice === "" ? null : Number(evDiscountPrice);
    if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Phần trăm giảm giá phải từ 0 đến 100" }); return; }
    const discountAmountNum = evDiscountAmount === "" ? null : Number(evDiscountAmount);
    if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá sau giảm phải từ 0 đến Giá" }); return; }
    const discountedPrice = discountAmountNum != null
      ? discountAmountNum
      : (discountPct == null ? null : Math.max(0, Math.round(priceNum * (1 - (discountPct / 100)))));
    const stockNum = evStock === "" ? 0 : Number(evStock);
    if (!Number.isFinite(stockNum) || stockNum < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Kho phải là số không âm" }); return; }
    try {
      setEvSaving(true);
      await productService.updateVariant(id, evVid, {
        name: evFinalName,
        sku: evSku || undefined,
        price: priceNum,
        ...(discountedPrice != null ? { discountPrice: discountedPrice } : {}),
        stockQuantity: stockNum,
      });
      await refreshVariants();
      showSuccessToast({ title: "Đã cập nhật biến thể" });
      setEvOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật biến thể";
      showErrorToast({ title: "Không thể cập nhật biến thể", message: msg });
    } finally { setEvSaving(false); }
  }, [data, evVid, evFinalName, evSku, evPrice, evDiscountPrice, evDiscountAmount, evStock, evWeight, id, refreshVariants]);


  const handleEvPriceChange = useCallback((v: string) => {
    setEvPrice(v);
    const p = Number(v);
    const pct = evDiscountPrice === "" ? null : Number(evDiscountPrice);
    if (Number.isFinite(p) && p >= 0 && pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
      const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
      setEvDiscountAmount(String(amt));
    }
  }, [evDiscountPrice]);

  const handleEvDiscountPercentChange = useCallback((v: string) => {
    setEvDiscountPrice(v);
    const pct = v === "" ? null : Number(v);
    const p = Number(evPrice);
    if (pct == null) { setEvDiscountAmount(""); return; }
    if (Number.isFinite(p) && p >= 0 && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
      const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
      setEvDiscountAmount(String(amt));
    }
  }, [evPrice]);

  const handleEvDiscountAmountChange = useCallback((v: string) => {
    setEvDiscountAmount(v);
    if (v === "") { setEvDiscountPrice(""); return; }
    const amt = Number(v);
    const p = Number(evPrice);
    if (Number.isFinite(p) && p > 0 && Number.isFinite(amt) && amt >= 0 && amt <= p) {
      const pct = Math.round((1 - amt / p) * 100);
      setEvDiscountPrice(String(pct));
    }
  }, [evPrice]);

  const handleEvDiscountModeChange = useCallback((v: "PERCENT" | "AMOUNT") => {
    setEvDiscountMode(v);
    const p = Number(evPrice);
    if (!Number.isFinite(p) || p < 0) return;
    if (v === "AMOUNT") {
      const pct = evDiscountPrice === "" ? null : Number(evDiscountPrice);
      if (pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
        const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
        setEvDiscountAmount(String(amt));
      }
    } else {
      const amt = evDiscountAmount === "" ? null : Number(evDiscountAmount);
      if (amt != null && Number.isFinite(amt) && amt >= 0 && amt <= p && p > 0) {
        const pct = Math.round((1 - amt / p) * 100);
        setEvDiscountPrice(String(pct));
      }
    }
  }, [evPrice, evDiscountPrice, evDiscountAmount]);

  const handleNvDiscountModeChange = useCallback((v: "PERCENT" | "AMOUNT") => {
    setNvDiscountMode(v);
    const p = Number(nvPrice);
    if (!Number.isFinite(p) || p < 0) return;
    if (v === "AMOUNT") {
      const pct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
      if (pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
        const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
        setNvDiscountAmount(String(amt));
      }
    } else {
      const amt = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
      if (amt != null && Number.isFinite(amt) && amt >= 0 && amt <= p && p > 0) {
        const pct = Math.round((1 - amt / p) * 100);
        setNvDiscountPrice(String(pct));
      }
    }
  }, [nvPrice, nvDiscountPrice, nvDiscountAmount]);

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

  const handleImgUrlKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = imgUrlRef.current?.value || '';
      addImage(val);
      if (imgUrlRef.current) imgUrlRef.current.value = '';
    }
  }, [addImage]);

  const handleAddImageButtonClick = useCallback(() => {
    const val = imgUrlRef.current?.value || '';
    addImage(val);
    if (imgUrlRef.current) imgUrlRef.current.value = '';
  }, [addImage]);

  const handleImageDragStart = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    const index = Number((e.currentTarget.dataset.index as string) ?? '-1');
    const url = e.currentTarget.dataset.url as string;
    e.dataTransfer.setData('text/plain', JSON.stringify({ index, url }));
  }, []);

  const handleRemoveImageClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = e.currentTarget.dataset.url as string;
    if (!url) return;
    try {
      const updated = await productService.removeImage(id, url);
      setImages(updated.images || []);
      showSuccessToast({ title: "Đã xóa ảnh" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể xóa ảnh";
      showErrorToast({ title: "Không thể xóa ảnh", message: msg });
    }
  }, [id]);

  const handleFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) { setPendingFiles([]); setPendingPreviews([]); return; }
    const previews = files.map((f) => URL.createObjectURL(f));
    setPendingPreviews((old) => { old.forEach((u) => URL.revokeObjectURL(u)); return previews; });
    setPendingFiles(files);
  }, []);

  const handleUploadImages = useCallback(async () => {
    if (!pendingFiles.length) return;
    try {
      setUploading(true);
      const updated = await productService.addImages(id, pendingFiles);
      setImages(updated.images || []);
      setPendingFiles([]);
      setPendingPreviews((old) => { old.forEach((u) => URL.revokeObjectURL(u)); return []; });
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
      <h1 className="text-xl font-bold mb-2 inline-flex items-center gap-2">
        <Package className="size-5 text-muted-foreground" aria-hidden />
        Sửa sản phẩm
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
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <Input className="w-full" value={data.name} onChange={handleNameChange} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <Input className="w-full" value={data.slug} onChange={handleSlugChange} required aria-invalid={!!slugError} />
            {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea className="w-full border rounded p-2" value={data.description ?? ""} onChange={handleDescriptionChange} rows={4} />
          </div>
          <div className="flex items-center gap-2">
            <input id="isActive" type="checkbox" checked={data.isActive ?? true} onChange={handleIsActiveChange} />
            <label htmlFor="isActive">Hiển thị</label>
          </div>
        </div>
        <Separator />
        <div className="rounded-lg border p-4 space-y-3">
          <label className="block text-sm mb-1">Thumbnail</label>
          <div className="border-2 border-dashed rounded-md p-4 bg-muted/20 hover:bg-muted/30 transition">
            <input type="file" accept="image/*" onChange={handleThumbnailFileChange} />
            <p className="text-xs text-muted-foreground mt-1">Kéo & thả ảnh vào đây hoặc bấm để chọn file.</p>
          </div>
          <div>
            <label className="block text-sm mb-1">Ảnh bổ sung (URL)</label>
            <div className="flex gap-2">
              <Input ref={imgUrlRef} className="flex-1" placeholder="Dán URL ảnh và Enter" onKeyDown={handleImgUrlKeyDown} />
              <Button type="button" variant="outline" onClick={handleAddImageButtonClick} className="inline-flex items-center gap-1">
                <Plus className="size-4" aria-hidden />
                Thêm
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Tải ảnh từ máy (tối đa 10 ảnh mỗi lần)</label>
              <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
              {pendingPreviews.length > 0 && (
                <div>
                  <div className="mt-2 grid grid-cols-3 md:grid-cols-4 gap-2">
                    {pendingPreviews.map((u, i) => (
                      <div key={u + i} className="relative border rounded overflow-hidden">
                        <div className="relative w-full h-24">
                          <Image src={u} alt={`preview-${i}`} fill className="object-cover" unoptimized />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Button type="button" onClick={handleUploadImages} disabled={uploading} className="inline-flex items-center gap-1">
                      {uploading ? "Đang tải…" : "Tải lên ảnh"}
                    </Button>
                  </div>
                </div>
              )}
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
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm mb-1">Biến thể</label>
            <AddVariantDialog
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
                } else {
                  const amt = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
                  if (amt == null) { setNvDiscountPrice(""); }
                  else if (Number.isFinite(p) && p > 0 && Number.isFinite(amt) && amt >= 0 && amt <= p) {
                    const pct = Math.round((1 - amt / p) * 100);
                    setNvDiscountPrice(String(pct));
                  }
                }
              }}
              onDiscountPercentChange={(v) => {
                setNvDiscountPrice(v);
                const pct = v === "" ? null : Number(v);
                const p = Number(nvPrice);
                if (pct == null) { setNvDiscountAmount(""); return; }
                if (Number.isFinite(p) && p >= 0 && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
                  const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
                  setNvDiscountAmount(String(amt));
                }
              }}
              onDiscountAmountChange={(v) => {
                setNvDiscountAmount(v);
                if (v === "") { setNvDiscountPrice(""); return; }
                const amt = Number(v);
                const p = Number(nvPrice);
                if (Number.isFinite(p) && p > 0 && Number.isFinite(amt) && amt >= 0 && amt <= p) {
                  const pct = Math.round((1 - amt / p) * 100);
                  setNvDiscountPrice(String(pct));
                }
              }}
              onDiscountModeChange={handleNvDiscountModeChange}
              onStockChange={setNvStock}
              onAdd={onAddVariant}
            />
          </div>
          <VariantsTable
            variants={data?.variants || []}
            onNameBlur={onVariantNameBlur}
            onSkuBlur={onVariantSkuBlur}
            onPriceBlur={onVariantPriceBlur}
            onStockBlur={onVariantStockBlur}
            onStockSave={onVariantStockSave}
            onDiscountSave={onVariantDiscountSave}
            onEdit={onVariantEdit}
            onDelete={onVariantDelete}
          />
        </div>

        <EditVariantDialog
          open={evOpen}
          onOpenChange={setEvOpen}
          baseName={evBaseName}
          sku={evSku}
          price={evPrice}
          discountPercent={evDiscountPrice}
          discountAmount={evDiscountAmount}
          discountMode={evDiscountMode}
          stock={evStock}
          weight={evWeight}
          saving={evSaving}
          onBaseNameChange={setEvBaseName}
          onSkuChange={setEvSku}
          onPriceChange={handleEvPriceChange}
          onDiscountPercentChange={handleEvDiscountPercentChange}
          onDiscountAmountChange={handleEvDiscountAmountChange}
          onDiscountModeChange={handleEvDiscountModeChange}
          onStockChange={setEvStock}
          onWeightChange={setEvWeight}
          onSave={onEditVariantSave}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={saving || !!slugError} className="inline-flex items-center gap-1">
            <Save className="size-4" aria-hidden />
            {saving ? "Đang lưu…" : "Lưu"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancelClick} className="inline-flex items-center gap-1">
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
                  <li>Nhấn “Lưu” để tạo/cập nhật sản phẩm.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Biến thể</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Nhấn “+ Thêm biến thể” để tạo: Tên, SKU, Giá, Giảm giá (%), Kho.</li>
                  <li>Chỉnh sửa nhanh trực tiếp trên bảng (Tên, SKU, Giá, Kho) bằng cách sửa và rời ô (blur) để lưu.</li>
                  <li>Nhấn “Sửa” để mở hộp thoại chỉnh sửa chi tiết, “Xóa” để xóa biến thể.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Xóa/Sửa sản phẩm</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Sửa các trường và nhấn “Lưu”.</li>
                  <li>Việc xóa sản phẩm có thể bị chặn nếu có đơn hàng liên quan. Khi đó, hệ thống sẽ tự động ẩn sản phẩm (isActive = false).</li>
                </ul>
              </div>
              <div className="border-t pt-3">
                <p className="font-medium text-foreground">Lưu ý khi xóa biến thể</p>
                <p className="mt-1">Nếu thấy lỗi “Không thể xóa biến thể vì đang được liên kết với các đơn hàng hiện có.” thì biến thể đang được dùng trong đơn hàng, không thể xóa để đảm bảo tính toàn vẹn dữ liệu.</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="font-semibold mb-2">Xem nhanh ảnh</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="group w-14 h-14 rounded overflow-hidden bg-neutral-100 border">
                  {(
                    thumbnailObjectUrl || data.thumbnailUrl || images[0]
                  ) ? (
                    <div className="relative w-14 h-14">
                      <Image
                        src={(thumbnailObjectUrl || data.thumbnailUrl || images[0]) as string}
                        alt={data.name}
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
                {(thumbnailObjectUrl || data.thumbnailUrl || images[0]) && (
                  <div className="pointer-events-none absolute left-16 top-0 hidden group-hover:block">
                    <div className="rounded border bg-white p-1 shadow-xl">
                      <Image
                        src={(thumbnailObjectUrl || data.thumbnailUrl || images[0]) as string}
                        alt={data.name}
                        width={192}
                        height={192}
                        className="w-48 h-48 object-cover rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-sm text-neutral-600">Ảnh xem nhanh (ưu tiên file thumbnail vừa chọn, sau đó thumbnail hiện tại hoặc ảnh đầu tiên)</div>
            </div>
          </div>
        </aside>
      </div>

      
    </div>
  );
}
