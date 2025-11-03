"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constant/route";
import { CheckCircle2, ShoppingCart, ArrowRight, Sparkles } from "lucide-react";

export type AddToCartToastPayload = {
  name: string;
  thumbnailUrl?: string | null;
  quantity?: number;
};

/**
 * Gold-themed variant of AddToCartToast
 * Premium golden design with more yellow/amber emphasis
 */
export function showAddedToCartToastGold({ name, thumbnailUrl, quantity = 1 }: AddToCartToastPayload) {
  toast.custom((t) => (
    <div className="flex w-[340px] sm:w-[380px] items-start gap-3 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-4 shadow-[0_8px_32px_rgba(245,158,11,0.3),0_0_0_2px_rgba(251,191,36,0.4)] transition-all duration-300 animate-in slide-in-from-bottom-5">
      {/* Success Icon with Sparkles */}
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 shadow-lg shadow-amber-400/50 shrink-0 animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="w-7 h-7 text-amber-950 drop-shadow-sm" strokeWidth={2.5} />
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-600 animate-pulse" strokeWidth={2} />
      </div>

      {/* Product Image */}
      {thumbnailUrl ? (
        <div className="relative h-16 w-16 overflow-hidden rounded-xl border-3 border-amber-400 bg-white shrink-0 shadow-lg animate-in fade-in duration-700">
          <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-amber-400/20" />
        </div>
      ) : null}

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-2">
        {/* Title with Icon */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
            <ShoppingCart className="w-3.5 h-3.5 text-amber-950" strokeWidth={2.5} />
          </div>
          <div className="font-bold text-amber-900 truncate uppercase tracking-wider text-sm">
            Đã thêm vào giỏ hàng
          </div>
        </div>

        {/* Product Name */}
        <div className="text-sm text-amber-950 line-clamp-2 leading-snug font-semibold">
          {name}
        </div>

        {/* Quantity Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400/20 to-yellow-400/20 border-2 border-amber-400/40 shadow-sm">
          <span className="text-xs text-amber-700 font-semibold">Số lượng:</span>
          <span className="text-sm text-amber-900 font-bold">{quantity}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button 
            asChild 
            size="sm" 
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 text-amber-950 font-bold uppercase tracking-wide text-xs shadow-lg shadow-amber-400/40 hover:shadow-xl hover:shadow-amber-400/50 transition-all duration-200 border-2 border-amber-500 group"
          >
            <Link href={ROUTES.cart} onClick={() => toast.dismiss(t)}>
              <span>Xem giỏ</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" strokeWidth={3} />
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="h-9 px-4 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border-2 border-amber-400/50 hover:border-amber-500 font-semibold uppercase tracking-wide text-xs shadow-md hover:shadow-lg transition-all duration-200" 
            onClick={() => toast.dismiss(t)}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  ), { duration: 4000, position: "bottom-right" });
}
