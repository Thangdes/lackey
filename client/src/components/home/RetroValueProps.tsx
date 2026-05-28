"use client";

import React from "react";
import Link from "next/link";
import { useValueProps } from "@/hook/useSiteContent";
import { ArrowRight } from "lucide-react";

export type RetroValueProp = {
  icon: string | React.ReactNode; 
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
      <section className="relative w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-14 h-14 bg-gray-200 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          {}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayItems.map((item, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 flex flex-col border border-gray-100"
              >
                {}
                <div className="flex-grow">
                  {}
                  <div className="mb-8">
                    <div className="w-16 h-16 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      {typeof item.icon === 'string' ? (
                        <span className="text-3xl">{item.icon}</span>
                      ) : (
                        <div className="scale-125">{item.icon}</div>
                      )}
                    </div>
                  </div>

                  {}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  {}
                  <p className="text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {}
                {item.ctaHref && item.ctaLabel && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                      href={item.ctaHref}
                      className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link"
                    >
                      {item.ctaLabel}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
