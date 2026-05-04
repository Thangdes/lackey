"use client";

import React from "react";
import Link from "next/link";
import { useValueProps } from "@/hook/useSiteContent";
import { ArrowRight } from "lucide-react";

export type RetroValueProp = {
  icon: string | React.ReactNode; // Emoji or Icon component
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
  const { data: apiData, isLoading } = useValueProps();
  
  const displayItems = (apiData && apiData.length > 0) ? apiData : items;

  if (isLoading) {
    return (
      <section className="relative w-full bg-neutral-50 py-16 md:py-24">
        <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">
                {title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-neutral-50 py-16 md:py-24">
      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayItems.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white p-8 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Content Wrapper */}
                <div className="flex-grow">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 flex items-center justify-center bg-black text-white">
                      {typeof item.icon === 'string' ? (
                        <span className="text-2xl">{item.icon}</span>
                      ) : (
                        <div className="scale-125">{item.icon}</div>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* CTA Link */}
                {item.ctaHref && item.ctaLabel && (
                  <div className="mt-6 pt-6 border-t border-neutral-200">
                    <Link
                      href={item.ctaHref}
                      className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-neutral-600 transition-colors group"
                    >
                      {item.ctaLabel}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroValueProps;
