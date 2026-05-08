"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Search, ArrowRight, X } from "lucide-react";
import { ROUTES, buildProductsByCategory } from "@/constant/route";
import { useRouter } from "next/navigation";
import { categoryService, type Category } from "@/service/category.service";

export default function NotFound() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popularCats, setPopularCats] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!autoRedirect) return;
    timeoutRef.current = setTimeout(() => {
      router.push("/");
    }, secondsLeft * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRedirect]);

  useEffect(() => {
    if (!autoRedirect) return;
    const iv = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [autoRedirect]);

  useEffect(() => {
    let mounted = true;
    categoryService
      .headerTop()
      .then((items) => { if (mounted) setPopularCats(items?.slice(0, 6) ?? []); })
      .catch(() => {})
      .finally(() => {});
    return () => { mounted = false };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <main className="relative min-h-[78vh] w-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, #000 1px, transparent 0)
          `,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-block relative">
              <h1 className="text-[100px] md:text-[160px] lg:text-[200px] font-bold bg-gradient-to-br from-neutral-800 via-neutral-600 to-neutral-500 bg-clip-text text-transparent leading-none tracking-tight">
                404
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent rounded-full" />
            </div>
          </div>

          <div className="text-center mb-6 md:mb-8 animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              Trang không tìm thấy
            </h2>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Ối! Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi. 
              Hãy thử tìm kiếm sản phẩm hoặc quay về trang chủ nhé!
            </p>
          </div>

          <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                <div className="relative bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-5 py-4 text-base md:text-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none rounded-xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-200"
                    aria-label="Tìm kiếm"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {popularCats.length > 0 && (
            <div className="mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <p className="text-center text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
                Danh mục phổ biến
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {popularCats.map((c) => (
                  <Link
                    key={c.id}
                    href={buildProductsByCategory(c.id)}
                    className="inline-block px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-700 text-sm font-medium hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900 transition-all duration-200 shadow-sm hover:shadow"
                    title={c.name}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href={ROUTES.contact}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-neutral-700 rounded-xl font-medium border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-300 transition-all duration-200 shadow-sm hover:shadow"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

          <div className="flex justify-center animate-in fade-in zoom-in-95 duration-700 delay-500">
            {autoRedirect ? (
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-5 py-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-600 text-sm font-medium">Tự động chuyển sau</span>
                  <div className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#e5e5e5"
                          strokeWidth="3"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#171717"
                          strokeWidth="3"
                          strokeDasharray={`${(secondsLeft / 10) * 125.6} 125.6`}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-900 font-bold text-lg">
                        {secondsLeft}
                      </div>
                    </div>
                    <span className="text-neutral-500 text-sm">giây</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors duration-200"
                  onClick={() => setAutoRedirect(false)}
                >
                  <X className="w-4 h-4" />
                  Huỷ
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-5 py-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-neutral-600 text-sm">Đã tắt tự động chuyển</span>
                <button
                  type="button"
                  className="text-sm font-medium text-neutral-900 hover:text-neutral-700 underline hover:no-underline transition-colors duration-200"
                  onClick={() => { setSecondsLeft(10); setAutoRedirect(true); }}
                >
                  Bật lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}