"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constant/route";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";
import type { AddToCartToastPayload } from "@/type/toast";

export type { AddToCartToastPayload };

export function showAddedToCartToast({ name, thumbnailUrl, quantity = 1 }: AddToCartToastPayload) {
  toast.custom((t) => (
    <div className="flex w-[340px] sm:w-[380px] flex-col rounded-2xl border border-neutral-100 bg-white shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-5 overflow-hidden">
      <div className="flex items-center gap-3 bg-[var(--brand-accent)] px-4 py-3 text-white">
        <div className="flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
        </div>
        <div className="text-sm font-semibold tracking-wide flex-1">
          ĐÃ THÊM VÀO GIỎ
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-start gap-4 p-4">
        {thumbnailUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 shrink-0">
            <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 w-16 rounded-xl border border-neutral-100 bg-neutral-50 shrink-0">
            <ShoppingCart className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-1.5 pt-1">
          <div className="text-sm text-neutral-900 line-clamp-2 leading-snug font-medium">
            {name}
          </div>

          <div className="inline-flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">Số lượng:</span>
            <span className="text-xs text-neutral-900 font-semibold">{quantity}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 pb-4">
        <Button 
          asChild 
          size="sm" 
          className="flex-1 h-10 px-4 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 transition-all"
        >
          <Link href={ROUTES.cart} onClick={() => toast.dismiss(t)}>
            XEM GIỎ HÀNG
          </Link>
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-10 px-4 rounded-xl border border-neutral-200 bg-white text-neutral-700 font-medium text-xs hover:bg-neutral-50 hover:text-neutral-900 transition-all" 
          onClick={() => toast.dismiss(t)}
        >
          TIẾP TỤC MUA SẮM
        </Button>
      </div>
    </div>
  ), { duration: 4000, position: "bottom-right" });
}
