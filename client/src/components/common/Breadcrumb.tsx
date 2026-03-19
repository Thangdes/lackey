"use client";

import Link from "next/link";
import Script from "next/script";
import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { buildBreadcrumbJsonLd } from "@/config/seo";
import { absoluteUrl } from "@/lib/url";
import { ROUTES } from "@/constant/route";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
  includeJsonLd?: boolean;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = "",
  showHomeIcon = false,
  includeJsonLd = true,
}) => {
  const jsonLdItems = React.useMemo(() => {
    const homeItem = { name: "Trang chủ", url: absoluteUrl(ROUTES.home) };
    const breadcrumbItems = items.map(item => ({
      name: item.name,
      url: item.href ? absoluteUrl(item.href) : absoluteUrl("/"),
    }));
    return [homeItem, ...breadcrumbItems];
  }, [items]);

  const jsonLd = React.useMemo(() => 
    buildBreadcrumbJsonLd(jsonLdItems),
    [jsonLdItems]
  );

  return (
    <>
      {includeJsonLd && (
        <Script
          id="breadcrumb-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <nav 
        aria-label="Breadcrumb" 
        className={`mb-4 ${className}`}
      >
        <ol className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black flex-wrap">
          <li>
            <Link 
              href={ROUTES.home}
              className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors"
              aria-label="Trang chủ"
            >
              {showHomeIcon ? (
                <Home className="w-4 h-4" />
              ) : (
                "Trang chủ"
              )}
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const hasLink = Boolean(item.href);

            return (
              <React.Fragment key={`${item.name}-${index}`}>
                <li>
                  <ChevronRight className="w-4 h-4 text-black/60" aria-hidden="true" />
                </li>
                
                <li>
                  {hasLink && !isLast ? (
                    <Link
                      href={item.href!}
                      className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors truncate max-w-[150px] md:max-w-[200px] lg:max-w-none"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span
                      className="text-sm font-bold uppercase tracking-wide text-black truncate max-w-[150px] md:max-w-[200px] lg:max-w-none"
                      aria-current={isLast ? "page" : undefined}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
