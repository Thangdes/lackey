"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Search, ArrowRight } from "lucide-react";
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
    <main className="relative min-h-[78vh] w-full bg-white py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(0deg, #000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block relative">
              <h1 
                className="font-[family-name:var(--font-retro)] text-[120px] md:text-[200px] lg:text-[280px] font-bold text-black leading-none tracking-wider"
                style={{
                  textShadow: "8px 8px 0px #229090, 16px 16px 0px #fff100"
                }}
              >
                404
              </h1>
            </div>
          </div>

          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-block px-6 py-3 bg-[#fff100] border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,144,144,1)]">
              <span className="font-[family-name:var(--font-retro)] text-xl md:text-2xl text-black uppercase tracking-wider font-bold">
                TRANG KHÔNG TÌM THẤY
              </span>
            </div>
          </div>

          <div className="text-center mb-8 md:mb-12">
            <p className="text-base md:text-lg text-black/80 max-w-2xl mx-auto leading-relaxed">
              Ối! Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi. 
              <br className="hidden md:block" />
              Hãy thử tìm kiếm sản phẩm hoặc quay về trang chủ nhé!
            </p>
          </div>

          <div className="mb-8 md:mb-12">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,144,144,1)]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full px-6 py-4 text-base md:text-lg text-black placeholder:text-black/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-black text-white hover:bg-[#229090] transition-colors"
                  aria-label="Tìm kiếm"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {popularCats.length > 0 && (
            <div className="mb-8 md:mb-12">
              <p className="text-center font-bold text-black uppercase tracking-wide mb-4">
                Hoặc xem các danh mục phổ biến
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularCats.map((c) => (
                  <Link
                    key={c.id}
                    href={buildProductsByCategory(c.id)}
                    className="inline-block px-5 py-2.5 bg-white border-4 border-black text-black font-bold uppercase text-sm hover:bg-[#fff100] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    title={c.name}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-[#229090] border-4 border-black font-[family-name:var(--font-retro)] text-lg uppercase tracking-wider transition-all shadow-[8px_8px_0px_0px_rgba(255,241,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 group"
            >
              <Home className="w-5 h-5" />
              <span>Về trang chủ</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>

            <Link
              href={ROUTES.contact}
              className="inline-flex items-center gap-2 px-6 py-4 bg-white text-black hover:bg-[#fff100] border-4 border-black font-bold uppercase text-base transition-colors shadow-[4px_4px_0px_0px_rgba(34,144,144,1)]"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

          <div className="flex justify-center">
            {autoRedirect ? (
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3 bg-white border-4 border-black">
                <span className="text-black font-bold text-sm uppercase">Tự động chuyển sau:</span>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-black text-[#fff100] font-[family-name:var(--font-retro)] text-2xl font-bold min-w-[60px] text-center">
                    {secondsLeft}
                  </div>
                  <span className="text-black text-sm">giây</span>
                </div>
                <button
                  type="button"
                  className="text-sm underline hover:no-underline font-bold text-black uppercase"
                  onClick={() => setAutoRedirect(false)}
                >
                  Huỷ
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#fff100] border-4 border-black">
                <span className="text-black text-sm">Đã tắt tự động chuyển</span>
                <button
                  type="button"
                  className="text-sm underline hover:no-underline font-bold text-black uppercase"
                  onClick={() => { setSecondsLeft(10); setAutoRedirect(true); }}
                >
                  Bật lại
                </button>
              </div>
            )}
          </div>

          <div className="mt-12 md:mt-16 flex justify-center">
            <div className="h-2 w-32 md:w-48 bg-black" />
          </div>
        </div>
      </div>
    </main>
  );
}