"use client"

import React from "react";
import { Phone, Facebook } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { phoneHref, zaloHref, facebookHref } from "@/config/contact";

const ChatWidget: React.FC = () => {

  return (
    <>
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-5 md:gap-6 pb-[env(safe-area-inset-bottom)] mb-16 md:mb-0">
        <Link
          href={facebookHref}
          aria-label="Chat Facebook"
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center justify-center rounded-full bg-[#1877F2]/95 text-white h-12 w-12 md:h-14 md:w-14 shadow-xl hover:bg-[#0e63ce] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]/40 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_0_6px_rgba(24,119,242,0.2)] backdrop-blur-sm border border-white/20`}
        >
          <span className="relative inline-flex items-center justify-center">
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#1877F2]/30 motion-safe:animate-phone-ping" aria-hidden />
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-white/40 motion-safe:animate-phone-wave" aria-hidden />
            <Facebook className="relative h-5 w-5 md:h-6 md:w-6 motion-safe:animate-phone-wiggle-strong" aria-hidden style={{ animationDelay: "120ms", animationDuration: "600ms" }} />
          </span>
          <span className="pointer-events-none absolute right-16 hidden md:inline-flex translate-y-0 items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Chat Facebook
          </span>
        </Link>

        <Link
          href={zaloHref}
          aria-label="Chat Zalo"
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center justify-center rounded-full bg-[#0068FF]/95 text-white h-12 w-12 md:h-14 md:w-14 shadow-xl hover:bg-[#0057d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF]/40 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_0_6px_rgba(0,104,255,0.2)] backdrop-blur-sm border border-white/20`}
        >
          <span className="relative inline-flex items-center justify-center">
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full bg-[#0068FF]/30 motion-safe:animate-phone-ping" aria-hidden />
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-white/40 motion-safe:animate-phone-wave" aria-hidden />
            <Image
              src="/logo/Zalo.png"
              alt="Zalo"
              width={24}
              height={24}
              className="relative h-5 w-5 md:h-6 md:w-6 motion-safe:animate-phone-wiggle-strong object-contain"
              style={{ animationDelay: "240ms", animationDuration: "600ms" }}
              priority={false}
            />
          </span>
          <span className="pointer-events-none absolute right-16 hidden md:inline-flex translate-y-0 items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Chat Zalo
          </span>
        </Link>

        <Link
          href={phoneHref}
          aria-label="Gọi tư vấn"
          className={`group inline-flex items-center justify-center rounded-full bg-[var(--color-seagull-500)]/95 text-white h-12 w-12 md:h-14 md:w-14 shadow-xl hover:bg-[var(--color-seagull-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-seagull-500)]/40 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_0_6px_rgba(42,160,205,0.2)] backdrop-blur-sm border border-white/20`}
        >
          <span className="relative inline-flex items-center justify-center">
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--color-seagull-500)]/30 motion-safe:animate-phone-ping" aria-hidden />
            <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-white/40 motion-safe:animate-phone-wave" aria-hidden />
            <Phone className="relative h-5 w-5 md:h-6 md:w-6 motion-safe:animate-phone-wiggle-strong" aria-hidden style={{ animationDuration: "650ms" }} />
          </span>
          <span className="pointer-events-none absolute right-16 hidden md:inline-flex translate-y-0 items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            Gọi tư vấn
          </span>
        </Link>
      </div>

    </>
  );
}

export default ChatWidget
