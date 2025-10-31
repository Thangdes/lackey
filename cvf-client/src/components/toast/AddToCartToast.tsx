"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constant/route";

export type AddToCartToastPayload = {
  name: string;
  thumbnailUrl?: string | null;
  quantity?: number;
};

export function showAddedToCartToast({ name, thumbnailUrl, quantity = 1 }: AddToCartToastPayload) {
  toast.custom((t) => (
    <div className="flex w-[320px] sm:w-[360px] items-start gap-3 rounded-lg border border-black/10 bg-white p-3 shadow-lg">
      {thumbnailUrl ? (
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-neutral-100">
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-neutral-900 truncate">Đã thêm vào giỏ</div>
        <div className="mt-0.5 text-[12px] text-neutral-700 line-clamp-2">{name}</div>
        <div className="mt-0.5 text-[11px] text-neutral-500">Số lượng: <span className="font-medium text-neutral-800">{quantity}</span></div>
        <div className="mt-2 flex items-center gap-2">
          <Button asChild size="sm" className="h-8 px-3">
            <Link href={ROUTES.cart} onClick={() => toast.dismiss(t)}>
              Xem giỏ hàng
            </Link>
          </Button>
          <Button size="sm" variant="secondary" className="h-8 px-3" onClick={() => toast.dismiss(t)}>
            Tiếp tục mua
          </Button>
        </div>
      </div>
    </div>
  ), { duration: 2500, position: "bottom-right" });
}
