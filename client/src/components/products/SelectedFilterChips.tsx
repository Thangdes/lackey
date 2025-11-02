"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { OptionItem } from "@/hook/useOptionsData";

export type SelectedFilterChipsProps = {
  categoryOptions: OptionItem[];
  brandOptions: OptionItem[];

  selectedCategories: string[];
  selectedBrands: string[];
  selectedDietary: string[];

  onRemoveCategory: (id: string) => void;
  onRemoveBrand: (id: string) => void;
  onRemoveDietary: (id: string) => void;
  onClearAll: () => void;

  activeFilterCount: number;
  variant: "desktop" | "mobile";
};

export function SelectedFilterChips({
  categoryOptions,
  brandOptions,
  selectedCategories,
  selectedBrands,
  selectedDietary,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveDietary,
  onClearAll,
  activeFilterCount,
  variant,
}: SelectedFilterChipsProps) {
  const chipsRef = useRef<HTMLDivElement | null>(null);
  const [showOverflowHint, setShowOverflowHint] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const HINT_TIMEOUT_MS = 1500;
    const el = chipsRef.current;
    const hasFilters = activeFilterCount > 0;
    if (!hasFilters || !el) {
      setShowOverflowHint(false);
      setHasOverflow(false);
      return;
    }
    const overflow = el.scrollWidth > el.clientWidth + 4;
    setHasOverflow(overflow);
    if (overflow) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      setShowOverflowHint(true);
      const t = window.setTimeout(() => setShowOverflowHint(false), HINT_TIMEOUT_MS);
      return () => window.clearTimeout(t);
    }
  }, [activeFilterCount, selectedCategories, selectedBrands, selectedDietary]);

  const scrollChipsBy = (dir: -1 | 1) => {
    const container = chipsRef.current;
    if (!container) return;
    const delta = Math.max(160, Math.floor(container.clientWidth * 0.6)) * dir;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  const isDesktop = variant === "desktop";
  const ChipWrapper: React.ElementType = isDesktop ? "button" : Button;

  const chipClass =
    "inline-flex items-center gap-1 rounded-full bg-black/5 text-black px-3 py-1 text-xs ring-1 ring-black/10 hover:bg-black/10";

  const Content = (
    <div className={isDesktop ? "flex items-center gap-3 w-full" : "relative flex items-center gap-3 overflow-x-auto whitespace-nowrap pr-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent [scrollbar-width:thin]"}>
      <div
        ref={chipsRef}
        className={isDesktop ? "flex items-center gap-3 overflow-x-auto whitespace-nowrap pr-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent [scrollbar-width:thin]" : "relative flex items-center gap-3 overflow-x-auto whitespace-nowrap pr-2 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent [scrollbar-width:thin]"}
        role="listbox"
        aria-label="Bộ lọc đã chọn"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollChipsBy(-1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollChipsBy(1);
          }
        }}
      >
        {selectedCategories.map((cid) => {
          const label = categoryOptions.find((o) => o.id === cid)?.name || cid;
          return (
            <ChipWrapper
              key={`c-${cid}-${variant}`}
              type="button"
              onClick={() => onRemoveCategory(cid)}
              className={chipClass}
              title={`Bỏ lọc: ${label}`}
              aria-label={`Bỏ lọc ${label}`}
            >
              <span>{label}</span>
              <FiX aria-hidden />
            </ChipWrapper>
          );
        })}
        {selectedBrands.map((bid) => {
          const label = brandOptions.find((o) => o.id === bid)?.name || bid;
          return (
            <ChipWrapper
              key={`b-${bid}-${variant}`}
              type="button"
              onClick={() => onRemoveBrand(bid)}
              className={chipClass}
              title={`Bỏ lọc: ${label}`}
              aria-label={`Bỏ lọc ${label}`}
            >
              <span>{label}</span>
              <FiX aria-hidden />
            </ChipWrapper>
          );
        })}
        {selectedDietary.map((d) => (
          <ChipWrapper
            key={`d-${d}-${variant}`}
            type="button"
            onClick={() => onRemoveDietary(d)}
            className={chipClass}
            title={`Bỏ lọc: ${d}`}
            aria-label={`Bỏ lọc ${d}`}
          >
            <span>{d}</span>
            <FiX aria-hidden />
          </ChipWrapper>
        ))}
      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white/95 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/95 to-transparent" />

      {showOverflowHint && (
        <div className={`pointer-events-none ${isDesktop ? "absolute right-10 top-0" : "absolute right-2 top-2"} rounded bg-black/70 px-2 py-0.5 text-[10px] text-white shadow`}>
          Kéo để xem thêm
        </div>
      )}

      {isDesktop && hasOverflow && (
        <>
          <button
            type="button"
            aria-label="Cuộn trái"
            onClick={() => scrollChipsBy(-1)}
            className="hidden md:group-hover:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white/90 ring-1 ring-black/10 shadow hover:bg-white"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Cuộn phải"
            onClick={() => scrollChipsBy(1)}
            className="hidden md:group-hover:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full bg-white/90 ring-1 ring-black/10 shadow hover:bg-white"
          >
            <FiChevronRight />
          </button>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="hidden md:flex items-center gap-3 min-w-0 flex-1 relative">
        {activeFilterCount > 0 && (
          <div className="relative flex min-w-0 flex-1 group">
            {Content}
          </div>
        )}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-black text-white px-3 py-1 text-xs hover:bg-black/90"
            title="Xóa tất cả bộ lọc"
            aria-label="Xóa tất cả bộ lọc"
          >
            Xóa tất cả
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white text-black px-1.5 py-0.5 text-[10px] leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="md:hidden mt-2 mb-3 px-2">
      {activeFilterCount > 0 && (
        <div className="relative">
          {Content}
          <Button
            type="button"
            onClick={onClearAll}
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-black text-white px-3 py-1 text-xs hover:bg-black/90"
            title="Xóa tất cả bộ lọc"
            aria-label="Xóa tất cả bộ lọc"
          >
            Xóa tất cả
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white text-black px-1.5 py-0.5 text-[10px] leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default SelectedFilterChips;
