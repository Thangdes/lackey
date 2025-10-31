"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/service/category.service";
import { ROUTES } from "@/constant/route";
import { Package, Grid3X3 } from "lucide-react";
import { useHeaderTopCategories } from "@/hook/useCategory";

export interface CategoryWithCount extends Category {
  productCount?: number;
}

const CategoryDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
const { data, isLoading } = useHeaderTopCategories();
  const cats: CategoryWithCount[] = useMemo(() => (data ?? []).slice(0, 12) as CategoryWithCount[], [data]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    }
    if ((e.key === "Enter" || e.key === " ") && !open) {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => firstItemRef.current?.focus(), 0);
    }
    if (e.key === "ArrowDown" && open) {
      e.preventDefault();
      firstItemRef.current?.focus();
    }
  }, [open]);

  const handleEnter = () => setOpen(true);
  const handleLeave = () => setOpen(false);

  return (
    <div
      className="relative h-full"
      ref={containerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="category-menu"
        className="inline-flex items-center gap-2 px-3 h-10 rounded-full text-white hover:text-[var(--color-seagull-300)] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <Grid3X3 className="h-5 w-5" />
        <span className="text-sm font-medium hidden md:inline">Danh mục</span>
      </button>

      {open && (
        <div
          id="category-menu"
          role="menu"
          aria-label="Danh mục sản phẩm"
          className="absolute z-50 left-0 mt-2 w-[520px] max-w-[92vw] rounded-xl bg-white text-black shadow-xl ring-1 ring-black/10 p-3 animate-in fade-in zoom-in-95"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
              buttonRef.current?.focus();
            }
          }}
        >
          <div className="px-2 pb-2 border-b border-neutral-100">
            <div className="text-sm font-semibold">Danh mục sản phẩm</div>
            <div className="text-xs text-neutral-500">Khám phá các nhóm sản phẩm nổi bật</div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
                {cats.map((c, idx) => (
                  <li key={c.id}>
                    <Link
                      ref={idx === 0 ? firstItemRef : undefined}
                      href={{ pathname: ROUTES.products, query: { category: c.slug } }}
                      role="menuitem"
                      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      {c.thumbnailUrl ? (
                        <img src={c.thumbnailUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-black/10" />
                      ) : (
                        <span className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center ring-1 ring-black/10">
                          <Package className="h-4 w-4 text-neutral-500" />
                        </span>
                      )}
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate">{c.name}</span>
                        {typeof c.productCount === "number" && c.productCount > 0 && (
                          <span className="block text-[11px] text-neutral-500">{c.productCount} sản phẩm</span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-1 px-2">
                <Link
                  href={ROUTES.products}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200"
                  onClick={() => setOpen(false)}
                >
                  Xem tất cả danh mục
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
