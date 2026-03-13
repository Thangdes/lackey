"use client";
import React, { useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateAndSuggestVariantName } from "@/utils/variantNameHelper";

export type AddVariantDialogProps = {
  triggerLabel?: string;
  baseName: string; 
  weight: string;
  sku: string;
  price: string;
  discountPercent: string;
  discountAmount?: string; 
  discountMode?: "PERCENT" | "AMOUNT";
  stock: string;
  disabled?: boolean;
  onBaseNameChange: (v: string) => void;
  onWeightChange: (v: string) => void; 
  onSkuChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onDiscountPercentChange: (v: string) => void;
  onDiscountAmountChange?: (v: string) => void;
  onDiscountModeChange?: (v: "PERCENT" | "AMOUNT") => void;
  onStockChange: (v: string) => void;
  onAdd: () => void;
};

export function AddVariantDialog(props: AddVariantDialogProps) {
  const {
    triggerLabel = "+ Thêm biến thể",
    baseName,
    weight,
    sku,
    price,
    discountPercent,
    discountAmount = "",
    discountMode = "PERCENT",
    stock,
    disabled,
    onBaseNameChange,
    onWeightChange,
    onSkuChange,
    onPriceChange,
    onDiscountPercentChange,
    onDiscountAmountChange,
    onDiscountModeChange,
    onStockChange,
    onAdd,
  } = props;

  const handleBaseName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onBaseNameChange(e.target.value), [onBaseNameChange]);
  const handleWeight = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onWeightChange(e.target.value), [onWeightChange]);
  const handleSku = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSkuChange(e.target.value), [onSkuChange]);
  const handlePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onPriceChange(e.target.value), [onPriceChange]);
  const handleDiscount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onDiscountPercentChange(e.target.value), [onDiscountPercentChange]);
  const handleDiscountAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onDiscountAmountChange && onDiscountAmountChange(e.target.value), [onDiscountAmountChange]);
  const handleModeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => onDiscountModeChange && onDiscountModeChange(e.target.value as "PERCENT" | "AMOUNT"), [onDiscountModeChange]);
  const handleStock = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onStockChange(e.target.value), [onStockChange]);
  const handleAdd = useCallback(() => onAdd(), [onAdd]);

  const finalVariantName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(baseName, weight);
    return nameValidation.suggestedName || baseName;
  }, [baseName, weight]);

  const nameValidation = useMemo(() => {
    return validateAndSuggestVariantName(baseName, weight);
  }, [baseName, weight]);

  const afterPriceText = (() => {
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) return null;
    const fmt = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
    if (typeof discountMode !== "undefined" && discountMode === "AMOUNT") {
      const amt = discountAmount === "" ? null : Number(discountAmount);
      if (amt == null || !Number.isFinite(amt) || amt < 0) return null;
      return `Giá sau giảm: ${fmt.format(Math.max(0, Math.min(amt, p)))}`;
    }
    const pct = discountPercent === "" ? null : Number(discountPercent);
    if (pct == null || !Number.isFinite(pct) || pct < 0 || pct > 100) return null;
    const after = Math.max(0, Math.round(p * (1 - pct / 100)));
    return `Giá sau giảm: ${fmt.format(after)}`;
  })();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm biến thể</DialogTitle>
          <DialogDescription>Nhập thông tin biến thể cho sản phẩm</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Tên cơ bản (không bao gồm khối lượng)</label>
            <Input placeholder="Ví dụ: Hạt điều rang muối" value={baseName} onChange={handleBaseName} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Khối lượng (gram)</label>
            <Input type="number" min={0} step="1" placeholder="Ví dụ: 500" value={weight} onChange={handleWeight} />
          </div>
          <div className="sm:col-span-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
              <div className="text-green-700 font-medium">Tên biến thể sẽ được tạo:</div>
              <div className="text-green-800 font-semibold mt-1">{finalVariantName || "(Nhập tên cơ bản và khối lượng)"}</div>
            </div>
            {nameValidation.warnings.length > 0 && (
              <div className="mt-2 text-xs text-amber-600">
                {nameValidation.warnings.map((warning, idx) => (
                  <div key={idx}>⚠️ {warning}</div>
                ))}
              </div>
            )}
          </div>
          <Input placeholder="SKU" value={sku} onChange={handleSku} />
          <div></div> 
          <Input type="number" min={0} step="1" placeholder="Giá (VND)" value={price} onChange={handlePrice} />
          <div className="grid grid-cols-2 gap-2">
            <select aria-label="Chế độ khuyến mãi" className="border rounded px-2 py-1 text-sm" value={discountMode} onChange={handleModeChange}>
              <option value="PERCENT">Khuyến mãi %</option>
              <option value="AMOUNT">Giá sau giảm</option>
            </select>
            {discountMode === "PERCENT" ? (
              <Input type="number" min={0} max={100} step="1" placeholder="KM %" value={discountPercent} onChange={handleDiscount} />
            ) : (
              <Input type="number" min={0} step="1" placeholder="Giá sau giảm (VND)" value={discountAmount} onChange={handleDiscountAmount} />
            )}
          </div>
          <Input type="number" min={0} step="1" placeholder="Kho" value={stock} onChange={handleStock} />
          {afterPriceText && (
            <div className="md:col-span-2 text-sm text-muted-foreground">{afterPriceText}</div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" disabled={!!disabled} onClick={handleAdd}>Thêm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type EditVariantDialogProps = {
  open: boolean;
  baseName: string; 
  weight: string;
  sku: string;
  price: string;
  discountPercent: string;
  discountAmount: string; 
  discountMode: "PERCENT" | "AMOUNT";
  stock: string;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onBaseNameChange: (v: string) => void; 
  onWeightChange: (v: string) => void; 
  onSkuChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onDiscountPercentChange: (v: string) => void;
  onDiscountAmountChange: (v: string) => void;
  onDiscountModeChange: (v: "PERCENT" | "AMOUNT") => void;
  onStockChange: (v: string) => void;
  onSave: () => void;
};

export function EditVariantDialog(props: EditVariantDialogProps) {
  const { open, baseName, weight, sku, price, discountPercent, discountAmount, discountMode, stock, saving, onOpenChange, onBaseNameChange, onWeightChange, onSkuChange, onPriceChange, onDiscountPercentChange, onDiscountAmountChange, onDiscountModeChange, onStockChange, onSave } = props;

  const handleOpenChange = useCallback((o: boolean) => onOpenChange(o), [onOpenChange]);
  const handleBaseName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onBaseNameChange(e.target.value), [onBaseNameChange]);
  const handleWeight = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onWeightChange(e.target.value), [onWeightChange]);
  const handleSku = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSkuChange(e.target.value), [onSkuChange]);
  const handlePrice = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onPriceChange(e.target.value), [onPriceChange]);
  const handleDiscount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onDiscountPercentChange(e.target.value), [onDiscountPercentChange]);
  const handleDiscountAmount = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onDiscountAmountChange(e.target.value), [onDiscountAmountChange]);
  const handleModeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => onDiscountModeChange(e.target.value as "PERCENT" | "AMOUNT"), [onDiscountModeChange]);
  const handleStock = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onStockChange(e.target.value), [onStockChange]);
  const handleSave = useCallback(() => onSave(), [onSave]);

  const finalVariantName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(baseName, weight);
    return nameValidation.suggestedName || baseName;
  }, [baseName, weight]);

  const nameValidation = useMemo(() => {
    return validateAndSuggestVariantName(baseName, weight);
  }, [baseName, weight]);

  const afterPriceText = (() => {
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) return null;
    const fmt = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });
    if (discountMode === "AMOUNT") {
      const amt = discountAmount === "" ? null : Number(discountAmount);
      if (amt == null || !Number.isFinite(amt) || amt < 0) return null;
      return `Giá sau giảm: ${fmt.format(Math.max(0, Math.min(amt, p)))}`;
    }
    const pct = discountPercent === "" ? null : Number(discountPercent);
    if (pct == null || !Number.isFinite(pct) || pct < 0 || pct > 100) return null;
    const after = Math.max(0, Math.round(p * (1 - pct / 100)));
    return `Giá sau giảm: ${fmt.format(after)}`;
  })();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa biến thể</DialogTitle>
          <DialogDescription>Cập nhật thông tin biến thể</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Tên cơ bản (không bao gồm khối lượng)</label>
            <Input placeholder="Ví dụ: Hạt điều rang muối" value={baseName} onChange={handleBaseName} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Khối lượng (gram)</label>
            <Input type="number" min={0} step="1" placeholder="Ví dụ: 500" value={weight} onChange={handleWeight} />
          </div>
          <div className="sm:col-span-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
              <div className="text-green-700 font-medium">Tên biến thể sẽ được lưu:</div>
              <div className="text-green-800 font-semibold mt-1">{finalVariantName || "(Nhập tên cơ bản và khối lượng)"}</div>
            </div>
            {nameValidation.warnings.length > 0 && (
              <div className="mt-2 text-xs text-amber-600">
                {nameValidation.warnings.map((warning, idx) => (
                  <div key={idx}>⚠️ {warning}</div>
                ))}
              </div>
            )}
          </div>
          <Input placeholder="SKU" value={sku} onChange={handleSku} />
          <div></div> 
          <Input type="number" min={0} step="1" placeholder="Giá (VND)" value={price} onChange={handlePrice} />
          <div className="grid grid-cols-2 gap-2">
            <select aria-label="Chế độ khuyến mãi" className="border rounded px-2 py-1 text-sm" value={discountMode} onChange={handleModeChange}>
              <option value="PERCENT">Khuyến mãi %</option>
              <option value="AMOUNT">Giá sau giảm</option>
            </select>
            {discountMode === "PERCENT" ? (
              <Input type="number" min={0} max={100} step="1" placeholder="KM %" value={discountPercent} onChange={handleDiscount} />
            ) : (
              <Input type="number" min={0} step="1" placeholder="Giá sau giảm (VND)" value={discountAmount} onChange={handleDiscountAmount} />
            )}
          </div>
          <Input type="number" min={0} step="1" placeholder="Kho" value={stock} onChange={handleStock} />
          {afterPriceText && (
            <div className="md:col-span-2 text-sm text-muted-foreground">{afterPriceText}</div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" disabled={!!saving} onClick={handleSave}>{saving ? "Đang lưu…" : "Lưu"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
