"use client";

import { siteConfig } from "@/constant/site";
import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .scanline {
          animation: scanline 8s linear infinite;
        }
        .dot-pulse-1 { animation: dotPulse 1.4s ease-in-out infinite; }
        .dot-pulse-2 { animation: dotPulse 1.4s ease-in-out 0.2s infinite; }
        .dot-pulse-3 { animation: dotPulse 1.4s ease-in-out 0.4s infinite; }
      `}</style>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="scanline absolute left-0 w-full h-1 bg-gradient-to-b from-transparent via-black to-transparent" />
      </div>

      <div role="status" className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#2d2d2d] rounded-sm transform rotate-2" />
          <Image
            src="/logo/logo.jpg"
            alt={siteConfig.name}
            width={80}
            height={80}
            className="relative rounded-sm object-contain border-4 border-[#2d2d2d]"
            priority
          />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-mono tracking-wider text-[#2d2d2d] uppercase">
            {siteConfig.name}
          </p>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2d2d2d] dot-pulse-1" />
            <div className="w-2 h-2 rounded-full bg-[#2d2d2d] dot-pulse-2" />
            <div className="w-2 h-2 rounded-full bg-[#2d2d2d] dot-pulse-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
