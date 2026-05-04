"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function MarqueeBanner() {
  return (
    <section className="relative w-full bg-[#fff100] py-12 md:py-16 overflow-hidden">
      {/* Marquee Container */}
      <div className="relative">
        {/* Scrolling Text - Duplicate content for seamless loop */}
        <div className="flex whitespace-nowrap animate-marquee">
          <MarqueeContent />
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>

      {/* OUT NOW Badge */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#00ff9d] rounded-full flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="text-center">
              <div className="font-[family-name:var(--font-retro)] text-xs md:text-sm font-bold uppercase leading-tight">
                MỚI<br />RA MẮT!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold uppercase px-8 py-4 bg-black text-white hover:bg-white hover:text-black border-4 border-black transition-all"
        >
          MUA NGAY
        </Link>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function MarqueeContent() {
  return (
    <div className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12">
      {/* Text 1 */}
      <span className="font-[family-name:var(--font-retro)] text-6xl md:text-8xl lg:text-9xl font-bold uppercase text-black tracking-wider">
        BỘ SƯU TẬP #1
      </span>

      {/* Product Image 1 */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 bg-white border-4 border-black shadow-2xl hover:scale-110 transition-transform duration-300">
        <Image
          src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400"
          alt="Móc khóa Anime"
          fill
          className="object-cover"
        />
      </div>

      {/* Text 2 */}
      <span className="font-[family-name:var(--font-retro)] text-6xl md:text-8xl lg:text-9xl font-bold uppercase text-black tracking-wider">
        ANIME
      </span>

      {/* Product Image 2 */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 bg-white border-4 border-black shadow-2xl hover:scale-110 transition-transform duration-300">
        <Image
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
          alt="Móc khóa Kpop"
          fill
          className="object-cover"
        />
      </div>

      {/* Text 3 */}
      <span className="font-[family-name:var(--font-retro)] text-6xl md:text-8xl lg:text-9xl font-bold uppercase text-black tracking-wider">
        KPOP
      </span>

      {/* Product Image 3 */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 bg-white border-4 border-black shadow-2xl hover:scale-110 transition-transform duration-300">
        <Image
          src="https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400"
          alt="Móc khóa Cartoon"
          fill
          className="object-cover"
        />
      </div>

      {/* Text 4 */}
      <span className="font-[family-name:var(--font-retro)] text-6xl md:text-8xl lg:text-9xl font-bold uppercase text-black tracking-wider">
        GAME
      </span>

      {/* Product Image 4 */}
      <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 shrink-0 bg-white border-4 border-black shadow-2xl hover:scale-110 transition-transform duration-300">
        <Image
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400"
          alt="Móc khóa Game"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
