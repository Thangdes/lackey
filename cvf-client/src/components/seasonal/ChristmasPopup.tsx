"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Gift, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ChristmasPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenPopup = localStorage.getItem("christmas-popup-2024");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("christmas-popup-2024", "true");
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="max-w-[96vw] sm:max-w-[600px] p-0 overflow-hidden border-4 sm:border-8 border-double border-[#AE1C2C] bg-[#FFF8E7] shadow-2xl z-[999]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Ưu đãi Giáng Sinh - Giảm tới 40%</DialogTitle>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
          
          <div className="absolute top-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FF6B6B] opacity-80 flex items-center justify-center gap-2 sm:gap-4">
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-150" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 rotate-12 animate-pulse delay-300" />
            <div className="w-8 sm:w-16 h-0.5 sm:h-1 bg-white/60 -rotate-12 animate-pulse delay-500" />
          </div>

          <DialogClose 
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-[#AE1C2C] hover:bg-[#8B1623] text-white rounded-full p-1.5 sm:p-2 transition-all shadow-lg hover:scale-110"
            onClick={handleClose}
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </DialogClose>

          <div className="pt-8 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-6 md:px-10">
            <div className="relative w-full aspect-[4/3] mb-4 sm:mb-6 rounded-lg overflow-hidden shadow-xl border-2 sm:border-4 border-[#AE1C2C] mt-2 sm:mt-4">
              <Image
                src="/christmas.jpg"
                alt="Christmas Offer"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="text-center space-y-3 sm:space-y-5">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#FFD700] animate-pulse" />
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-[#AE1C2C] tracking-tight leading-tight" style={{ fontFamily: "'Courier New', monospace" }}>
                  ƯU ĐÃI GIÁNG SINH
                </h2>
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-[#FFD700] animate-pulse" />
              </div>

              <div className="bg-gradient-to-r from-[#AE1C2C] to-[#D4526E] text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform -rotate-1">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider" style={{ fontFamily: "'Courier New', monospace" }}>
                  GIẢM TỚI 40%
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border-2 border-dashed border-[#AE1C2C]">
                <p className="text-sm sm:text-base md:text-lg text-gray-800 font-semibold mb-1 sm:mb-2">
                  🎄 Khuyến mãi đặc biệt mùa lễ hội
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Áp dụng cho tất cả sản phẩm hạt dinh dưỡng
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                <Button
                  asChild
                  className="flex-1 bg-[#AE1C2C] hover:bg-[#8B1623] text-white text-base sm:text-lg font-bold py-4 sm:py-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  onClick={handleClose}
                >
                  <Link href="/products">
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                    MUA NGAY
                  </Link>
                </Button>
                
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-[#AE1C2C] text-[#AE1C2C] hover:bg-[#AE1C2C] hover:text-white text-sm sm:text-base font-bold py-4 sm:py-6 rounded-lg transition-all"
                  onClick={handleClose}
                >
                  Để sau
                </Button>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 italic pt-1 sm:pt-2 px-2">
                * Chương trình có thời hạn. Áp dụng điều khoản & điều kiện.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-r from-[#4ECDC4] via-[#FF6B6B] to-[#4ECDC4] opacity-80 flex items-center justify-center gap-2 sm:gap-4">
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
