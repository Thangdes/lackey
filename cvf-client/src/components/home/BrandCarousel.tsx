"use client";

import React, { useRef } from "react";
import Image from "next/image";
import SectionHeader from "@/components/common/SectionHeader";

export type BrandItem = {
  id: string;
  name: string;
  logoUrl: string;
  href?: string;
};

export type BrandCarouselProps = {
  title?: string;
  items?: BrandItem[];
  marquee?: boolean;
  speedMs?: number; 
  viewAllHref?: string;
  viewAllLabel?: string;
};

const defaults: BrandItem[] = [
  { id: "b1", name: "Shopee", logoUrl: "/logo/Shopee.png", href: "https://shopee.vn" },
  { id: "b4", name: "TikTok", logoUrl: "/logo/tiktok.svg", href: "https://tiktok.com" },
  { id: "b3", name: "Facebook", logoUrl: "/logo/facebook.svg", href: "https://facebook.com" },
  { id: "b2", name: "Zalo", logoUrl: "/logo/Zalo.png", href: "https://zalo.me" },
  { id: "b5", name: "Vercel", logoUrl: "/vercel.svg", href: "https://vercel.com" },
];

const BrandCard: React.FC<{ item: BrandItem }> = ({ item }) => {
  const content = (
    <div className="group flex h-20 w-36 items-center justify-center rounded-xl p-3 transition-all">
      <div className="relative h-full w-full">
        <Image
          src={item.logoUrl}
          alt={item.name}
          fill
          sizes="144px"
          className="object-contain"
        />
      </div>
    </div>
  );
  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name} className="shrink-0">
        {content}
      </a>
    );
  }
  return content;
};

const BrandCarousel: React.FC<BrandCarouselProps> = ({
  title = "Thương hiệu đồng hành",
  items,
  marquee = true,
  speedMs = 20000,
  viewAllHref = "/partners",
  viewAllLabel = "Xem tất cả đối tác",
}) => {
  const list = items && items.length ? items : defaults;
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = viewportRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  return (
    <section aria-label="Brands" className="py-0">
      <div
        className="border-y"
        style={{
          background:
            "linear-gradient(90deg, var(--color-plantation-950), var(--color-plantation-800), var(--color-plantation-950))",
          borderColor: "var(--color-cod-gray-900)",
        }}
      >
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8">
          <SectionHeader
            title={
              <h2
                className="text-white"
                style={{
                  fontSize: "var(--font-size-h6, 1.125rem)",
                  fontWeight: "var(--font-weight-semibold, 600)",
                  letterSpacing: "var(--tracking-tight, -0.01em)",
                }}
              >
                {title}
              </h2>
            }
            ctaHref={viewAllHref}
            ctaText={viewAllLabel}
            align="left"
            inverted
          />
        {marquee ? (
          <div className="group relative">
            <div className="no-scrollbar overflow-hidden">
              <div
                className="flex w-max gap-4 will-change-transform animate-marquee [animation-duration:var(--marquee-speed)]"
                style={{ ['--marquee-speed' as unknown as string]: `${speedMs}ms` } as React.CSSProperties}
              >
                {[...list, ...list].map((b, idx) => (
                  <BrandCard key={`${b.id}-${idx}`} item={b} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="md:hidden no-scrollbar overflow-x-auto">
              <div className="flex gap-3">
                {list.map((b) => (
                  <BrandCard key={b.id} item={b} />
                ))}
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <button
                type="button"
                aria-label="Scroll brands left"
                onClick={() => scrollByAmount("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                ‹
              </button>
              <div ref={viewportRef} className="no-scrollbar overflow-x-auto scroll-smooth">
                <div className="grid grid-flow-col auto-cols-max gap-4">
                  {list.map((b) => (
                    <BrandCard key={b.id} item={b} />
                  ))}
                </div>
              </div>
              <button
                type="button"
                aria-label="Scroll brands right"
                onClick={() => scrollByAmount("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                ›
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
