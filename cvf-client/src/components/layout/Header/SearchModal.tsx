"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductSearch } from "@/hook/useProductSearch";
import { buildProductDetailPath, buildProductsWithParams } from "@/constant/route";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { results, loading } = useProductSearch(query, 6);

  const popularSearches = ["Anime Naruto", "Kpop BTS", "Pikachu", "Doraemon"];

  useEffect(() => {
    if (!isOpen) return;
    try {
      const raw = window.localStorage.getItem("op_recent_searches");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const items = arr
            .filter((x: unknown) => typeof (x as { term?: string })?.term === "string")
            .sort((a: { t?: number }, b: { t?: number }) => (b.t ?? 0) - (a.t ?? 0))
            .map((x: { term: string }) => x.term)
            .slice(0, 6);
          setRecentSearches(items);
        }
      }
    } catch {}
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const pushRecent = useCallback((term: string) => {
    const val = term.trim();
    if (!val) return;
    setRecentSearches((prev) => {
      const dedup = [val, ...prev.filter((x) => x.toLowerCase() !== val.toLowerCase())];
      const limited = dedup.slice(0, 6);
      try {
        const now = Date.now();
        const payload = limited.map((s) => ({ term: s, t: s.toLowerCase() === val.toLowerCase() ? now : now - 1 }));
        window.localStorage.setItem("op_recent_searches", JSON.stringify(payload));
      } catch {}
      return limited;
    });
  }, []);

  const handleSearch = useCallback(() => {
    const v = query.trim();
    if (v) {
      pushRecent(v);
      router.push(buildProductsWithParams({ q: v }));
      onClose();
    }
  }, [query, router, onClose, pushRecent]);

  const handleSearchClick = useCallback((searchTerm: string) => {
    pushRecent(searchTerm);
    router.push(buildProductsWithParams({ q: searchTerm }));
    onClose();
  }, [router, onClose, pushRecent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white">
      {/* Header */}
      <div className="border-b border-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Tìm kiếm móc khóa, anime, kpop..."
                className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-black focus:outline-none focus:border-black bg-white text-black placeholder:text-gray-400"
              />
              <Search className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 sm:p-3 md:p-4 border-2 border-black hover:bg-black hover:text-white transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 sm:py-6 md:py-8 overflow-auto max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-110px)] md:max-h-[calc(100vh-120px)]">
        {query.trim() ? (
          // Search Results
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-gray-600">
              Kết quả tìm kiếm
            </h2>
            {loading ? (
              <p className="text-sm sm:text-base text-gray-600">Đang tìm kiếm...</p>
            ) : results.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-600">Không tìm thấy sản phẩm nào</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={buildProductDetailPath(product.slug || product.id)}
                    onClick={onClose}
                    className="border border-transparent hover:border-black transition-all p-2 sm:p-3 md:p-4 flex gap-2 sm:gap-3 md:gap-4"
                  >
                    {product.thumbnailUrl ? (
                      <Image
                        src={product.thumbnailUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover bg-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-1">{product.name}</h3>
                      {product.minEffectivePrice && (
                        <p className="text-xs sm:text-sm font-bold text-black">
                          {product.minEffectivePrice.toLocaleString()}₫
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Recent & Popular Searches
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-gray-600 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Tìm kiếm gần đây
                </h2>
                <div className="space-y-1.5 sm:space-y-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearchClick(term)}
                      className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Tìm kiếm phổ biến
              </h2>
              <div className="space-y-1.5 sm:space-y-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchClick(term)}
                    className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-2 sm:py-3 md:py-4">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center">
            Nhấn <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 border border-gray-300 rounded text-[10px] sm:text-xs font-mono">ESC</kbd> để đóng
          </p>
        </div>
      </div>
    </div>
  );
}
