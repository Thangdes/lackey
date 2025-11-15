"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { discountService } from "@/service/discount.service";

export default function RetroSaleBanner() {
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    let mounted = true;
    discountService.promoStrip()
      .then((r) => {
        if (!mounted) return;
        setExpiresAt(r?.active && r?.expiresAt ? r.expiresAt : null);
      })
      .catch(() => setExpiresAt(null));
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const hhmmss = useMemo(() => {
    if (!expiresAt) return null;
    const end = new Date(expiresAt).getTime();
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    if (diff <= 0) return ["00","00","00"] as const;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return [pad(h), pad(m), pad(s)] as const;
  }, [expiresAt, now]);

  return (
    <section className="relative w-full bg-[#fff100] py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, #000 25%, transparent 25%),
            linear-gradient(-45deg, #000 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #000 75%),
            linear-gradient(-45deg, transparent 75%, #000 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }} />
      </div>

      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,144,144,1)]">
              <Zap className="w-6 h-6 text-[#fff100] fill-[#fff100]" />
              <span className="font-[family-name:var(--font-retro)] text-xl md:text-2xl text-white uppercase tracking-wider">
                Flash Sale
              </span>
              <Zap className="w-6 h-6 text-[#fff100] fill-[#fff100]" />
            </div>
          </div>

          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-[family-name:var(--font-retro)] text-5xl md:text-7xl lg:text-9xl text-black mb-6 tracking-wider uppercase leading-none">
              SALE
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              {['-20%', '-30%', '-40%', '-50%'].map((discount, index) => (
                <div
                  key={discount}
                  className="px-6 py-3 bg-black text-white border-4 border-black font-[family-name:var(--font-retro)] text-2xl md:text-3xl font-bold transform hover:scale-110 transition-transform"
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '-' : ''}${2 + index}deg)`
                  }}
                >
                  {discount}
                </div>
              ))}
            </div>

            <p className="text-xl md:text-2xl lg:text-3xl text-black font-bold mb-8 uppercase tracking-wide">
              Super Discount - Móc khóa chất lượng cao
            </p>
            <Link
              href="/products?sale=true"
              className="inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-[family-name:var(--font-retro)] text-xl md:text-2xl uppercase tracking-wider transition-all shadow-[8px_8px_0px_0px_rgba(34,144,144,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 group"
            >
              <span>Hurry Up!</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {hhmmss && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-white border-4 border-black">
                <span className="text-black font-bold text-sm md:text-base uppercase">Kết thúc trong:</span>
                <div className="flex gap-2">
                  {hhmmss.map((time, index) => (
                    <React.Fragment key={index}>
                      <div className="px-3 py-2 bg-black text-[#fff100] font-[family-name:var(--font-retro)] text-xl md:text-2xl font-bold">
                        {time}
                      </div>
                      {index < 2 && <span className="text-black text-2xl font-bold">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
