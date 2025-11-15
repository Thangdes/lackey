"use client";
import React, { useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type DiscountDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  code: string;
  description: string;
  type: "FIXED_AMOUNT" | "PERCENTAGE" | string;
  value: string; 
  isActive: boolean;
  startDate: string; 
  endDate: string;
  minAmount: string; 
  usageLimit?: string;
  perUserLimit?: string;
  maxDiscountAmount?: string;
  stackable?: boolean;
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
};

export function DiscountDialog(props: DiscountDialogProps) {
  const { open, mode, code, description, type, value, isActive, startDate, endDate, minAmount, usageLimit = "", perUserLimit = "", maxDiscountAmount = "", stackable = false, saving, onOpenChange, onChange, onSave } = props;

  const handleOpen = useCallback((o: boolean) => onOpenChange(o), [onOpenChange]);
  const handleText = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.name, e.target.value), [onChange]);
  const handleType = useCallback((v: string) => onChange("type", v), [onChange]);
  const handleActive = useCallback((v: boolean) => onChange("isActive", v), [onChange]);
  const handleStackable = useCallback((v: boolean) => onChange("stackable", v), [onChange]);
  const handleSave = useCallback(() => onSave(), [onSave]);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-[calc(100%-1rem)] sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm mã giảm giá" : "Sửa mã giảm giá"}</DialogTitle>
          <DialogDescription>{mode === "create" ? "Tạo một mã giảm giá mới" : "Cập nhật thông tin mã giảm giá"}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Mã</label>
              <Input name="code" value={code} onChange={handleText} placeholder="VD: SALE20" autoFocus />
            </div>
            <div>
              <label className="block text-sm mb-1">Loại</label>
              <Select value={String(type || "FIXED_AMOUNT")} onValueChange={handleType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED_AMOUNT">Cố định</SelectItem>
                  <SelectItem value="PERCENTAGE">Phần trăm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Giá trị</label>
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step={type === "PERCENTAGE" ? 1 : 1000}
                name="value"
                value={value}
                onChange={handleText}
                placeholder={type === "PERCENTAGE" ? "VD: 10 (tính %)" : "VD: 50000 (đ)"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {type === "PERCENTAGE" ? "Nhập % giảm (0–100)" : "Nhập số tiền giảm (VNĐ)"}
              </p>
            </div>
            <div>
              <label className="block text-sm mb-1">Tối thiểu áp dụng</label>
              <Input type="number" inputMode="decimal" min={0} step={1000} name="minAmount" value={minAmount} onChange={handleText} placeholder="VD: 200000" />
              <p className="mt-1 text-xs text-muted-foreground">Đơn hàng tối thiểu để dùng mã (bỏ trống nếu không yêu cầu)</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Giới hạn lượt dùng (tổng)</label>
              <Input type="number" inputMode="numeric" min={0} step={1} name="usageLimit" value={usageLimit} onChange={handleText} placeholder="VD: 100" />
              <p className="mt-1 text-xs text-muted-foreground">Bỏ trống nếu không giới hạn</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Giới hạn/khách hàng</label>
              <Input type="number" inputMode="numeric" min={0} step={1} name="perUserLimit" value={perUserLimit} onChange={handleText} placeholder="VD: 1" />
              <p className="mt-1 text-xs text-muted-foreground">Bỏ trống nếu không giới hạn</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Mức giảm tối đa</label>
              <Input type="number" inputMode="decimal" min={0} step={1000} name="maxDiscountAmount" value={maxDiscountAmount} onChange={handleText} placeholder="VD: 200000" />
              <p className="mt-1 text-xs text-muted-foreground">Áp dụng với mã theo %</p>
            </div>
            <div>
              <label className="block text-sm mb-1">Ngày bắt đầu</label>
              <Input type="datetime-local" name="startDate" value={startDate} onChange={handleText} />
            </div>
            <div>
              <label className="block text-sm mb-1">Ngày kết thúc</label>
              <Input type="datetime-local" name="endDate" value={endDate} onChange={handleText} />
              <p className="mt-1 text-xs text-muted-foreground">Bỏ trống nếu không có ngày hết hạn</p>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea name="description" className="w-full border rounded p-2" rows={3} value={description} onChange={handleText} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="active" checked={!!isActive} onCheckedChange={(checked: boolean) => handleActive(checked)} />
            <label htmlFor="active" className="text-sm">Đang hoạt động</label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="stackable" checked={!!stackable} onCheckedChange={(checked: boolean) => handleStackable(checked)} />
            <label htmlFor="stackable" className="text-sm">Cho phép áp dụng cùng mã khác</label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={!!saving}>{saving ? "Đang lưu…" : "Lưu"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
