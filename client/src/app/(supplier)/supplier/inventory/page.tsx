"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supplierDashboardService, type SupplierInventoryProduct } from "@/service/supplier-dashboard.service";
import { productService } from "@/service/product.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authService } from "@/service/auth.service";

export default function SupplierInventoryPage() {
  const sp = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SupplierInventoryProduct[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, { productId: string; variantId: string }>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [newQty, setNewQty] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState<Record<string, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [writable, setWritable] = useState(false);
  const [lowOnly, setLowOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await supplierDashboardService.inventoryReport();
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    
    try {
      const initQ = sp?.get("q");
      if (initQ) setQuery(initQ);
    } catch {}
    run();
    return () => { cancelled = true; };
  }, [sp]);

  
  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        const prof = await authService.profile().catch(() => null) as unknown as { role?: unknown; roles?: unknown } | null;
        const role = (prof?.role ? String(prof.role) : "").toLowerCase();
        const roles = Array.isArray(prof?.roles) ? (prof?.roles as unknown[]).map((r) => String(r).toLowerCase()) : [];
        const isAdmin = role === "admin" || roles.includes("admin");
        if (alive) setWritable(isAdmin);
      } catch {
        if (alive) setWritable(false);
      }
    };
    check();
    return () => { alive = false; };
  }, []);

  
  const getKey = (productId: string, variantId: string) => `${productId}:${variantId}`;
  const getCurrentQty = React.useCallback((productId: string, variantId: string): number => {
    const prod = items.find((p) => p.id === productId);
    const v = prod?.variants.find((vv) => vv.id === variantId);
    return Number(v?.stockQuantity ?? 0);
  }, [items]);
  const getEditedQty = React.useCallback((productId: string, variantId: string): number => {
    const k = getKey(productId, variantId);
    if (Object.prototype.hasOwnProperty.call(edited, k)) return Number(edited[k] ?? 0);
    return getCurrentQty(productId, variantId);
  }, [edited, getCurrentQty]);
  const setEditedQty = (productId: string, variantId: string, val: number) => {
    const k = getKey(productId, variantId);
    setEdited((prev) => ({ ...prev, [k]: val }));
  };
  const changes = useMemo(() => {
    const out: Array<{ productId: string; variantId: string; productName: string; variantName: string; from: number; to: number; sku: string }> = [];
    for (const p of items) {
      for (const v of p.variants) {
        const from = Number(v.stockQuantity ?? 0);
        const to = getEditedQty(p.id, v.id);
        if (to !== from) out.push({ productId: p.id, variantId: v.id, productName: p.name, variantName: v.name, from, to, sku: v.sku });
      }
    }
    return out;
  }, [items, getEditedQty]);
  const applyInlineChanges = async () => {
    if (changes.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(changes.map((c) => productService.updateVariant(c.productId, c.variantId, { stockQuantity: c.to })));
      const data = await supplierDashboardService.inventoryReport();
      setItems(Array.isArray(data) ? data : []);
      setEdited({});
      setConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items
      .map((p) => ({
        ...p,
        variants: p.variants.filter((v) => (v.name || v.sku || "").toLowerCase().includes(q) || (p.name || "").toLowerCase().includes(q)),
      }))
      .filter((p) => p.variants.length > 0 || (p.name || "").toLowerCase().includes(q));
  }, [items, query]);

  const flatRows = useMemo(() => {
    return filtered.flatMap((p) => p.variants.map((v) => ({ productId: p.id, productName: p.name, variantId: v.id, name: v.name, sku: v.sku, stockQuantity: v.stockQuantity })));
  }, [filtered]);

  const allSelected = useMemo(() => flatRows.length > 0 && flatRows.every((r) => Boolean(selected[`${r.productId}:${r.variantId}`])), [flatRows, selected]);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next: Record<string, { productId: string; variantId: string }> = {};
      for (const r of flatRows) next[`${r.productId}:${r.variantId}`] = { productId: r.productId, variantId: r.variantId };
      setSelected(next);
    } else {
      setSelected({});
    }
  };

  const toggleOne = (productId: string, variantId: string, checked: boolean) => {
    const key = `${productId}:${variantId}`;
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) next[key] = { productId, variantId };
      else delete next[key];
      return next;
    });
  };

  const onApplyBulk = async () => {
    const qty = Number(newQty);
    if (!Number.isFinite(qty) || qty < 0) return;
    const picks = Object.values(selected);
    if (picks.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        picks.map(({ productId, variantId }) => productService.updateVariant(productId, variantId, { stockQuantity: qty }))
      );
      
      const data = await supplierDashboardService.inventoryReport();
      setItems(Array.isArray(data) ? data : []);
      setSelected({});
      setModalOpen(false);
      setNewQty("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Tồn kho</h1>
          <span className="inline-flex items-center h-6 rounded-full bg-neutral-100 px-2 border text-xs text-neutral-600">
            {flatRows.length} biến thể
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo sản phẩm/biến thể..."
            className="w-72"
            aria-label="Tìm kiếm tồn kho"
          />
          {query && (
            <Button variant="outline" onClick={() => setQuery("")}>Xóa</Button>
          )}
          <Button
            variant={lowOnly ? "default" : "outline"}
            onClick={() => setLowOnly((v) => !v)}
            title="Chỉ hiển thị tồn thấp (≤ 5)"
          >
            {lowOnly ? "Đang lọc tồn thấp" : "Lọc tồn thấp"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px]">
                {writable ? (
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={allSelected}
                    onChange={(e) => toggleAll(e.target.checked)}
                    aria-label="Chọn tất cả"
                  />
                ) : null}
              </TableHead>
              <TableHead className="text-neutral-500">Sản phẩm</TableHead>
              <TableHead className="text-neutral-500">Biến thể</TableHead>
              <TableHead className="text-neutral-500">Mã SKU</TableHead>
              <TableHead className="text-right text-neutral-500">Tồn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">Đang tải…</TableCell></TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">Không có dữ liệu.</TableCell></TableRow>
            )}
            {!loading && filtered.map((p, pi) => (
              p.variants.length > 0 ? (
                p.variants.map((v, vi) => {
                  const key = `${p.id}:${v.id}`;
                  const isChecked = Boolean(selected[key]);
                  const from = Number(v.stockQuantity ?? 0);
                  const editedQty = getEditedQty(p.id, v.id);
                  const isChanged = editedQty !== from;
                  const isLow = editedQty <= 5;
                  if (lowOnly && !isLow) return null;
                  const level = editedQty <= 5 ? 'low' : editedQty <= 20 ? 'mid' : 'ok';
                  return (
                    <TableRow key={`${pi}-${vi}`} className={`${(pi + vi) % 2 ? 'bg-neutral-50' : 'bg-white'} ${isChanged ? 'bg-amber-50' : ''} hover:bg-neutral-100`}>
                      <TableCell>
                        {writable ? (
                          <input
                            type="checkbox"
                            className="size-4"
                            checked={isChecked}
                            onChange={(e) => toggleOne(p.id, v.id, e.target.checked)}
                            aria-label={`Chọn ${p.name} - ${v.name}`}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell className="font-medium">{vi === 0 ? p.name : <span className="text-muted-foreground">↳</span>}</TableCell>
                      <TableCell>{v.name}</TableCell>
                      <TableCell>{v.sku}</TableCell>
                      <TableCell className={`text-right ${isLow ? 'text-rose-700 font-medium' : ''}`}>
                        {writable ? (
                          <Input
                            className="h-8 w-24 text-right"
                            value={String(getEditedQty(p.id, v.id))}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              setEditedQty(p.id, v.id, Number(val || 0));
                            }}
                            inputMode="numeric"
                          />
                        ) : (
                          <span className="inline-flex items-center gap-2 justify-end">
                            <span>{getEditedQty(p.id, v.id)}</span>
                            <span className={`inline-flex items-center h-5 rounded-full px-2 text-[11px] border
                              ${level==='low' ? 'bg-rose-50 text-rose-700 border-rose-200' : level==='mid' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                            >
                              {level==='low' ? 'Thấp' : level==='mid' ? 'Trung bình' : 'Tốt'}
                            </span>
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow key={`${pi}-empty`}>
                  <TableCell></TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell colSpan={3} className="text-muted-foreground">Chưa có biến thể</TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </div>

      {writable && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-sm text-neutral-600">Đã chọn: {Object.keys(selected).length}</div>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button disabled={Object.keys(selected).length === 0}>Cập nhật số lượng</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cập nhật số lượng (hàng loạt)</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="text-sm text-neutral-600">Số biến thể được chọn: {Object.keys(selected).length}</div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng mới</label>
                  <Input
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    placeholder="VD: 50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
                <Button onClick={onApplyBulk} disabled={saving || !newQty}>Áp dụng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" disabled={changes.length === 0}>Áp dụng thay đổi theo từng dòng</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận thay đổi</DialogTitle>
              </DialogHeader>
              <div className="max-h-[50vh] overflow-auto">
                {changes.length === 0 ? (
                  <div className="text-sm text-neutral-600">Không có thay đổi.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Biến thể</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Từ</TableHead>
                        <TableHead className="text-right">Thành</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {changes.map((c, idx) => (
                        <TableRow key={`${c.variantId}-${idx}`}>
                          <TableCell className="font-medium">{c.productName}</TableCell>
                          <TableCell>{c.variantName}</TableCell>
                          <TableCell>{c.sku}</TableCell>
                          <TableCell className="text-right">{c.from}</TableCell>
                          <TableCell className="text-right">{c.to}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Hủy</Button>
                <Button onClick={applyInlineChanges} disabled={saving || changes.length === 0}>Xác nhận áp dụng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
