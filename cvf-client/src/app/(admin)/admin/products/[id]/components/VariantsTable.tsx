"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type VariantItem = {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
};

export type VariantsTableProps = {
  variants: VariantItem[];
  onNameBlur: (id: string, value: string) => void;
  onSkuBlur: (id: string, value: string) => void;
  onPriceBlur: (id: string, value: number) => void;
  onStockBlur: (id: string, value: number) => void;
  onStockSave: (id: string, value: number) => void;
  onDiscountSave: (id: string, discountPrice: number | null) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function VariantsTable(props: VariantsTableProps) {
  const { variants, onNameBlur, onSkuBlur, onPriceBlur, onStockBlur, onStockSave, onDiscountSave, onEdit, onDelete } = props;

  // Local edit states per row
  type RowState = {
    discountMode: "PERCENT" | "AMOUNT";
    discountPercent: string; // KM %
    discountAmount: string;  // Giá sau giảm (VND)
    stock: string;
  };
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});

  const fmtVND = useMemo(() => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }), []);

  const ensureRowState = useCallback((v: VariantItem): RowState => {
    const cur = rowStates[v.id];
    if (cur) return cur;
    // initialize from current values
    const p = Number(v.price ?? 0);
    const dp = v.discountPrice == null ? null : Number(v.discountPrice);
    const pct = p > 0 && dp != null && dp < p ? String(Math.round((1 - dp / p) * 100)) : "";
    const state: RowState = {
      discountMode: "PERCENT",
      discountPercent: pct,
      discountAmount: dp != null ? String(dp) : "",
      stock: String(v.stockQuantity ?? 0),
    };
    setRowStates((s) => ({ ...s, [v.id]: state }));
    return state;
  }, [rowStates]);

  const handleNameBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onNameBlur(id, e.currentTarget.value);
  }, [onNameBlur]);

  const handleSkuBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onSkuBlur(id, e.currentTarget.value);
  }, [onSkuBlur]);

  const handlePriceBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const raw = e.currentTarget.value;
    if (raw === "") return;
    const num = Number(raw);
    onPriceBlur(id, num);
  }, [onPriceBlur]);

  const handleStockBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const raw = e.currentTarget.value;
    const num = raw === "" ? 0 : Number(raw);
    onStockBlur(id, num);
  }, [onStockBlur]);

  const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const val = e.currentTarget.value;
    setRowStates((s) => ({ ...s, [id]: { ...(s[id] ?? { discountMode: "PERCENT", discountPercent: "", discountAmount: "", stock: "0" }), stock: val } }));
  }, []);

  const handleStockSave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const st = rowStates[id];
    const num = st ? Number(st.stock) : NaN;
    const v = variants.find(x => x.id === id);
    if (!v) return;
    const safe = Number.isFinite(num) && num >= 0 ? num : v.stockQuantity ?? 0;
    onStockSave(id, safe);
  }, [onStockSave, rowStates, variants]);

  const handleEditClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onEdit(id);
  }, [onEdit]);

  const handleDeleteConfirm = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    onDelete(id);
  }, [onDelete]);

  // Discount handlers (properly scoped inside the component)
  const handleDiscountModeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const mode = (e.currentTarget.value as "PERCENT" | "AMOUNT");
    setRowStates((s) => ({
      ...s,
      [id]: {
        ...(s[id] ?? { discountMode: mode, discountPercent: "", discountAmount: "", stock: "0" }),
        discountMode: mode,
      },
    }));
  }, []);

  const handleDiscountPercentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const val = e.currentTarget.value;
    setRowStates((s) => ({
      ...s,
      [id]: {
        ...(s[id] ?? { discountMode: "PERCENT", discountPercent: "", discountAmount: "", stock: "0" }),
        discountPercent: val,
      },
    }));
  }, []);

  const handleDiscountAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const val = e.currentTarget.value;
    setRowStates((s) => ({
      ...s,
      [id]: {
        ...(s[id] ?? { discountMode: "AMOUNT", discountPercent: "", discountAmount: "", stock: "0" }),
        discountAmount: val,
      },
    }));
  }, []);

  const handleDiscountSave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id as string;
    const v = variants.find((x) => x.id === id);
    if (!v) return;
    const st = rowStates[id] ?? ensureRowState(v);
    const p = Number(v.price ?? 0);
    let newDiscount: number | null = null;
    if (st.discountMode === "AMOUNT") {
      const amt = st.discountAmount === "" ? null : Number(st.discountAmount);
      if (amt != null && Number.isFinite(amt) && amt >= 0) newDiscount = Math.max(0, Math.min(amt, p));
    } else {
      const pct = st.discountPercent === "" ? null : Number(st.discountPercent);
      if (pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100)
        newDiscount = Math.max(0, Math.round(p * (1 - pct / 100)));
    }
    onDiscountSave(id, newDiscount);
  }, [ensureRowState, onDiscountSave, rowStates, variants]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Giảm giá</TableHead>
          <TableHead>Kho hiện tại</TableHead>
          <TableHead>Chỉnh sửa kho</TableHead>
          <TableHead>Hành động</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants?.map((v) => {
          const st = ensureRowState(v);
          const price = Number(v.price ?? 0);
          const hasDiscount = v.discountPrice != null && Number(v.discountPrice) < price;
          const dp = v.discountPrice == null ? null : Number(v.discountPrice);
          const pct = hasDiscount && price > 0 && dp != null ? Math.round((1 - dp / price) * 100) : null;
          return (
            <TableRow key={v.id}>
              <TableCell>
                <Input defaultValue={v.name} data-id={v.id} onBlur={handleNameBlur} />
              </TableCell>
              <TableCell>
                <Input defaultValue={v.sku || ""} data-id={v.id} onBlur={handleSkuBlur} />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-[11px] text-muted-foreground mb-1">Giá gốc:</div>
                  <Input type="number" min={0} step="1" defaultValue={price} data-id={v.id} onBlur={handlePriceBlur} className="font-medium" />
                  {hasDiscount ? (
                    <div className="text-xs mt-1.5 p-1.5 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-muted-foreground">Khách trả:</span>
                        <span className="font-semibold text-[#AE1C2C]">{fmtVND.format(dp as number)}</span>
                        {pct != null && <span className="inline-block bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-medium">-{pct}%</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground mt-1">Chưa có khuyến mãi</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Chế độ khuyến mãi"
                    data-id={v.id}
                    className="border rounded px-1.5 py-1 text-xs"
                    value={st.discountMode}
                    onChange={handleDiscountModeChange}
                  >
                    <option value="PERCENT">KM %</option>
                    <option value="AMOUNT">Giá sau giảm</option>
                  </select>
                  {st.discountMode === "PERCENT" ? (
                    <Input
                      data-id={v.id}
                      type="number"
                      min={0}
                      max={100}
                      step="1"
                      placeholder="%"
                      value={st.discountPercent}
                      onChange={handleDiscountPercentChange}
                    />
                  ) : (
                    <Input
                      data-id={v.id}
                      type="number"
                      min={0}
                      step="1"
                      placeholder="Giá sau giảm"
                      value={st.discountAmount}
                      onChange={handleDiscountAmountChange}
                    />
                  )}
                  <button type="button" data-id={v.id} className="col-span-2 px-2 py-1 border rounded text-xs" onClick={handleDiscountSave}>Lưu KM</button>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{v.stockQuantity ?? 0}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input data-id={v.id} type="number" min={0} step="1" value={st.stock} onChange={handleStockChange} onBlur={handleStockBlur} className="w-24" />
                  <button type="button" data-id={v.id} className="px-2 py-1 border rounded text-xs" onClick={handleStockSave}>Lưu</button>
                </div>
              </TableCell>
              <TableCell>
                <button type="button" className="px-2 py-1 border rounded text-xs mr-2" data-id={v.id} onClick={handleEditClick}>Sửa</button>
                <div className="inline-flex items-center gap-1 mb-1 text-[11px] text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
                  <span aria-hidden>ℹ️</span>
                  <span>Lưu ý: Biến thể có trong đơn hàng sẽ không thể xóa</span>
                </div>
                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          className="px-2 py-1 border rounded text-xs"
                        >
                          Xóa
                        </button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      Nếu biến thể đang được liên kết với các đơn hàng hiện có, bạn sẽ không thể xóa.
                    </TooltipContent>
                  </Tooltip>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa biến thể</AlertDialogTitle>
                      <AlertDialogDescription>Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa biến thể này?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction data-id={v.id} onClick={handleDeleteConfirm}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
