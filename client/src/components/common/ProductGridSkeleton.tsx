"use client";

import React from "react";

export type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 6, className = "" }) => {
  return (
    <div className={[
      "grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:[grid-template-columns:repeat(auto-fit,minmax(12rem,max-content))] md:gap-3 lg:[grid-template-columns:repeat(auto-fit,minmax(14rem,max-content))] lg:gap-4 xl:[grid-template-columns:repeat(auto-fit,minmax(16rem,max-content))] xl:gap-5 justify-start",
      className,
    ].join(" ")}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-2 border-[#2d2d2d] bg-[#f5f1e8] p-3">
          <div className="aspect-[4/5] w-full bg-[#d4cfc0] relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-[#c9c4b5] to-[#d4cfc0]"
              style={{ 
                animation: `pulse ${1.5 + (i % 3) * 0.2}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
              }}
            />
          </div>
          <div className="mt-3 h-3 w-3/4 bg-[#2d2d2d]/10" />
          <div className="mt-2 h-3 w-1/2 bg-[#2d2d2d]/10" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductGridSkeleton);
