"use client";

import React from "react";
import Link from "next/link";

export type SectionHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  ctaHref?: string;
  ctaText?: string;
  align?: "left" | "center";
  className?: string;
  inverted?: boolean;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  ctaHref,
  ctaText = "Xem tất cả",
  align = "left",
  className = "",
  inverted = false,
}) => {
  const isCenter = align === "center";
  return (
    <div className={`mb-4 md:mb-6 flex ${isCenter ? "flex-col items-center gap-3 text-center" : "flex-col items-center gap-3 md:gap-0 md:items-center md:flex-row md:justify-between md:text-left"} ${className}`}>
      <div className={`flex flex-col ${isCenter ? "items-center" : "items-center md:items-start"} gap-1.5`}>
        <div className="flex items-center gap-2">{title}</div>
        {subtitle ? (
          <p className={`text-sm max-w-prose ${inverted ? "text-white/85" : "text-neutral-600"}`}>{subtitle}</p>
        ) : null}
      </div>
      {ctaHref ? (
        <Link
          href={ctaHref}
          className={[
            "group inline-flex items-center justify-center gap-1.5 w-full md:w-auto px-3 md:px-4 py-3 md:py-2 text-sm md:text-[15px] font-medium focus-visible:outline-none focus-visible:ring-2",
            inverted
              ? "border border-white/60 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/30"
              : "bg-[var(--color-cod-gray-900)] text-white hover:opacity-90 focus-visible:ring-[var(--color-cod-gray-900)]/20",
          ].join(" ")}
        >
          <span>{ctaText}</span>
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeader;
