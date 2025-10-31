"use client";

import React, { useEffect, useRef, useState } from "react";
import CartMiniClient from "./CartMiniClient";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";

export type MiniCartProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightSku?: string;
  title?: string;
};

export default function MiniCart({ open, onOpenChange, highlightSku, title = "Giỏ hàng" }: MiniCartProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    const t = setTimeout(() => { try { el.scrollTop = el.scrollHeight; } catch {} }, 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const handler = () => {
      if (!open) return;
      const el = scrollRef.current;
      if (!el) return;
      try { el.scrollTop = el.scrollHeight; } catch {}
    };
    if (typeof window !== 'undefined') window.addEventListener('cart:changed', handler as EventListener);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('cart:changed', handler as EventListener); };
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      setAtBottom(nearBottom);
    };
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-[85vh] max-h-screen overflow-hidden scroll-x-auto">
        <SheetHeader className="shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-black/10">
          <SheetTitle className="text-base sm:text-lg truncate">{title}</SheetTitle>
        </SheetHeader>
        <div ref={scrollRef} className="relative flex-1 overflow-auto">
          <div className="p-2">
            <CartMiniClient hideMiniAction highlightSku={highlightSku} />
          </div>
          {!atBottom && (
            <button
              type="button"
              onClick={() => { const el = scrollRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }}
              className="absolute right-3 bottom-3 z-10 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black text-white shadow ring-1 ring-black/10 hover:bg-black/90"
              title="Cuộn xuống cuối"
              aria-label="Cuộn xuống cuối"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
