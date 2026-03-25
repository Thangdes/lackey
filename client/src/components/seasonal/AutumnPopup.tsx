"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Leaf, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AutumnPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenPopup = localStorage.getItem("autumn-popup-2024");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("autumn-popup-2024", "true");
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[96vw] sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden overflow-y-auto border-4 sm:border-8 border-double border-amber-700 bg-[#FFF8E7] shadow-2xl z-[999]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Ưu đãi mùa Thu</DialogTitle>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />

          <div className="absolute top-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 opacity-80 flex items-center justify-center gap-2 sm:gap-4">
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-150" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse delay-300" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-500" />
          </div>

          <DialogClose
            className="absolute top-1 right-2 sm:top-2 sm:right-3 z-30 bg-amber-700 hover:bg-amber-800 text-white rounded-full p-1.5 sm:p-2 transition-all shadow-lg hover:scale-110"
            onClick={handleClose}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </DialogClose>

          <div className="pt-8 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-6 md:px-10">
            <div className="relative w-full aspect-[4/3] mb-4 sm:mb-6 rounded-lg overflow-hidden shadow-xl border-2 sm:border-4 border-amber-700 mt-2 sm:mt-4">
              <Image
                src="/seasons/autumn.jpg"
                alt="Autumn Offer"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center space-y-3 sm:space-y-5">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
                <h2
                  className="text-xl sm:text-3xl md:text-4xl font-black text-amber-800 tracking-tight leading-tight"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  ƯU ĐÃI MÙA THU
                </h2>
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-amber-300 animate-pulse" />
              </div>

              <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform -rotate-1">
                <p
                  className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  ƯU ĐÃI ĐẶC BIỆT
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border-2 border-dashed border-amber-700">
                <p className="text-sm sm:text-base md:text-lg text-gray-800 font-semibold mb-1 sm:mb-2">
                  🍂 Không khí thu vàng, ưu đãi nhẹ nhàng
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Áp dụng cho một số bộ sưu tập chọn lọc trong thời gian giới hạn.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                <Button
                  asChild
                  className="flex-1 bg-amber-700 hover:bg-amber-800 text-white text-base sm:text-lg font-bold py-4 sm:py-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  onClick={handleClose}
                >
                  <Link href="/products">
                    <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                    KHÁM PHÁ NGAY
                  </Link>
                </Button>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 italic pt-1 sm:pt-2 px-2">
                * Chương trình có thời hạn. Áp dụng điều khoản & điều kiện.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-700 opacity-80 flex items-center justify-center gap-2 sm:gap-4">
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-150" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse delay-300" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-500" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
