"use client";

import Link from "next/link";
// import { CART_UI } from "@/constant/ui"; // Unused for now
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
    total,
    formatVND,
  } = props;

  return (
    <div className="bg-white">
      {/* Total */}
      <div className="flex items-center justify-between py-8 border-b border-gray-200" aria-live="polite">
        <span className="text-base font-semibold text-gray-900 uppercase tracking-wide">
          Total
        </span>
        <span className="text-2xl font-bold text-gray-900">
          {formatVND(total)}
        </span>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-600 text-right mt-4 mb-6">
        Taxes included. Discounts and shipping calculated at checkout.
      </p>

      {/* Checkout Buttons */}
      <div className="space-y-3">
        <Link
          href={ROUTES.checkout ?? "/checkout"}
          className="block w-full py-3.5 bg-black text-white text-center text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Go to Checkout
        </Link>
        
        {/* Shop Pay Button */}
        <button
          type="button"
          className="w-full py-3.5 bg-[#5a31f4] text-white text-center text-sm font-semibold hover:bg-[#4c28d4] transition-colors flex items-center justify-center gap-2"
        >
          <svg width="50" height="20" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M49.5 10C49.5 15.2467 45.2467 19.5 40 19.5C34.7533 19.5 30.5 15.2467 30.5 10C30.5 4.75329 34.7533 0.5 40 0.5C45.2467 0.5 49.5 4.75329 49.5 10Z" fill="white" stroke="white"/>
            <path d="M19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5C15.2467 0.5 19.5 4.75329 19.5 10Z" fill="white" stroke="white"/>
          </svg>
          <span>Pay</span>
        </button>
      </div>
    </div>
  );
}
