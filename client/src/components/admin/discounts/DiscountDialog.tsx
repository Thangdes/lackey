"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdminFormDialog } from "@/components/admin/shared/AdminFormDialog";
import { AdminFormField } from "@/components/admin/shared/AdminFormField";

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
  const {
    open,
    mode,
    code,
    description,
    type,
    value,
    isActive,
    startDate,
    endDate,
    minAmount,
    usageLimit = "",
    perUserLimit = "",
    maxDiscountAmount = "",
    stackable = false,
    saving,
    onOpenChange,
    onChange,
    onSave,
  } = props;

  return (
    <AdminFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Thêm mã giảm giá" : "Sửa mã giảm giá"}
      description={mode === "create" ? "Tạo một mã giảm giá mới" : "Cập nhật thông tin mã giảm giá"}
      onSave={onSave}
      saving={saving}
      saveLabel={mode === "create" ? "Tạo" : "Cập nhật"}
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminFormField
          label="Mã giảm giá"
          value={code}
          onChange={(v) => onChange("code", v)}
          placeholder="VD: SALE20"
          required
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            Loại <span className="text-destructive">*</span>
          </label>
          <Select value={String(type || "FIXED_AMOUNT")} onValueChange={(v) => onChange("type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIXED_AMOUNT">Cố định (VNĐ)</SelectItem>
              <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AdminFormField
          label="Giá trị"
          type="number"
          value={value}
          onChange={(v) => onChange("value", v)}
          placeholder={type === "PERCENTAGE" ? "VD: 10" : "VD: 50000"}
          hint={type === "PERCENTAGE" ? "Nhập % giảm (0–100)" : "Nhập số tiền giảm (VNĐ)"}
          min={0}
          step={type === "PERCENTAGE" ? 1 : 1000}
          required
        />

        <AdminFormField
          label="Đơn hàng tối thiểu"
          type="number"
          value={minAmount}
          onChange={(v) => onChange("minAmount", v)}
          placeholder="VD: 200000"
          hint="Bỏ trống nếu không yêu cầu"
          min={0}
          step={1000}
        />

        <AdminFormField
          label="Giới hạn lượt dùng (tổng)"
          type="number"
          value={usageLimit}
          onChange={(v) => onChange("usageLimit", v)}
          placeholder="VD: 100"
          hint="Bỏ trống nếu không giới hạn"
          min={0}
        />

        <AdminFormField
          label="Giới hạn/khách hàng"
          type="number"
          value={perUserLimit}
          onChange={(v) => onChange("perUserLimit", v)}
          placeholder="VD: 1"
          hint="Bỏ trống nếu không giới hạn"
          min={0}
        />

        <AdminFormField
          label="Mức giảm tối đa"
          type="number"
          value={maxDiscountAmount}
          onChange={(v) => onChange("maxDiscountAmount", v)}
          placeholder="VD: 200000"
          hint="Áp dụng với mã theo %"
          min={0}
          step={1000}
        />

        <AdminFormField
          label="Ngày bắt đầu"
          type="datetime-local"
          value={startDate}
          onChange={(v) => onChange("startDate", v)}
        />

        <AdminFormField
          label="Ngày kết thúc"
          type="datetime-local"
          value={endDate}
          onChange={(v) => onChange("endDate", v)}
          hint="Bỏ trống nếu không có ngày hết hạn"
        />
      </div>

      <AdminFormField
        label="Mô tả"
        type="textarea"
        value={description}
        onChange={(v) => onChange("description", v)}
        placeholder="Mô tả về mã giảm giá"
        rows={3}
      />

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          <Switch id="active" checked={!!isActive} onCheckedChange={(checked) => onChange("isActive", checked)} />
          <label htmlFor="active" className="text-sm font-medium cursor-pointer">
            Đang hoạt động
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="stackable" checked={!!stackable} onCheckedChange={(checked) => onChange("stackable", checked)} />
          <label htmlFor="stackable" className="text-sm font-medium cursor-pointer">
            Cho phép áp dụng cùng mã khác
          </label>
        </div>
      </div>
    </AdminFormDialog>
  );
}
