"use client";

import Link from "next/link";
import { ROUTES } from "@/constant/route";

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
    total,
    formatVND,
  } = props;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between py-8 border-b border-gray-200" aria-live="polite">
        <span className="text-base font-semibold text-gray-900 uppercase tracking-wide">
          Tổng cộng
        </span>
        <span className="text-2xl font-bold text-gray-900">
          {formatVND(total)}
        </span>
      </div>

      <p className="text-sm text-gray-600 text-right mt-4 mb-6">
        Đã bao gồm thuế. Giảm giá và phí vận chuyển được tính khi thanh toán.
      </p>

      <div className="space-y-3">
        <Link
          href={`${ROUTES.checkout ?? "/checkout"}?source=cart`}
          className="block w-full py-3.5 bg-black text-white text-center text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Tiến hành thanh toán
        </Link>
      </div>
    </div>
  );
}
