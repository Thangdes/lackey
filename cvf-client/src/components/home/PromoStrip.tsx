"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

export type PromoStripProps = {
  message: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  expiresAt?: string | Date;
  variant?: "brand" | "warning" | "success" | "neutral";
  dismissible?: boolean;
  storageKey?: string; 
  icon?: React.ReactNode;
  sticky?: boolean;
  compactOnScroll?: boolean;
  compactThreshold?: number;
  fullBleed?: boolean;
};

function useCountdown(target?: Date) {
  const targetTime = target?.getTime() ?? null;
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!targetTime) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [targetTime]);

  return useMemo(() => {
    if (!targetTime) return null;
    const diff = Math.max(0, targetTime - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const done = diff <= 0;
    return { days, hours, minutes, seconds, done };
  }, [now, targetTime]);
}

const variantClass: Record<Required<PromoStripProps>["variant"], string> = {
  brand: "bg-[var(--color-cod-gray-900)] text-white border-[var(--color-cod-gray-900)]",
  warning: "bg-amber-50 text-amber-900 border-amber-300",
  success: "bg-emerald-50 text-emerald-900 border-emerald-300",
  neutral: "bg-neutral-50 text-neutral-900 border-neutral-200",
};

const PromoStrip: React.FC<PromoStripProps> = ({
  message,
  ctaHref,
  ctaLabel,
  expiresAt,
  variant = "brand",
  dismissible = true,
  storageKey,
  icon,
  sticky = false,
  compactOnScroll = true,
  compactThreshold = 60,
  fullBleed = false,
}) => {
  const [hidden, setHidden] = useState<boolean>(false);
  const countdown = useCountdown(expiresAt ? new Date(expiresAt) : undefined);
  const [compact, setCompact] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const v = localStorage.getItem(storageKey);
      if (v === "hidden") setHidden(true);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    if (!compactOnScroll) return;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setCompact(y > compactThreshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compactOnScroll, compactThreshold]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dismiss = () => {
    setHidden(true);
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, "hidden");
      } catch {}
    }
  };

  if (hidden) return null;

  if (countdown?.done) return null;

  return (
    <section
      aria-label="Promotion"
      className={[
        "w-full border-b-2 border-[var(--color-cod-gray-900)]",
        sticky ? "sticky top-0 z-40" : "",
      ].join(" ")}
    >
      <div className={`${variantClass[variant]} w-full`}>
        <div className={`${fullBleed ? "" : "px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24"}`}>
          <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${compact ? "py-2" : "py-3"}`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className={`inline-flex ${compact ? "h-5 w-5" : "h-6 w-6"} items-center justify-center rounded-full bg-white/70 text-[var(--color-cod-gray-900)] shadow-sm`}>
                {icon ?? <Megaphone className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} aria-hidden />}
              </span>
              <div className={`text-sm md:text-base ${variant === "brand" ? "text-white" : "text-[var(--color-cod-gray-900)]"} truncate`}>
                {message} 
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              {countdown && !countdown.done ? (
                <div
                  aria-live="polite"
                  suppressHydrationWarning
                  className={`font-medium tracking-wide ${compact ? "text-xs" : "text-xs md:text-sm"}`}
                >
                  {mounted ? (
                    <>
                      Kết thúc sau: {countdown.days > 0 ? `${countdown.days}d ` : ""}
                      {String(countdown.hours).padStart(2, "0")}:
                      {String(countdown.minutes).padStart(2, "0")}:
                      {String(countdown.seconds).padStart(2, "0")}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ) : null}

              {ctaHref && ctaLabel ? (
                <Link
                  href={ctaHref}
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2",
                    variant === "brand"
                      ? "bg-white text-[var(--color-cod-gray-900)] hover:opacity-90 focus-visible:ring-white/40"
                      : "bg-[var(--color-cod-gray-900)] text-white hover:opacity-90 focus-visible:ring-[var(--color-cod-gray-900)]/30",
                    compact ? "px-2.5 py-1 text-xs" : "",
                  ].join(" ")}
                >
                  {ctaLabel}
                </Link>
              ) : null}

              {dismissible ? (
                <button
                  type="button"
                  onClick={dismiss}
                  className="ml-1 inline-flex items-center rounded-full border border-[var(--color-cod-gray-900)] bg-white/60 px-2 py-1 text-xs text-[var(--color-cod-gray-900)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                  aria-label="Đóng thông báo khuyến mãi"
                >
                  Đóng
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoStrip;
