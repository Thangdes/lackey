"use client";

import React from "react";
import Link from "next/link";

export type RetroValueProp = {
  icon: string; // Emoji
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type RetroValuePropsProps = {
  title?: string;
  subtitle?: string;
  items: RetroValueProp[];
};

const RetroValueProps: React.FC<RetroValuePropsProps> = ({
  title = "VÌ SAO CHỌN CHÚNG TÔI?",
  subtitle,
  items,
}) => {
  return (
    <section className="relative w-full bg-white py-12 md:py-20 overflow-hidden">
      {/* Container */}
      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg md:text-xl text-black/70 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Grid of Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="group relative bg-[#fff100] border-4 border-black p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                style={{
                  boxShadow: "8px 8px 0px 0px rgba(34,144,144,1)",
                }}
              >
                {/* Content Wrapper - Grows to push CTA down */}
                <div className="flex-grow">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-black border-4 border-black rounded-full">
                      <span className="text-3xl md:text-4xl">{item.icon}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-[family-name:var(--font-retro)] text-xl md:text-2xl font-bold uppercase text-black text-center mb-3 tracking-wide">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-black/80 text-center leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* CTA Link - Always at bottom */}
                {item.ctaHref && item.ctaLabel && (
                  <div className="flex justify-center mt-6 pt-4 border-t-2 border-black/20">
                    <Link
                      href={item.ctaHref}
                      className="inline-block font-bold text-sm md:text-base text-black hover:text-[#229090] underline underline-offset-4 transition-colors uppercase tracking-wide"
                    >
                      {item.ctaLabel} →
                    </Link>
                  </div>
                )}

                {/* Hover Effect - Extra Shadow */}
                <div 
                  className="absolute inset-0 border-4 border-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    transform: "translate(4px, 4px)",
                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Bottom Decoration */}
          <div className="mt-12 md:mt-16 flex justify-center">
            <div className="h-1 w-32 md:w-48 bg-black" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroValueProps;
