"use client";

import type { LocalCartItem as TLocalCartItem } from "@/type/checkout";

type Props = {
  item: TLocalCartItem;
  formatVND: (n: number) => string;
};

export function CheckoutItemRow({ item, formatVND }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/[0.03]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnailUrl || 
            "https://static-00.iconduck.com/assets.00/image-file-emoji-2048x2048-n9mfgmbn.png"}
          alt={item.productName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{item.productName}</div>
        {!!item.variantName && (
          <div className="text-xs text-black/60">{item.variantName}</div>
        )}
        <div className="mt-1 text-xs text-black/60">Số lượng: {item.quantity}</div>
      </div>
      <div className="shrink-0 whitespace-nowrap font-semibold">
        {formatVND((item.price || 0) * item.quantity)}
      </div>
    </div>
  );
}
