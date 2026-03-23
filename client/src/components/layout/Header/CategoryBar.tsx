"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { categoryService, type Category } from "@/service/category.service";
import { ROUTES } from "@/constant/route";
import { ChevronLeft, ChevronRight } from "lucide-react";
export type CategoryBarProps = {
  showIcons?: boolean;
  wrapSmall?: boolean;
  showCounts?: boolean;
  countBadgeStyle?: "subtle" | "filled";
  countBehavior?: "show" | "hideZero" | "cap";
  countCap?: number; 
};

const CategoryBar: React.FC<CategoryBarProps> = ({
  showIcons = false,
  wrapSmall = true,
  showCounts = true,
  countBadgeStyle = "filled",
  countBehavior = "hideZero",
  countCap = 99,
}) => {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    let mounted = true;
    categoryService
      .list()
      .then((res) => {
        if (!mounted) return;
        setCats(res || []);
      })
      .catch(() => {
        if (!mounted) return;
        setCats([]);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = viewportRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [loading, cats.length]);

  if (loading) {
    return (
      <div className="w-full border-b border-neutral-200/60 bg-white">
        <div className="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="relative py-3">
            <div className="no-scrollbar overflow-x-auto">
              <div className="flex items-center gap-2 md:gap-2.5 pr-8 md:pr-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-9 w-28 shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                    <div className="h-full w-full animate-pulse bg-neutral-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(cats) || cats.length === 0) return null;

  return (
    <div className="w-full bg-white border-b border-neutral-200/60">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <nav className="relative py-3" aria-label="Danh mục">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollByAmount("left")}
            disabled={!canLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex h-8 w-8 items-center justify-center bg-white rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all shadow-sm hover:shadow ${!canLeft ? "opacity-30 cursor-not-allowed hover:bg-white" : ""}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div
            ref={viewportRef}
            className={`relative ${wrapSmall ? "sm:no-scrollbar sm:overflow-x-auto" : "no-scrollbar overflow-x-auto"} scroll-smooth`}
            role="listbox"
          >
            {canLeft && (
              <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
            )}
            {canRight && (
              <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white via-white/90 to-transparent z-10" />
            )}
            <div className={`flex items-center ${wrapSmall ? "flex-wrap sm:flex-nowrap" : ""} gap-2 md:gap-2.5 pl-10 md:pl-12 pr-8 md:pr-10`}>
              {cats.map((c) => (
                <Link
                  key={c.id}
                  href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg font-medium text-sm hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all duration-200 shadow-sm hover:shadow group"
                >
                  {showIcons && c.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.thumbnailUrl} alt="" className="h-4 w-4 rounded object-cover" />
                  ) : null}
                  <span className="whitespace-nowrap">{c.name}</span>
                  {showCounts && typeof (c as unknown as { productCount?: unknown })?.productCount === "number" ? (() => {
                    const raw = (c as unknown as { productCount?: number }).productCount as number;
                    if (countBehavior === "hideZero" && raw === 0) return null;
                    let text = String(raw);
                    if (countBehavior === "cap" && typeof countCap === "number" && raw > countCap) {
                      text = `${countCap}+`;
                    }
                    const subtle = "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200";
                    const filled = "bg-neutral-900 text-white group-hover:bg-neutral-800";
                    const style = countBadgeStyle === "filled" ? filled : subtle;
                    return (
                      <span className={`ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full transition-colors ${style}`}>
                        {text}
                      </span>
                    );
                  })() : null}
                </Link>
              ))}
            </div>
          </div>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollByAmount("right")}
            disabled={!canRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex h-8 w-8 items-center justify-center bg-white rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all shadow-sm hover:shadow ${!canRight ? "opacity-30 cursor-not-allowed hover:bg-white" : ""}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};



export default CategoryBar;
