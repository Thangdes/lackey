"use client";

import type { LocalCartItem as TLocalCartItem } from "@/type/checkout";
import React, { useMemo, useState } from "react";
// import { ReceiptText, Package, Truck, CircleDollarSign } from "lucide-react"; // Unused for now
// import { ORDER_SUMMARY } from "@/constant/checkout"; // Unused for now
// import { OrderItemRow } from "./OrderItemRow"; // Unused for now
import { WarningList } from "./WarningList";
import { CheckoutSummaryItemRow } from "./CheckoutSummaryItemRow";

type Props = {
  items: TLocalCartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  formatVND: (n: number) => string;
  globalWarnings?: string[];
  itemWarnings?: Record<string, string[]>;
  discountAmount?: number;
  discountCode?: string;
  plain?: boolean;
  hideTitle?: boolean;
  showThumbnails?: boolean;
  imageSize?: "xs" | "sm" | "md" | "lg";
  collapsible?: boolean;
  collapsedCount?: number;
  showBackLink?: boolean;
};

export const OrderSummary = ({ items, subtotal, shippingFee, total, formatVND, globalWarnings, itemWarnings, discountAmount, discountCode, plain, imageSize = "sm", collapsible, collapsedCount = 2, showBackLink = true }: Props) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    plain ? <>{children}</> : <div className="rounded-2xl border border-black/10 bg-white p-5">{children}</div>
  );
  const [expanded, setExpanded] = useState(false);
  const visibleItems = useMemo(() => {
    if (collapsible && !expanded) {
      return items.slice(0, Math.max(0, collapsedCount || 0));
    }
    return items;
  }, [items, collapsible, expanded, collapsedCount]);
  
  return (
    <Wrapper>
      <WarningList globalWarnings={globalWarnings} itemWarnings={itemWarnings} showBackLink={showBackLink} />
      
      {/* Product List */}
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-gray-600">Giỏ hàng trống</div>
        )}
        {visibleItems.map((it) => (
          <CheckoutSummaryItemRow 
            key={it.sku} 
            item={it} 
            formatVND={formatVND} 
            warnings={itemWarnings?.[it.sku]} 
            size={imageSize} 
          />
        ))}
        {collapsible && items.length > Math.max(0, collapsedCount || 0) && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
            >
              {expanded ? "Thu gọn" : `Xem tất cả (${items.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Total Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium text-gray-900">{formatVND(subtotal)}</span>
        </div>
        
        {(discountAmount ?? 0) > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Giảm giá{discountCode ? ` (${discountCode})` : ""}</span>
            <span className="font-medium text-green-600">- {formatVND(discountAmount || 0)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">{formatVND(shippingFee)}</span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900 uppercase tracking-wide">Total</span>
          <span className="text-xl font-bold text-gray-900">VND {formatVND(total)}</span>
        </div>
      </div>
    </Wrapper>
  );
};
