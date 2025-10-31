"use client";

import type { LocalCartItem as TLocalCartItem } from "@/type/checkout";
import React, { useMemo, useState } from "react";
import { ReceiptText, Package, Truck, CircleDollarSign } from "lucide-react";
import { ORDER_SUMMARY } from "@/constant/checkout";
import { OrderItemRow } from "./OrderItemRow";
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

export const OrderSummary = ({ items, subtotal, shippingFee, total, formatVND, globalWarnings, itemWarnings, discountAmount, discountCode, plain, hideTitle, showThumbnails, imageSize = "sm", collapsible, collapsedCount = 2, showBackLink = true }: Props) => {
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
      {!hideTitle && (
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <ReceiptText size={16} aria-hidden className="text-black/80" />
          {ORDER_SUMMARY.title}
        </h3>
      )}
      <WarningList globalWarnings={globalWarnings} itemWarnings={itemWarnings} showBackLink={showBackLink} />
      <div className="mt-3 space-y-3 text-sm">
        {items.length === 0 && (
          <div className="text-black/60">{ORDER_SUMMARY.empty}</div>
        )}
        {visibleItems.map((it) => (
          showThumbnails
            ? <CheckoutSummaryItemRow key={it.sku} item={it} formatVND={formatVND} warnings={itemWarnings?.[it.sku]} size={imageSize} />
            : <OrderItemRow key={it.sku} item={it} formatVND={formatVND} warnings={itemWarnings?.[it.sku]} />
        ))}
        {collapsible && items.length > Math.max(0, collapsedCount || 0) && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-sm font-medium text-black hover:underline"
            >
              {expanded ? "Thu gọn" : `Xem tất cả (${items.length})`}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5"><Package size={14} aria-hidden className="text-black/60" /> {ORDER_SUMMARY.subtotal}</span>
          <span className="font-semibold text-red-600">{formatVND(subtotal)}</span>
        </div>
        {(discountAmount ?? 0) > 0 && (
          <div className="flex items-center justify-between text-emerald-700"><span>Giảm giá{discountCode ? ` (${discountCode})` : ""}</span><span className="font-semibold">- {formatVND(discountAmount || 0)}</span></div>
        )}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5"><Truck size={14} aria-hidden className="text-black/60" /> {ORDER_SUMMARY.shipping}</span>
          <span className="font-semibold text-red-600">{formatVND(shippingFee)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-black/10 pt-2">
          <span className="inline-flex items-center gap-1.5 font-semibold"><CircleDollarSign size={16} aria-hidden className="text-black/80" /> {ORDER_SUMMARY.total}</span>
          <span className="font-semibold text-red-700">{formatVND(total)}</span>
        </div>
      </div>
    </Wrapper>
  );
};
