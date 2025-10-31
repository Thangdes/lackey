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
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className={`${imgCls} shrink-0 overflow-hidden rounded-lg bg-black/[0.03]`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnailUrl || "https://static-00.iconduck.com/assets.00/image-file-emoji-2048x2048-n9mfgmbn.png"}
            alt={item.productName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">{item.productName} × {item.quantity}</div>
          {!!item.variantName && <div className="text-xs text-black/60">{item.variantName}</div>}
          {!!(warnings && warnings.length) && (
            <ul className="mt-1 space-y-0.5 text-[11px] text-amber-700">
              {warnings.map((msg, idx) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="shrink-0 whitespace-nowrap font-semibold">
        {formatVND((item.price || 0) * item.quantity)}
      </div>
    </div>
  );
}
