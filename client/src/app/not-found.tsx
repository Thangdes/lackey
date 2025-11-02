"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, HelpCircle } from "lucide-react";
import { ROUTES, buildProductsByCategory } from "@/constant/route";
import SearchInput from "@/components/layout/Header/SearchInput";
import { useRouter } from "next/navigation";
import { categoryService, type Category } from "@/service/category.service";

export default function NotFound() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(20);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popularCats, setPopularCats] = useState<Category[]>([]);

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
      .then((items) => { if (mounted) setPopularCats(items?.slice(0, 8) ?? []); })
      .catch(() => {})
      .finally(() => {});
    return () => { mounted = false };
  }, []);

  return (
    <main className="min-h-[78vh] w-full flex items-center justify-center py-12 md:py-16 px-4">
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center text-black">
        <div className="order-2 md:order-1 text-center md:text-left">
          <nav className="text-sm mb-3" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-1 text-neutral-600">
              <li>
                <Link href="/" className="hover:underline inline-flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden className="text-neutral-400">/</li>
              <li className="text-neutral-800">Không tìm thấy</li>
            </ol>
          </nav>
          <p className="text-xs font-semibold tracking-wider uppercase text-neutral-600">Mã lỗi: 404</p>
          <h1 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-black">
            Trang bạn tìm không tồn tại
          </h1>
          <p className="mt-3 text-sm md:text-base text-neutral-700 leading-relaxed">
            Có thể liên kết đã sai hoặc trang đã được chuyển đi. Hãy quay về trang chủ hoặc liên hệ hỗ trợ để được giúp đỡ.
          </p>

          <div className="mt-6">
            <SearchInput containerClassName="w-full max-w-xl mx-auto md:mx-0" placeholder="Tìm kiếm sản phẩm..." />
          </div>

          {popularCats.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-neutral-600 mb-2">Các danh mục phổ biến</p>
              <div className="flex flex-wrap gap-2">
                {popularCats.map((c) => (
                  <Link
                    key={c.id}
                    href={buildProductsByCategory(c.id)}
                    className="inline-flex items-center rounded-full border border-neutral-300 bg-white text-black px-3 py-1 text-sm hover:bg-neutral-50"
                    title={c.name}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <Button asChild className="h-10 px-4 rounded-full">
              <Link href="/" aria-label="Về trang chủ">
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4 rounded-full border-neutral-300 text-black hover:bg-neutral-50">
              <Link href={ROUTES.contact} aria-label="Liên hệ hỗ trợ">
                <HelpCircle className="h-4 w-4 mr-2" />
                Liên hệ hỗ trợ
              </Link>
            </Button>
          </div>

          {autoRedirect && (
            <div className="mt-4 text-sm text-neutral-600">
              Tự động chuyển về trang chủ sau <span className="font-semibold text-black">{secondsLeft}</span> giây.
              <button
                type="button"
                className="ml-2 underline hover:no-underline font-medium text-black"
                onClick={() => setAutoRedirect(false)}
              >
                Huỷ tự động chuyển
              </button>
            </div>
          )}
          {!autoRedirect && (
            <div className="mt-4 text-sm text-neutral-600">
              Tự động chuyển đã tắt.
              <button
                type="button"
                className="ml-2 underline hover:no-underline font-medium text-black"
                onClick={() => { setSecondsLeft(20); setAutoRedirect(true); }}
              >
                Tiếp tục tự động chuyển
              </button>
            </div>
          )}
        </div>

        <div className="order-1 md:order-2 flex items-center justify-center">
          <Image
            src="/404.svg"
            alt="Hình minh hoạ trang không tồn tại"
            width={560}
            height={340}
            className="w-full h-auto max-w-[560px] drop-shadow-xl"
            priority
          />
        </div>
      </section>
    </main>
  );
}