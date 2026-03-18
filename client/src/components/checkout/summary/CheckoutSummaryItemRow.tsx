"use client";

import type { LocalCartItem as TLocalCartItem } from "@/type/checkout";

type Props = {
  item: TLocalCartItem;
  formatVND: (n: number) => string;
  warnings?: string[];
  size?: "xs" | "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<Props["size"]>, string> = {
  xs: "h-12 w-12",
  sm: "h-14 w-14",
  md: "h-16 w-16",
  lg: "h-20 w-20",
};

export function CheckoutSummaryItemRow({ item, formatVND, warnings, size = "sm" }: Props) {
  const imgCls = sizeMap[size] || sizeMap.sm;
  return (
    <div className="flex items-start gap-4">
      {/* Image with quantity badge */}
      <div className="relative flex-shrink-0">
        <div className={`${imgCls} overflow-hidden rounded border border-gray-200 bg-gray-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnailUrl || "https://static-00.iconduck.com/assets.00/image-file-emoji-2048x2048-n9mfgmbn.png"}
            alt={item.productName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        {/* Quantity badge */}
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white text-xs font-semibold border-2 border-white">
          {item.quantity}
        </div>
      </div>
      
      {/* Product info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
          {item.productName}
        </h4>
        {!!item.variantName && (
          <p className="mt-1 text-xs text-gray-600">{item.variantName}</p>
        )}
        {!!(warnings && warnings.length) && (
          <ul className="mt-1 space-y-0.5 text-xs text-amber-600">
            {warnings.map((msg, idx) => (
              <li key={idx}>⚠ {msg}</li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Price */}
      <div className="flex-shrink-0 text-sm font-semibold text-gray-900">
        {formatVND((item.price || 0) * item.quantity)}
      </div>
    </div>
  );
}
