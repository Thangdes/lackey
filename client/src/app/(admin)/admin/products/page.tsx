"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/service/product.service";
import type { Product, ProductVariant } from "@/type/product";
import { getBestDiscountVariant, getDiscountedVariants } from "@/utils/priceHelper";
import { handleVariantStockSave, handleVariantDiscountSave, handleRemoveDiscount, calculateDiscountPercent, getStockMeta } from "@/utils/productVariantHelpers";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { PackageSearch } from "lucide-react";
import ProductsToolbar, { type StockFilter, type StockSort, type DiscountFilter } from "@/components/admin/products/ProductsToolbar";
import ProductsBulkActions from "@/components/admin/products/ProductsBulkActions";
import ProductRow from "@/components/admin/products/ProductRow";

const LOW_THRESHOLD = 5;

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

  const VND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [stockSort, setStockSort] = useState<StockSort>("stockTotalDesc");
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

  const handleVariantStockUpdate = useCallback(async (productId: string, variant: ProductVariant, stockQuantity: number) => {
    setSavingVariant((s) => ({ ...s, [variant.id]: true }));
    await handleVariantStockSave(productId, variant, stockQuantity, {
      onSuccess: (vs) => {
        setVariantsMap((m) => ({ ...m, [productId]: vs }));
        const meta = getStockMeta(vs);
        setStockMap((m) => ({ ...m, [productId]: meta }));
      },
      onError: () => setSavingVariant((s) => ({ ...s, [variant.id]: false })),
    });
    setSavingVariant((s) => ({ ...s, [variant.id]: false }));
  }, []);

  const handleVariantDiscountUpdate = useCallback(async (productId: string, variant: ProductVariant, discountPrice: number) => {
    setSavingVariant((s) => ({ ...s, [variant.id]: true }));
    await handleVariantDiscountSave(productId, variant, discountPrice, {
      onSuccess: (vs) => {
        setVariantsMap((m) => ({ ...m, [productId]: vs }));
        const meta = getStockMeta(vs);
        setStockMap((m) => ({ ...m, [productId]: meta }));
      },
      onError: () => setSavingVariant((s) => ({ ...s, [variant.id]: false })),
    });
    setSavingVariant((s) => ({ ...s, [variant.id]: false }));
  }, []);

  const handleApplyDiscountPercent = useCallback((productId: string, variant: ProductVariant, percent: number) => {
    const discountPrice = calculateDiscountPercent(variant.price ?? 0, percent);
    if (discountPrice > 0) {
      handleVariantDiscountUpdate(productId, variant, discountPrice);
    }
  }, [handleVariantDiscountUpdate]);

  const getRemoveDiscountClick = useCallback((productId: string, variant: ProductVariant) =>
    async () => {
      setSavingVariant((s) => ({ ...s, [variant.id]: true }));
      await handleRemoveDiscount(productId, variant, {
        onSuccess: (vs) => {
          setVariantsMap((m) => ({ ...m, [productId]: vs }));
          const meta = getStockMeta(vs);
          setStockMap((m) => ({ ...m, [productId]: meta }));
        },
        onError: () => setSavingVariant((s) => ({ ...s, [variant.id]: false })),
      });
      setSavingVariant((s) => ({ ...s, [variant.id]: false }));
    },
  []);

  const getPercentKeyDown = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const raw = (e.currentTarget as HTMLInputElement).value;
        const pct = Number(raw);
        if (Number.isFinite(pct) && pct >= 1 && pct <= 100) {
          handleApplyDiscountPercent(productId, variant, pct);
        }
      }
    },
  [handleApplyDiscountPercent]);

  const getPercentApplyClick = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const input = e.currentTarget.previousSibling as HTMLInputElement;
      const raw = input?.value ?? "";
      const pct = Number(raw);
      if (Number.isFinite(pct) && pct >= 1 && pct <= 100) {
        handleApplyDiscountPercent(productId, variant, pct);
      }
    },
  [handleApplyDiscountPercent]);

  const getStockInputKeyDown = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const raw = (e.currentTarget as HTMLInputElement).value;
        const num = raw === "" ? 0 : Number(raw);
        handleVariantStockUpdate(productId, variant, num);
      }
    },
  [handleVariantStockUpdate]);

  const getStockSaveClick = useCallback((productId: string, variant: ProductVariant) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const input = e.currentTarget.previousSibling as HTMLInputElement;
      const raw = input?.value ?? "";
      const num = raw === "" ? 0 : Number(raw);
      handleVariantStockUpdate(productId, variant, num);
    },
  [handleVariantStockUpdate]);

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
    return (p.name || "").toLowerCase().includes(q) || (p.slug || "").toLowerCase().includes(q);
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
              const meta = getStockMeta(vs);
              return [p.id, meta, vs] as const;
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
      <ProductsToolbar
        query={query}
        stockFilter={stockFilter}
        discountFilter={discountFilter}
        stockSort={stockSort}
        onQueryChange={handleQueryChange}
        onStockFilterChange={setStockFilter}
        onDiscountFilterChange={setDiscountFilter}
        onStockSortChange={setStockSort}
        onResetFilters={handleResetFilters}
      />
      <div className="text-sm text-muted-foreground">
        Đang hiển thị {sorted.length} sản phẩm{typeof total === "number" ? ` (tổng ~${total})` : ""}
      </div>

      <ProductsBulkActions
        selectedCount={selectedOnPage.length}
        onBulkShow={handleBulkShow}
        onBulkHide={handleBulkHide}
        onBulkDelete={handleBulkDeleteAsk}
      />

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
                <ProductRow
                  key={p.id}
                  product={p}
                  selected={!!selectedIds[p.id]}
                  expanded={!!expanded[p.id]}
                  stockMap={stockMap}
                  variantsMap={variantsMap}
                  savingVariant={savingVariant}
                  stockLoading={stockLoading}
                  VND={VND}
                  onToggleSelect={handleToggleSelect}
                  onToggleActive={handleToggleActive}
                  onToggleExpand={toggleExpand}
                  onAskDelete={askDelete}
                  onPercentKeyDown={getPercentKeyDown}
                  onPercentApplyClick={getPercentApplyClick}
                  onRemoveDiscountClick={getRemoveDiscountClick}
                  onStockInputKeyDown={getStockInputKeyDown}
                  onStockSaveClick={getStockSaveClick}
                />
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
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Nếu sản phẩm có liên quan tới đơn hàng, hệ thống sẽ tự động ẩn thay vì xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Hủy</AlertDialogCancel>
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
