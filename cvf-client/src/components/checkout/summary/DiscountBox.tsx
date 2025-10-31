"use client";

import type React from "react";
import { CART_UI } from "@/constant/ui";
import { DiscountBoxProps } from "@/type/checkout";
import { Ticket } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DiscountBox({
  options,
  selectedCode,
  appliedCode,
  discountAmount,
  applyingDiscount,
  itemsLength,
  onSelect,
  onClear,
  formatVND,
  plain,
}: DiscountBoxProps & { plain?: boolean }) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    plain ? <>{children}</> : <div className="rounded-2xl border border-black/10 bg-white p-5 mb-4 space-y-3">{children}</div>
  );
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[DISCOUNT_BOX]', {
      selectedCode,
      appliedCode,
      discountAmount,
      applyingDiscount,
      optionsCount: options.length,
    });
  }
  
  return (
    <Wrapper>
      <label className="flex items-center gap-1.5 text-black/70 mb-1"><Ticket size={14} /> {CART_UI.voucher}</label>

      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <Select value={selectedCode || undefined} onValueChange={onSelect}>
            <SelectTrigger className="w-full" disabled={applyingDiscount || itemsLength === 0}>
              <SelectValue placeholder="Chọn mã giảm giá" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.code} value={opt.code}>
                  {opt.code}{opt.description ? ` - ${opt.description}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {appliedCode && (
          <button type="button" className="rounded-lg border px-3 py-2 text-sm" onClick={onClear}>Bỏ áp dụng</button>
        )}
      </div>
      {appliedCode && (
        <div className="text-xs text-emerald-700">Đã áp dụng mã {appliedCode}. Giảm {formatVND(discountAmount)}</div>
      )}
    </Wrapper>
  );
}
