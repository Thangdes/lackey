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
    <div className="flex w-[340px] sm:w-[380px] flex-col rounded-none border-3 border-black bg-[#f5f1e8] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 border-b-3 border-black bg-[#fff100] px-4 py-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-none border-2 border-black bg-black shrink-0">
          <CheckCircle2 className="w-6 h-6 text-[#fff100]" strokeWidth={2.5} />
        </div>
        <div className="font-[family-name:var(--font-retro)] text-base font-bold text-black uppercase tracking-wider flex-1">
          ĐÃ THÊM VÀO GIỎ
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex items-start gap-3 p-4">
        {thumbnailUrl ? (
          <div className="relative h-16 w-16 overflow-hidden rounded-none border-2 border-black bg-white shrink-0">
            <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 w-16 rounded-none border-2 border-black bg-white shrink-0">
            <ShoppingCart className="w-8 h-8 text-black" strokeWidth={2} />
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-sm text-[#2d2d2d] line-clamp-2 leading-snug font-bold">
            {name}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-white border-2 border-black">
            <span className="text-xs text-[#2d2d2d] font-bold uppercase">Số lượng:</span>
            <span className="text-xs text-black font-bold">{quantity}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pb-4">
        <Button 
          asChild 
          size="sm" 
          className="flex-1 h-10 px-4 rounded-none border-3 border-black bg-[#2d2d2d] text-white font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          <Link href={ROUTES.cart} onClick={() => toast.dismiss(t)}>
            XEM GIỎ
          </Link>
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-10 px-4 rounded-none border-3 border-black bg-white text-black font-bold uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all" 
          onClick={() => toast.dismiss(t)}
        >
          TIẾP TỤC
        </Button>
      </div>
    </div>
  ), { duration: 4000, position: "bottom-right" });
}
