"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supplierDashboardService, type RestockCandidate } from "@/service/supplier-dashboard.service";
import { productService } from "@/service/product.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { authService } from "@/service/auth.service";

export default function SupplierRestockPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<RestockCandidate[]>([]);
  const [limit, setLimit] = useState<string>("10");
  const [threshold, setThreshold] = useState<string>("5");
  const [selected, setSelected] = useState<Record<string, { productId: string; variantId: string }>>({});
  const [newQty, setNewQty] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [edited, setEdited] = useState<Record<string, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [writable, setWritable] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const lim = Math.max(1, Number(limit || 10));
      const thr = Math.max(0, Number(threshold || 5));
      const data = await supplierDashboardService.restockCandidates(lim, thr).catch(() => [] as RestockCandidate[]);
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine if current user has admin privileges -> allow write only for admin
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

  const onApplyFilter = () => {
    fetchData();
  };

  const getKey = (productId: string, variantId: string) => `${productId}:${variantId}`;
  const getEditedQty = React.useCallback((productId: string, variantId: string, current: number) => {
    const k = getKey(productId, variantId);
    if (Object.prototype.hasOwnProperty.call(edited, k)) return Number(edited[k] ?? 0);
    return current;
  }, [edited]);
  const setEditedQty = (productId: string, variantId: string, val: number) => {
    const k = getKey(productId, variantId);
    setEdited((prev) => ({ ...prev, [k]: val }));
  };

  const changes = useMemo(() => {
    const out: Array<{ productId: string; variantId: string; productName: string; variantName: string; from: number; to: number; sku: string }>= [];
    for (const r of items) {
      const from = Number(r.stockQuantity ?? 0);
      const to = getEditedQty(r.productId, r.variantId, from);
      if (to !== from) out.push({ productId: r.productId, variantId: r.variantId, productName: r.productName, variantName: r.variantName, from, to, sku: r.sku });
    }
    return out;
  }, [items, getEditedQty]);

  const allSelected = useMemo(() => items.length > 0 && items.every((r) => Boolean(selected[getKey(r.productId, r.variantId)])), [items, selected]);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next: Record<string, { productId: string; variantId: string }> = {};
      for (const r of items) next[getKey(r.productId, r.variantId)] = { productId: r.productId, variantId: r.variantId };
      setSelected(next);
    } else {
      setSelected({});
    }
  };

  const toggleOne = (productId: string, variantId: string, checked: boolean) => {
    const key = getKey(productId, variantId);
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
      await fetchData();
      setSelected({});
      setModalOpen(false);
      setNewQty("");
      setEdited({});
    } finally {
      setSaving(false);
    }
  };

  const applyInlineChanges = async () => {
    if (changes.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(changes.map((c) => productService.updateVariant(c.productId, c.variantId, { stockQuantity: c.to })));
      await fetchData();
      setEdited({});
      setConfirmOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline"><Link href="/supplier">← Bảng điều khiển</Link></Button>
          <h1 className="text-xl font-semibold">Nên nhập lại</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2">
            <label className="text-sm">Số lượng gợi ý</label>
            <Input className="h-9 w-24" value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
          </div>
          <div className="inline-flex items-center gap-2">
            <label className="text-sm">Ngưỡng tồn thấp</label>
            <Input className="h-9 w-24" value={threshold} onChange={(e) => setThreshold(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
          </div>
          <Button onClick={onApplyFilter}>Áp dụng</Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px]">
                {writable ? (
                  <input type="checkbox" className="size-4" checked={allSelected} onChange={(e) => toggleAll(e.target.checked)} aria-label="Chọn tất cả" />
                ) : null}
              </TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Biến thể</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Đã bán 30 ngày</TableHead>
              <TableHead className="text-right">Tồn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Đang tải…</TableCell></TableRow>
            )}
            {!loading && items.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">Không có đề xuất.</TableCell></TableRow>
            )}
            {!loading && items.map((r, idx) => {
              const key = getKey(r.productId, r.variantId);
              const isChecked = Boolean(selected[key]);
              const current = Number(r.stockQuantity ?? 0);
              return (
                <TableRow key={`${r.variantId}-${idx}`}>
                  <TableCell>
                    {writable ? (
                      <input type="checkbox" className="size-4" checked={isChecked} onChange={(e) => toggleOne(r.productId, r.variantId, e.target.checked)} aria-label={`Chọn ${r.productName} - ${r.variantName}`} />
                    ) : null}
                  </TableCell>
                  <TableCell className="font-medium">{r.productName}</TableCell>
                  <TableCell>{r.variantName}</TableCell>
                  <TableCell>{r.sku}</TableCell>
                  <TableCell className="text-right">{r.totalSold30d}</TableCell>
                  <TableCell className="text-right">
                    {writable ? (
                      <Input
                        className="h-8 w-24 text-right"
                        value={String(getEditedQty(r.productId, r.variantId, current))}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setEditedQty(r.productId, r.variantId, Number(val || 0));
                        }}
                        inputMode="numeric"
                      />
                    ) : (
                      <span>{getEditedQty(r.productId, r.variantId, current)}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {writable && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-sm text-neutral-600">Đã chọn: {Object.keys(selected).length}</div>
          <div className="flex items-center gap-2">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button disabled={Object.keys(selected).length === 0}>Cập nhật số lượng (hàng loạt)</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật số lượng (hàng loạt)</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="text-sm text-neutral-600">Số biến thể được chọn: {Object.keys(selected).length}</div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số lượng mới</label>
                    <Input value={newQty} onChange={(e) => setNewQty(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="VD: 50" />
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
        </div>
      )}
    </div>
  );
}
