"use client";

import React, { useEffect, useRef } from "react";
import CartMiniClient from "./CartMiniClient";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useSmartCart } from "@/hook/useCart";

export type MiniCartProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightSku?: string;
  title?: string;
};

export default function MiniCart({ open, onOpenChange, highlightSku }: MiniCartProps) {

  const cart = useSmartCart();
  const itemCount = cart.items?.length ?? 0;


  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full max-h-screen overflow-hidden">
        <div className="shrink-0 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide">
              SHOPPING CART ({itemCount})
            </h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <CartMiniClient highlightSku={highlightSku} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
