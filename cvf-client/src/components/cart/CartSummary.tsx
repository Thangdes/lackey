"use client";

import Link from "next/link";
import { FiClipboard, FiTruck, FiTag, FiDollarSign, FiBox, FiMapPin } from "react-icons/fi";
import { DiscountBox } from "@/components/checkout/summary/DiscountBox";
import { CART_UI } from "@/constant/ui";
import { ROUTES } from "@/constant/route";
import TrustBadges from "./parts/TrustBadges";

export type CartSummaryProps = {
  subtotal: number;
  effectiveShipping: number;
  total: number;
  itemsLength: number;
  options: { code: string; description?: string | null }[];
  selectedCode: string | null;
  appliedCode: string | null;
  discountAmount: number;
  applyingDiscount: boolean;
  onSelect: (code: string) => void;
  onClearDiscount: () => void;
  formatVND: (n?: number) => string;
  savings?: number;
  // New shipping address props
  shippingLoading?: boolean;
  currentAddress?: {
    city: string;
    district: string;
    ward: string;
  } | null;
  onChangeAddress?: () => void;
};

export function CartSummary(props: CartSummaryProps) {
  const {
    subtotal,
    effectiveShipping,
    total,
    itemsLength,
    options,
    selectedCode,
    appliedCode,
    discountAmount,
    applyingDiscount,
    onSelect,
    onClearDiscount,
    formatVND,
    savings,
    shippingLoading,
    currentAddress,
    onChangeAddress,
  } = props;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <FiClipboard className="shrink-0" /> {CART_UI.summary}
      </h3>
      <div className="mt-3 flex items-center justify-between text-sm" aria-live="polite">
        <span className="inline-flex items-center gap-1.5"><FiBox />{CART_UI.subtotal}</span>
        <span className="font-semibold">{formatVND(subtotal)}</span>
      </div>

      <div className="mt-3 text-sm">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-black/70" htmlFor="shipping-fee">
            <FiTruck /> {CART_UI.shipping}
          </label>
          <span id="shipping-fee" className="font-semibold">
            {shippingLoading ? (
              <span className="text-black/50">Đang tính...</span>
            ) : effectiveShipping === 0 ? (
              "Miễn phí"
            ) : (
              formatVND(effectiveShipping)
            )}
          </span>
        </div>
        
        {/* Address display and change button */}
        {currentAddress && (
          <div className="mt-2 flex items-start justify-between gap-2">
            <div className="flex-1 text-xs text-black/60">
              <div className="flex items-center gap-1">
                <FiMapPin className="shrink-0" />
                <span>Giao đến:</span>
              </div>
              <div className="mt-0.5 pl-4">
                {currentAddress.ward}, {currentAddress.district}, {currentAddress.city}
              </div>
            </div>
            {onChangeAddress && (
              <button
                onClick={onChangeAddress}
                className="shrink-0 text-xs text-[#AE1C2C] hover:underline"
                type="button"
              >
                Thay đổi
              </button>
            )}
          </div>
        )}
        
        {/* No address message */}
        {!currentAddress && !shippingLoading && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <FiMapPin className="shrink-0" />
              <span>Chưa có địa chỉ giao hàng</span>
            </div>
            {onChangeAddress && (
              <button
                onClick={onChangeAddress}
                className="text-xs text-[#AE1C2C] hover:underline"
                type="button"
              >
                Chọn địa chỉ
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 text-sm">
        <DiscountBox
          options={options}
          selectedCode={selectedCode || ""}
          appliedCode={appliedCode}
          discountAmount={discountAmount}
          applyingDiscount={applyingDiscount}
          itemsLength={itemsLength}
          onSelect={onSelect}
          onClear={onClearDiscount}
          formatVND={formatVND}
        />
        {appliedCode ? (
          <div className="mt-2 text-xs text-emerald-700" aria-live="polite">
            Đã tiết kiệm {formatVND(discountAmount)} với mã <b>{appliedCode}</b>
          </div>
        ) : null}
      </div>

      {typeof savings === 'number' && savings > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5"><FiTag />Tiết kiệm</span>
          <span className="font-semibold text-[--color-pomegranate-700]">- {formatVND(savings)}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="inline-flex items.center gap-1.5"><FiTag />{CART_UI.discount}</span>
        <span className="font-semibold text-[--color-pomegranate-700]">
          - {formatVND(appliedCode ? discountAmount : 0)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm border-t border-black/10 pt-3" aria-live="polite">
        <span className="font-semibold inline-flex items-center gap-1.5"><FiDollarSign />{CART_UI.total}</span>
        <span className="text-xl font-semibold text-[#AE1C2C] px-2 py-1 rounded">{formatVND(total)}</span>
      </div>

      <div className="mt-4 space-y-2">
        <Link
          href={ROUTES.checkout ?? "/checkout"}
          className="inline-flex w-full items-center justify-center rounded-lg border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          {CART_UI.checkout}
        </Link>
        <TrustBadges />
      </div>
    </div>
  );
}
