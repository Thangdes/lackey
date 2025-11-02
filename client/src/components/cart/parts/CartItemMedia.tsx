"use client";

import Link from "next/link";
import Image from "next/image";
import type { SmartCartItem } from "@/type/cart";
import { buildProductDetailPath } from "@/constant/route";

export type CartItemMediaProps = {
  item: SmartCartItem;
  size?: "sm" | "md";
};

export default function CartItemMedia({ item: it, size = "md" }: CartItemMediaProps) {
  const boxClass = size === "sm"
    ? "relative h-12 w-12 sm:h-20 sm:w-20"
    : "relative h-16 w-16 sm:h-20 sm:w-20";
  const imgSizes = size === "sm" ? "(max-width: 640px) 48px, 80px" : "(max-width: 640px) 64px, 80px";
  return (
    <Link
      href={buildProductDetailPath(it.productSlug || it.productId || it.sku)}
      className={`${boxClass} shrink-0 overflow-hidden rounded-xl border border-black/10 block`}
      aria-label={it.productName}
    >
      <Image
        src={it.thumbnailUrl || "/images/middle/banner.webp"}
        alt={it.productName}
        fill
        unoptimized
        sizes={imgSizes}
        className="object-cover"
      />
    </Link>
  );
}
