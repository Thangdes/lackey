"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { Product, ProductVariant } from "@/type/product";
import { getDiscountedVariants, getMinPrice, getBestDiscountVariant } from "@/utils/priceHelper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { PackageSearch, Plus, Pencil, Trash2, Search, ChevronRight, ChevronDown, Save } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground p-2">Đang tải…</div>}>
      <AdminProductsClient />
    </Suspense>
  );
}

function AdminProductsClient() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [stockMap, setStockMap] = useState<Record<string, { total: number; variantCount: number; low: boolean }>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [variantsMap, setVariantsMap] = useState<Record<string, ProductVariant[]>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [savingVariant, setSavingVariant] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const hydrated = useRef(false);

  const LOW_THRESHOLD = 5;
  const VND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);
  type StockFilter = "all" | "out" | "low" | "in";
  type StockSort = "stockTotalAsc" | "stockTotalDesc" | "variantCountAsc" | "variantCountDesc" | "discountDesc" | "discountAsc";
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [stockSort, setStockSort] = useState<StockSort>("stockTotalDesc");
  type DiscountFilter = "all" | "has" | "none";
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productService.list({ page, limit, q: query.trim() || undefined });
      setItems(res.data || []);
      setTotal(res.meta?.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, query]);

  const handleVariantStockSave = useCallback(async (productId: string, variant: ProductVariant, stockQuantity: number) => {
    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Số lượng phải ≥ 0" }); return; }
    setSavingVariant((s) => ({ ...s, [variant.id]: true }));
    try {
      await productService.updateVariant(productId, variant.id, { stockQuantity });
      const vs = await productService.listVariants(productId);
      setVariantsMap((m) => ({ ...m, [productId]: vs }));
      const total = vs.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
      const variantCount = vs.length;
      setStockMap((m) => ({ ...m, [productId]: { total, variantCount, low: total > 0 && total <= LOW_THRESHOLD } }));
      showSuccessToast({ title: "Đã cập nhật số lượng" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật số lượng";
      showErrorToast({ title: "Cập nhật thất bại", message: msg });
    } finally {
      setSavingVariant((s) => ({ ...s, [variant.id]: false }));
    }
  }, []);

  const handleVariantDiscountSave = useCallback(async (productId: string, variant: ProductVariant, discountPrice: number) => {
    if (!Number.isFinite(discountPrice) || discountPrice < 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá khuyến mãi phải ≥ 0" }); return; }
    if (discountPrice > (variant.price ?? 0)) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá khuyến mãi phải ≤ giá bán" }); return; }
    setSavingVariant((s) => ({ ...s, [variant.id]: true }));
    try {
      await productService.updateVariant(productId, variant.id, { discountPrice });
      const vs = await productService.listVariants(productId);
      setVariantsMap((m) => ({ ...m, [productId]: vs }));
      const total = vs.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
      const variantCount = vs.length;
      setStockMap((m) => ({ ...m, [productId]: { total, variantCount, low: total > 0 && total <= LOW_THRESHOLD } }));
      showSuccessToast({ title: "Đã cập nhật giá khuyến mãi" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật giá khuyến mãi";
      showErrorToast({ title: "Cập nhật thất bại", message: msg });
    } finally {
      setSavingVariant((s) => ({ ...s, [variant.id]: false }));
    }
  }, []);

  const handleApplyDiscountPercent = useCallback((productId: string, variant: ProductVariant, percent: number) => {
    const price = variant.price ?? 0;
    if (price <= 0) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá gốc không hợp lệ" }); return; }
    if (!Number.isFinite(percent) || percent < 1 || percent > 100) { showErrorToast({ title: "Dữ liệu không hợp lệ", message: "% khuyến mãi phải từ 1 đến 100" }); return; }
    const discountPrice = Math.max(0, Math.round((price * (100 - percent)) / 100));
    handleVariantDiscountSave(productId, variant, discountPrice);
  }, [handleVariantDiscountSave]);

  const getRemoveDiscountClick = useCallback((productId: string, variant: ProductVariant) =>
    async () => {
      setSavingVariant((s) => ({ ...s, [variant.id]: true }));
      try {
        await productService.updateVariant(productId, variant.id, { discountPrice: null as unknown as number });
        const vs = await productService.listVariants(productId);
        setVariantsMap((m) => ({ ...m, [productId]: vs }));
        const total = vs.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
        const variantCount = vs.length;
        setStockMap((m) => ({ ...m, [productId]: { total, variantCount, low: total > 0 && total <= LOW_THRESHOLD } }));
        showSuccessToast({ title: "Đã bỏ khuyến mãi" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Không thể bỏ khuyến mãi";
        showErrorToast({ title: "Thao tác thất bại", message: msg });
      } finally {
        setSavingVariant((s) => ({ ...s, [variant.id]: false }));
      }
    }
  , []);

  const getPercentKeyDown = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const raw = (e.currentTarget as HTMLInputElement).value;
        const pct = Number(raw);
        if (!Number.isFinite(pct) || pct < 1 || pct > 100) {
          showErrorToast({ title: "Dữ liệu không hợp lệ", message: "% khuyến mãi phải từ 1 đến 100" });
          return;
        }
        handleApplyDiscountPercent(productId, variant, pct);
      }
    }
  , [handleApplyDiscountPercent]);

  const getPercentApplyClick = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const input = (e.currentTarget.previousSibling as HTMLInputElement);
      const raw = input?.value ?? "";
      const pct = Number(raw);
      if (!Number.isFinite(pct) || pct < 1 || pct > 100) {
        showErrorToast({ title: "Dữ liệu không hợp lệ", message: "% khuyến mãi phải từ 1 đến 100" });
        return;
      }
      handleApplyDiscountPercent(productId, variant, pct);
    }
  , [handleApplyDiscountPercent]);

  const getStockInputKeyDown = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const raw = (e.currentTarget as HTMLInputElement).value;
        const num = raw === "" ? 0 : Number(raw);
        handleVariantStockSave(productId, variant, num);
      }
    }
  , [handleVariantStockSave]);

  const getStockSaveClick = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const input = (e.currentTarget.previousSibling as HTMLInputElement);
      const raw = input?.value ?? "";
      const num = raw === "" ? 0 : Number(raw);
      handleVariantStockSave(productId, variant, num);
    }
  , [handleVariantStockSave]);

  const askDelete = useCallback((id: string) => { setPendingDeleteId(id); setConfirmOpen(true); }, []);
  const onConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setConfirmOpen(false);
    setPendingDeleteId(null);
    try {
      await productService.delete(id);
      toast.success("Đã xóa sản phẩm");
      await load();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Không thể xóa sản phẩm";
      if (msg.toLowerCase().includes("variants are associated with existing orders")) {
        try {
          await productService.update(id, { isActive: false });
          toast.success("Sản phẩm đã được ẩn do đang liên quan tới đơn hàng");
          await load();
        } catch (updateError) {
          const updateMsg = updateError instanceof Error ? updateError.message : "Không thể ẩn sản phẩm";
          toast.error(updateMsg);
        }
      } else {
        toast.error(msg);
      }
    }
  }, [pendingDeleteId, load]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleAskDeleteClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    if (id) askDelete(id);
  }, [askDelete]);

  const handleCancelDialog = useCallback(() => { setConfirmOpen(false); }, []);

  const handleToggleActive = useCallback(async (p: Product) => {
    try {
      await productService.update(p.id, { isActive: !p.isActive });
      setItems((prev) => prev.map((it) => it.id === p.id ? { ...it, isActive: !p.isActive } : it));
      showSuccessToast({ title: !p.isActive ? "Đã hiển thị sản phẩm" : "Đã ẩn sản phẩm" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật trạng thái";
      showErrorToast({ title: "Cập nhật thất bại", message: msg });
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setQuery("");
    setStockFilter("all");
    setDiscountFilter("all");
    setStockSort("stockTotalDesc");
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = items.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.slug || "").toLowerCase().includes(q)
    );
  });

  const filteredByStock = filtered.filter((p) => {
    const meta = stockMap[p.id];
    if (!meta) return stockFilter === "all"; 
    if (stockFilter === "out") return meta.total === 0;
    if (stockFilter === "low") return meta.total > 0 && meta.total <= LOW_THRESHOLD;
    if (stockFilter === "in") return meta.total > LOW_THRESHOLD;
    return true;
  });

  const hasDiscount = (pid: string) => {
    const vs = variantsMap[pid] || [];
    return getDiscountedVariants(vs).length > 0;
  };

  const filteredByDiscount = filteredByStock.filter((p) => {
    if (discountFilter === "all") return true;
    const has = hasDiscount(p.id);
    return discountFilter === "has" ? has : !has;
  });

  const bestDiscountPct = (pid: string) => {
    const vs = variantsMap[pid] || [];
    const best = getBestDiscountVariant(vs);
    return best ? best.pricing.discountPercent : 0;
  };

  const sorted = [...filteredByDiscount].sort((a, b) => {
    const ma = stockMap[a.id];
    const mb = stockMap[b.id];
    const ta = ma?.total ?? -1;
    const tb = mb?.total ?? -1;
    const va = ma?.variantCount ?? -1;
    const vb = mb?.variantCount ?? -1;
    const da = bestDiscountPct(a.id);
    const db = bestDiscountPct(b.id);
    switch (stockSort) {
      case "stockTotalAsc": return ta - tb;
      case "stockTotalDesc": return tb - ta;
      case "variantCountAsc": return va - vb;
      case "variantCountDesc": return vb - va;
      case "discountAsc": return da - db;
      case "discountDesc": return db - da;
      default: return 0;
    }
  });

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!items.length) { setStockMap({}); setVariantsMap({}); return; }
      setStockLoading(true);
      try {
        const entries = await Promise.all(
          items.map(async (p) => {
            try {
              const vs = await productService.listVariants(p.id);
              const total = vs.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
              const variantCount = vs.length;
              const low = total > 0 && total <= LOW_THRESHOLD;
              return [p.id, { total, variantCount, low }, vs] as const;
            } catch {
              return [p.id, { total: 0, variantCount: 0, low: true }, []] as const;
            }
          })
        );
        if (!cancelled) {
          const mapEntries = entries.map(([id, meta]) => [id, meta] as const);
          const vEntries = entries.map(([id, , vs]) => [id, vs] as const);
          setStockMap(Object.fromEntries(mapEntries) as Record<string, { total: number; variantCount: number; low: boolean }>);
          setVariantsMap(Object.fromEntries(vEntries) as Record<string, ProductVariant[]>);
        }
      } finally {
        if (!cancelled) setStockLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [items]);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    const pageIds = items.map((p) => p.id);
    setSelectedIds((prev) => {
      const next = { ...prev };
      for (const id of pageIds) next[id] = checked;
      return next;
    });
  }, [items]);

  const handleToggleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const selectedOnPage = useMemo(() => items.filter((p) => selectedIds[p.id]).map((p) => p.id), [items, selectedIds]);
  const anySelected = selectedOnPage.length > 0;

  const handleBulkShow = useCallback(async () => {
    const ids = selectedOnPage;
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => productService.update(id, { isActive: true })));
      setItems((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, isActive: true } : p)));
      showSuccessToast({ title: "Đã hiển thị các sản phẩm đã chọn" });
    } catch {
      showErrorToast({ title: "Không thể cập nhật một số sản phẩm" });
    }
  }, [selectedOnPage]);

  const handleBulkHide = useCallback(async () => {
    const ids = selectedOnPage;
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => productService.update(id, { isActive: false })));
      setItems((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, isActive: false } : p)));
      showSuccessToast({ title: "Đã ẩn các sản phẩm đã chọn" });
    } catch {
      showErrorToast({ title: "Không thể cập nhật một số sản phẩm" });
    }
  }, [selectedOnPage]);

  const handleBulkDeleteAsk = useCallback(() => setBulkConfirmOpen(true), []);
  const onConfirmBulkDelete = useCallback(async () => {
    const ids = selectedOnPage;
    setBulkConfirmOpen(false);
    if (!ids.length) return;
    try {
      for (const id of ids) {
        try {
          await productService.delete(id);
        } catch (error) {
          const msg = error instanceof Error ? error.message : "";
          if (msg.toLowerCase().includes("variants are associated with existing orders")) {
            await productService.update(id, { isActive: false });
          } else {
            throw error;
          }
        }
      }
      showSuccessToast({ title: "Đã xóa/ẩn sản phẩm đã chọn" });
      await load();
      setSelectedIds({});
    } catch {
      showErrorToast({ title: "Không thể xóa một số sản phẩm" });
    }
  }, [selectedOnPage, load]);

  useEffect(() => {
    if (hydrated.current) return;
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const qp = sp.get("q");
    const sf = sp.get("stockFilter");
    const df = sp.get("discountFilter");
    const ss = sp.get("stockSort");
    const pg = sp.get("page");
    const lm = sp.get("limit");
    if (qp !== null) setQuery(qp);
    if (sf === "all" || sf === "out" || sf === "low" || sf === "in") setStockFilter(sf as StockFilter);
    if (df === "all" || df === "has" || df === "none") setDiscountFilter(df as DiscountFilter);
    if (ss && ["stockTotalAsc","stockTotalDesc","variantCountAsc","variantCountDesc","discountDesc","discountAsc"].includes(ss)) setStockSort(ss as StockSort);
    if (pg) setPage(Math.max(1, Number(pg)) || 1);
    if (lm) setLimit(Math.min(100, Math.max(5, Number(lm))) || 20);
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (stockFilter !== "all") params.set("stockFilter", stockFilter);
    if (discountFilter !== "all") params.set("discountFilter", discountFilter);
    if (stockSort !== "stockTotalDesc") params.set("stockSort", stockSort);
    if (page !== 1) params.set("page", String(page));
    if (limit !== 20) params.set("limit", String(limit));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "?");
  }, [query, stockFilter, discountFilter, stockSort, page, limit, router]);

  const totalPages = useMemo(() => {
    if (!total || !limit) return undefined;
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold inline-flex items-center gap-2">
          <PackageSearch className="size-6 text-muted-foreground" aria-hidden />
          Sản phẩm
        </h1>
        <div className="flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <Input placeholder="Tìm theo tên hoặc slug..." value={query} onChange={handleQueryChange} className="w-64" />
          <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockFilter)}>
            <SelectTrigger className="min-w-[160px] h-9">
              <SelectValue placeholder="Lọc tồn kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="out">Hết hàng</SelectItem>
              <SelectItem value="low">Sắp hết (≤ 5)</SelectItem>
              <SelectItem value="in">Còn hàng</SelectItem>
            </SelectContent>
          </Select>
          <Select value={discountFilter} onValueChange={(v) => setDiscountFilter(v as DiscountFilter)}>
            <SelectTrigger className="min-w-[160px] h-9">
              <SelectValue placeholder="Khuyến mãi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả KM</SelectItem>
              <SelectItem value="has">Đang KM</SelectItem>
              <SelectItem value="none">Chưa KM</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockSort} onValueChange={(v) => setStockSort(v as StockSort)}>
            <SelectTrigger className="min-w-[160px] h-9">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stockTotalDesc">Tồn kho ↓</SelectItem>
              <SelectItem value="stockTotalAsc">Tồn kho ↑</SelectItem>
              <SelectItem value="variantCountDesc">Số biến thể ↓</SelectItem>
              <SelectItem value="variantCountAsc">Số biến thể ↑</SelectItem>
              <SelectItem value="discountDesc">KM % ↓</SelectItem>
              <SelectItem value="discountAsc">KM % ↑</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" onClick={handleResetFilters}>Đặt lại</Button>
          <Button asChild className="inline-flex items-center gap-2">
            <Link href="/admin/products/new">
              <Plus className="size-4" aria-hidden />
              Thêm sản phẩm
            </Link>
          </Button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        Đang hiển thị {sorted.length} sản phẩm{typeof total === "number" ? ` (tổng ~${total})` : ""}
      </div>

      {anySelected && (
        <div className="flex items-center gap-2 p-2 rounded-md border bg-muted/40">
          <div className="text-sm">Đã chọn {selectedOnPage.length} sản phẩm trên trang này</div>
          <div className="ml-auto flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={handleBulkShow}>Hiển thị</Button>
            <Button type="button" size="sm" variant="outline" onClick={handleBulkHide}>Ẩn</Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleBulkDeleteAsk} className="inline-flex items-center gap-2">
              <Trash2 className="size-4" aria-hidden /> Xóa đã chọn
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-sm text-neutral-600">Đang tải…</div>
      ) : sorted.length === 0 ? (
        <div className="border rounded-md p-8 text-center text-sm text-muted-foreground bg-muted/10">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
            <PackageSearch className="size-5" aria-hidden />
          </div>
          Không có sản phẩm nào khớp bộ lọc.
          <div className="mt-3">
            <Button type="button" variant="outline" onClick={handleResetFilters}>Xóa bộ lọc</Button>
          </div>
        </div>
      ) : (
        <div className="relative max-h-[70vh] overflow-y-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-background sticky top-0 z-10">
                <TableHead className="w-[44px]">
                  <Checkbox checked={items.length > 0 && items.every((p) => selectedIds[p.id])} onCheckedChange={(v) => handleToggleSelectAll(Boolean(v))} aria-label="Chọn tất cả" />
                </TableHead>
                <TableHead className="w-[60px]">Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Giá/Khuyến mãi</TableHead>
                <TableHead>Biến thể</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <React.Fragment key={p.id}>
                <TableRow>
                  <TableCell>
                    <Checkbox checked={!!selectedIds[p.id]} onCheckedChange={(v) => handleToggleSelect(p.id, Boolean(v))} aria-label={`Chọn ${p.name}`} />
                  </TableCell>
                  <TableCell className="relative">
                    <div className="group w-10 h-10 rounded overflow-hidden bg-neutral-100">
                      {(p.thumbnailUrl || p.images?.[0]) ? (
                        <Image src={(p.thumbnailUrl || p.images?.[0]) as string} alt={p.name} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>

                    {(p.thumbnailUrl || p.images?.[0]) && (
                      <div className="pointer-events-none absolute left-12 top-1 hidden group-hover:block">
                        <div className="rounded border bg-white p-1 shadow-xl">
                          <Image src={(p.thumbnailUrl || p.images?.[0]) as string} alt={p.name} width={160} height={160} className="w-40 h-40 object-cover rounded" unoptimized />
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.slug}</TableCell>
                  <TableCell>
                    {(() => {
                      // Prefer loaded variantsMap
                      let vs = variantsMap[p.id] || [];
                      // Fallback to product.variants from list API if variantsMap not ready
                      if (!vs.length && Array.isArray(p.variants) && p.variants.length > 0) {
                        vs = p.variants as unknown as ProductVariant[];
                      }
                      // If still no variants, fallback to minEffectivePrice if available
                      if (!vs.length) {
                        const minEff = typeof p.minEffectivePrice === 'number' ? Number(p.minEffectivePrice) : undefined;
                        return (
                          <span className="font-medium">
                            {typeof minEff === 'number' && Number.isFinite(minEff) ? VND.format(minEff) : <span className="text-muted-foreground">—</span>}
                          </span>
                        );
                      }
                      
                      // Use helper function for consistent pricing
                      const discountedVariants = getDiscountedVariants(vs);
                      const minPrice = getMinPrice(vs);
                      
                      // Debug logging (remove after fix)
                      if (p.name.includes('DAD') || p.slug.includes('dad')) {
                        console.log('[Products] DAD Pricing:', {
                          productName: p.name,
                          variantsCount: vs.length,
                          variants: vs.map(v => ({
                            name: v.name,
                            price: v.price,
                            discountPrice: v.discountPrice,
                            priceType: typeof v.price,
                            discountPriceType: typeof v.discountPrice
                          })),
                          discountedVariantsCount: discountedVariants.length,
                          minPrice
                        });
                      }
                      
                      // Show all variants pricing info for better clarity
                      const allVariantsPricing = vs.map(v => ({
                        variant: v,
                        pricing: { effectivePrice: v.price ?? 0, originalPrice: v.price ?? 0, hasDiscount: false, discountPercent: 0, discountPrice: v.discountPrice }
                      }));
                      
                      if (discountedVariants.length) {
                        const top = discountedVariants[0];
                        const badgeVariant: "destructive" | "outline" = top.pricing.discountPercent > 40 ? "destructive" : "outline";
                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-default">
                                <span className="line-through text-muted-foreground text-xs">{VND.format(top.pricing.originalPrice)}</span>
                                <span className="font-semibold text-[#AE1C2C]">→ {VND.format(top.pricing.effectivePrice)}</span>
                                <Badge variant={badgeVariant} className="text-[10px]">-{top.pricing.discountPercent}%</Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[380px]">
                              <div className="text-xs font-medium mb-2">Chi tiết giá các biến thể</div>
                              <ul className="space-y-1 text-xs">
                                {vs.slice(0, 8).map((v) => {
                                  const vPricing = allVariantsPricing.find(x => x.variant.id === v.id)?.pricing;
                                  const discountData = discountedVariants.find(x => x.variant.id === v.id);
                                  const hasDiscount = !!discountData;
                                  return (
                                    <li key={v.id} className="flex items-center justify-between gap-2 py-0.5">
                                      <span className="truncate max-w-[140px] text-[11px]" title={v.name}>{v.name}</span>
                                      {hasDiscount ? (
                                        <>
                                          <span className="text-muted-foreground line-through text-[10px]">{VND.format(discountData.pricing.originalPrice)}</span>
                                          <span className="font-semibold text-[#AE1C2C] text-[11px]">{VND.format(discountData.pricing.effectivePrice)}</span>
                                          <Badge variant={discountData.pricing.discountPercent > 40 ? "destructive" : "outline"} className="text-[9px] h-4">-{discountData.pricing.discountPercent}%</Badge>
                                        </>
                                      ) : (
                                        <>
                                          <span className="font-medium text-[11px]">{VND.format(v.price ?? 0)}</span>
                                          <span className="text-[10px] text-muted-foreground italic">Chưa KM</span>
                                        </>
                                      )}
                                    </li>
                                  );
                                })}
                                {vs.length > 8 && (
                                  <li className="text-muted-foreground text-[10px] pt-1">+{vs.length - 8} biến thể khác…</li>
                                )}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }
                      
                      // No discount - show min price with tooltip showing all variants
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-default">
                              <span className="font-medium">{VND.format(minPrice)}</span>
                              <span className="text-[10px] text-muted-foreground">(Chưa KM)</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[320px]">
                            <div className="text-xs font-medium mb-1">Giá các biến thể</div>
                            <ul className="space-y-1 text-xs">
                              {vs.slice(0, 8).map((v) => (
                                <li key={v.id} className="flex items-center justify-between gap-2">
                                  <span className="truncate max-w-[180px]" title={v.name}>{v.name}</span>
                                  <span className="font-medium">{VND.format(v.price ?? 0)}</span>
                                </li>
                              ))}
                              {vs.length > 8 && (
                                <li className="text-muted-foreground">+{vs.length - 8} biến thể khác…</li>
                              )}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {stockMap[p.id] ? (
                      <span>{stockMap[p.id].variantCount}</span>
                    ) : stockLoading ? (
                      <span className="text-xs text-muted-foreground">Đang tải…</span>
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {stockMap[p.id] ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <span>{stockMap[p.id].total}</span>
                            {stockMap[p.id].low && (
                              <StatusBadge status="warning" className="text-[10px]">Cảnh báo kho thấp</StatusBadge>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={6} className="max-w-xs">
                          <div className="space-y-1">
                            <div className="text-xs font-medium">Chi tiết tồn theo biến thể</div>
                            {variantsMap[p.id]?.length ? (
                              <>
                                <div className="text-[11px] text-muted-foreground">
                                  Tổng biến thể: {variantsMap[p.id].length}
                                  {" • "}Hết hàng: {variantsMap[p.id].filter((v) => (v.stockQuantity ?? 0) === 0).length}
                                  {" • "}Sắp hết: {variantsMap[p.id].filter((v) => (v.stockQuantity ?? 0) > 0 && (v.stockQuantity ?? 0) <= LOW_THRESHOLD).length}
                                </div>
                                <ul className="text-xs list-disc pl-4">
                                  {variantsMap[p.id].slice(0, 6).map((v) => {
                                    const s = v.stockQuantity ?? 0;
                                    const zero = s === 0;
                                    const low = s > 0 && s <= LOW_THRESHOLD;
                                    return (
                                      <li key={v.id} className={zero ? "text-red-600" : low ? "text-amber-600" : undefined}>
                                        <span className="inline-flex items-center gap-2">
                                          <span>{v.name || v.sku || "Biến thể"}: {s}</span>
                                          {zero ? (
                                            <StatusBadge status="danger" className="text-[10px]">Hết</StatusBadge>
                                          ) : low ? (
                                            <StatusBadge status="warning" className="text-[10px]">Thấp</StatusBadge>
                                          ) : null}
                                        </span>
                                      </li>
                                    );
                                  })}
                                  {variantsMap[p.id].length > 6 && (
                                    <li>… và {variantsMap[p.id].length - 6} biến thể khác</li>
                                  )}
                                </ul>
                              </>
                            ) : (
                              <div className="text-xs text-muted-foreground">Không có dữ liệu biến thể</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : stockLoading ? (
                      <span className="text-xs text-muted-foreground">Đang tải…</span>
                    ) : (
                      <span>—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {p.isActive ? (
                        <StatusBadge status="success">Hiển thị</StatusBadge>
                      ) : (
                        <StatusBadge status="neutral">Ẩn</StatusBadge>
                      )}
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleToggleActive(p)}>
                        {p.isActive ? "Ẩn" : "Hiển thị"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button asChild variant="outline" size="sm" className="inline-flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}`}>
                        <Pencil className="size-4" aria-hidden />
                        Sửa
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" data-id={p.id} onClick={handleAskDeleteClick} className="inline-flex items-center gap-2">
                      <Trash2 className="size-4" aria-hidden />
                      Xóa
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => toggleExpand(p.id)} className="inline-flex items-center gap-1">
                      {expanded[p.id] ? <ChevronDown className="size-4" aria-hidden /> : <ChevronRight className="size-4" aria-hidden />}
                      Xem tồn
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded[p.id] && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <div className="border rounded-md p-3 bg-muted/20">
                        <div className="text-sm font-medium mb-2">Biến thể của: {p.name}</div>
                        {variantsMap[p.id]?.length ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-muted-foreground">
                                  <th className="py-1 pr-2">Tên</th>
                                  <th className="py-1 pr-2">SKU</th>
                                  <th className="py-1 pr-2">Giá</th>
                                  <th className="py-1 pr-2">Khuyến mãi</th>
                                  <th className="py-1 pr-2">Kho hiện tại</th>
                                  <th className="py-1 pr-2">Chỉnh sửa kho</th>
                                </tr>
                              </thead>
                              <tbody>
                                {variantsMap[p.id].map((v) => (
                                  <tr key={v.id} className="border-t">
                                    <td className="py-1 pr-2">{v.name}</td>
                                    <td className="py-1 pr-2">{v.sku}</td>
                                    <td className="py-1 pr-2">{VND.format(v.price ?? 0)}</td>
                                    <td className="py-1 pr-2">
                                      <div className="flex items-center gap-2">
                                        {(() => { const price = Number(v.price ?? 0); const d = v.discountPrice == null ? NaN : Number(v.discountPrice); return Number.isFinite(d) && d < price; })() ? (
                                          <>
                                            <span className="line-through text-muted-foreground">{VND.format(Number(v.price ?? 0))}</span>
                                            <span className="font-medium">→ {VND.format(Number(v.discountPrice ?? v.price ?? 0))}</span>
                                            {(() => {
                                              const price = Number(v.price ?? 0);
                                              const d = v.discountPrice == null ? NaN : Number(v.discountPrice);
                                              const pct = price > 0 && Number.isFinite(d) ? Math.round(((price - d) / price) * 100) : 0;
                                              const variantStyle: "destructive" | "outline" = pct > 40 ? "destructive" : "outline";
                                              return <Badge variant={variantStyle} className="text-[10px]">-{pct}%</Badge>;
                                            })()}
                                          </>
                                        ) : (
                                          <Badge variant="secondary" className="text-[10px]">Chưa KM</Badge>
                                        )}
                                      </div>
                                      <div className="mt-1 flex items-center gap-2">
                                        <Input
                                          key={`pct-${v.id}-${(() => { const price=Number(v.price??0); const dRaw=v.discountPrice; const d = dRaw==null?NaN:Number(dRaw); return price>0 && Number.isFinite(d) && d<price ? Math.round(((price-d)/price)*100) : '' })()}`}
                                          type="number"
                                          min={1}
                                          max={100}
                                          placeholder="% KM (1-100)"
                                          defaultValue={(() => {
                                            const price = Number(v.price ?? 0);
                                            const dRaw = v.discountPrice;
                                            const d = dRaw == null ? NaN : Number(dRaw);
                                            if (price > 0 && Number.isFinite(d) && d < price) {
                                              return Math.round(((price - d) / price) * 100);
                                            }
                                            return "";
                                          })()}
                                          className="w-24 h-8"
                                          onKeyDown={getPercentKeyDown(p.id, v)}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="outline"
                                          className="h-8"
                                          onClick={getPercentApplyClick(p.id, v)}
                                        >
                                          Áp dụng %
                                        </Button>
                                        {typeof v.discountPrice === "number" && v.discountPrice < (v.price ?? 0) && (
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            className="h-8"
                                            onClick={getRemoveDiscountClick(p.id, v)}
                                          >
                                            Bỏ KM
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-1 pr-2">
                                      <div className="flex items-center gap-2">
                                        <span>{v.stockQuantity ?? 0}</span>
                                        {(v.stockQuantity ?? 0) === 0 ? (
                                          <Badge variant="destructive" className="text-[10px]">Hết hàng</Badge>
                                        ) : (v.stockQuantity ?? 0) <= LOW_THRESHOLD ? (
                                          <Badge variant="outline" className="text-[10px]">Sắp hết</Badge>
                                        ) : (
                                          <Badge className="text-[10px]">Còn hàng</Badge>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-1 pr-2">
                                      <div className="flex items-center gap-2">
                                        <Input
                                          type="number"
                                          min={0}
                                          defaultValue={v.stockQuantity ?? 0}
                                          className="w-28 h-8"
                                          onKeyDown={getStockInputKeyDown(p.id, v)}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          disabled={!!savingVariant[v.id]}
                                          className="inline-flex items-center gap-1 h-8"
                                          onClick={getStockSaveClick(p.id, v)}
                                        >
                                          <Save className="size-4" aria-hidden />{savingVariant[v.id] ? "Đang lưu…" : "Lưu"}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : stockLoading ? (
                          <div className="text-xs text-muted-foreground">Đang tải biến thể…</div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Chưa có biến thể</div>
                        )}
                        <div className="mt-2">
                          <Button asChild variant="link" size="sm" className="px-0">
                            <Link href={`/admin/products/${p.id}`}>Đi tới trang sửa sản phẩm</Link>
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">Trang {page}{totalPages ? ` / ${totalPages}` : ""}</div>
        <div className="flex items-center gap-2">
          <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(Number(v)); }}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Số dòng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / trang</SelectItem>
              <SelectItem value="20">20 / trang</SelectItem>
              <SelectItem value="50">50 / trang</SelectItem>
              <SelectItem value="100">100 / trang</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Trước</Button>
          <Button type="button" variant="outline" size="sm" disabled={!!totalPages && page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sau</Button>
        </div>
      </div>

      

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa sản phẩm?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa các sản phẩm đã chọn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Với sản phẩm đang liên quan tới đơn hàng, hệ thống sẽ tự động ẩn thay vì xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkConfirmOpen(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận xóa đã chọn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa sản phẩm?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkConfirmOpen} onOpenChange={setBulkConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa các sản phẩm đã chọn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Với sản phẩm đang liên quan tới đơn hàng, hệ thống sẽ tự động ẩn thay vì xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBulkConfirmOpen(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận xóa đã chọn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
