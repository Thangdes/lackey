"use client";

import React from "react";

export type ProductGridSkeletonProps = {
  count?: number;
  className?: string;
};

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 6, className = "" }) => {
  return (
    <div className={[
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4",
      className,
    ].join(" ")}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
        >
          {}
          <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100"
              style={{ 
                animation: `shimmer 2s infinite`,
                backgroundSize: '200% 100%'
              }}
            />
          </div>
          
          {}
          <div className="p-3 space-y-2">
            {}
            <div className="space-y-1.5">
              <div className="h-3.5 bg-gray-200 rounded w-full" />
              <div className="h-3.5 bg-gray-200 rounded w-4/5" />
            </div>
            
            {}
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-200 rounded w-12" />
              <div className="h-3 bg-gray-200 rounded w-8" />
            </div>
            
            {}
            <div className="h-3 bg-gray-200 rounded w-20" />
            
            {}
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(ProductGridSkeleton);
