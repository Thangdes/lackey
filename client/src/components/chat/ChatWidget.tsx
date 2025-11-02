"use client"

import React, { useState } from "react";
import { Phone, Facebook, MessageCircle, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { phoneHref, zaloHref, facebookHref } from "@/config/contact";

const ChatWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      {/* Chat Widget Container */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-30 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] mb-16 md:mb-0">
        
        {/* Expandable Contact Buttons */}
        <div className={`flex flex-col items-end gap-3 transition-all duration-300 ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {/* Facebook Button */}
          <Link
            href={facebookHref}
            aria-label="Chat Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#0e63ce] text-white h-11 w-11 md:h-12 md:w-12 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]/50 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Facebook className="h-5 w-5 md:h-5 md:w-5" />
            
            {/* Enhanced Tooltip */}
            <span className="pointer-events-none absolute right-14 whitespace-nowrap bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10">
              Chat Facebook
              <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neutral-900"></span>
            </span>
          </Link>

          {/* Zalo Button */}
          <Link
            href={zaloHref}
            aria-label="Chat Zalo"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#0068FF] to-[#0057d6] text-white h-11 w-11 md:h-12 md:w-12 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068FF]/50 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Image
              src="/logo/Zalo.png"
              alt="Zalo"
              width={20}
              height={20}
              className="h-5 w-5 md:h-5 md:w-5 object-contain"
              priority={false}
            />
            
            {/* Enhanced Tooltip */}
            <span className="pointer-events-none absolute right-14 whitespace-nowrap bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10">
              Chat Zalo
              <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neutral-900"></span>
            </span>
          </Link>

          {/* Phone Button */}
          <Link
            href={phoneHref}
            aria-label="Gọi tư vấn"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--color-seagull-600)] text-white h-11 w-11 md:h-12 md:w-12 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/50 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Phone className="h-5 w-5 md:h-5 md:w-5" />
            
            {/* Enhanced Tooltip */}
            <span className="pointer-events-none absolute right-14 whitespace-nowrap bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10">
              Gọi tư vấn
              <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neutral-900"></span>
            </span>
          </Link>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Thu gọn liên hệ" : "Mở rộng liên hệ"}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-secondary)] text-white h-12 w-12 md:h-14 md:w-14 shadow-xl hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]/50 focus-visible:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {/* Pulse Animation Ring */}
          <span className="absolute inline-block h-12 w-12 md:h-14 md:w-14 rounded-full bg-[var(--brand-accent)]/20 motion-safe:animate-ping" aria-hidden />
          
          {/* Icon */}
          {isExpanded ? (
            <ChevronUp className="relative h-6 w-6 md:h-7 md:w-7 transition-transform duration-300" />
          ) : (
            <MessageCircle className="relative h-6 w-6 md:h-7 md:w-7 transition-transform duration-300" />
          )}
          
          {/* Badge for notification */}
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold h-5 min-w-5 px-1 rounded-full shadow-lg border-2 border-white">
            3
          </span>

          {/* Enhanced Tooltip */}
          <span className="pointer-events-none absolute right-16 whitespace-nowrap bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl border border-white/10">
            {isExpanded ? "Thu gọn" : "Liên hệ"}
            <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-neutral-900"></span>
          </span>
        </button>
      </div>
    </>
  );
}

export default ChatWidget
