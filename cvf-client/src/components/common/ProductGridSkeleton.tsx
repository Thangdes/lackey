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
        <div key={i} className="rounded-lg border border-black/10 bg-white p-3 animate-pulse">
          <div className="aspect-[4/5] w-full rounded-md bg-black/10" />
          <div className="mt-3 h-3 w-3/4 rounded bg-black/10" />
          <div className="mt-2 h-3 w-1/2 rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ProductGridSkeleton);
