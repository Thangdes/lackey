"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Search, X, Clock, TrendingUp, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductSearch, type QuickSearchItem } from "@/hook/useProductSearch";
import { buildProductDetailPath, buildProductsWithParams } from "@/constant/route";
import { getRecentProducts } from "@/utils/recent";
import type { Product, ProductVariant } from "@/type/product";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
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
    } catch { }

    try {
      const recent = getRecentProducts();
      setRecentProducts(recent.slice(0, 6));
    } catch { }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
      } catch { }
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

  const calculateDiscount = (product: QuickSearchItem | Product) => {
    if (!('variants' in product) || !product.variants || product.variants.length === 0) {
      return null;
    }

    const validVariants = product.variants.filter((v: ProductVariant) => v.price && v.discountPrice && v.discountPrice < v.price);
    if (validVariants.length === 0) return null;

    const maxDiscount = Math.max(...validVariants.map((v: ProductVariant) => {
      const price = v.price;
      const discountPrice = v.discountPrice!;
      return Math.round(((price - discountPrice) / price) * 100);
    }));

    return maxDiscount > 0 ? maxDiscount : null;
  };

  const renderProductCard = (product: QuickSearchItem | Product, key: string) => {
    const discount = calculateDiscount(product);
    const variantCount = ('variants' in product && product.variants) ? product.variants.length : 0;
    const hasStock = 'inStock' in product
      ? product.inStock
      : ('variants' in product && product.variants)
        ? product.variants.some((v: ProductVariant) => (v.stockQuantity ?? 0) > 0)
        : undefined;

    return (
      <Link
        key={key}
        href={buildProductDetailPath(product.slug || product.id)}
        onClick={onClose}
        className="group border-2 border-gray-200 hover:border-black transition-all p-3 flex gap-4 bg-white hover:shadow-lg"
      >
        <div className="relative flex-shrink-0">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              width={100}
              height={100}
              className="w-20 h-20 md:w-24 md:h-24 object-cover bg-gray-100"
            />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
          {discount && (
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5">
              -{discount}%
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            {product.category?.name && (
              <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              {product.minEffectivePrice && (
                <p className="text-base font-bold text-black">
                  {product.minEffectivePrice.toLocaleString()}₫
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {variantCount > 1 && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  {variantCount} phiên bản
                </span>
              )}
              {hasStock === false && (
                <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  Hết hàng
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-white">
      <div className="border-b border-black">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-3 sm:py-4 md:py-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                placeholder="Tìm kiếm bàn phím, keycap, switch..."
                className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-black focus:outline-none focus:border-black bg-white text-black placeholder:text-gray-400"
              />
              <Search className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-400" />
            </div>

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

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 sm:py-6 md:py-8 overflow-auto max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-110px)] md:max-h-[calc(100vh-120px)]">
        {query.trim() ? (
          <div>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 sm:mb-4 text-gray-600">
              Kết quả tìm kiếm
            </h2>
            {loading ? (
              <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                Đang tìm kiếm...
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base text-gray-600 mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {results.map((product, index) => renderProductCard(product, `search-${index}`))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {recentProducts.length > 0 && (
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-gray-600 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Sản phẩm đã xem gần đây
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {recentProducts.map((product, index) => renderProductCard(product, `recent-${index}`))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
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
          </div>
        )}
      </div>
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
