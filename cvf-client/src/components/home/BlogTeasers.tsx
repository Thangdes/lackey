"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/common/SectionHeader";
import { usePosts } from "@/hook/usePost";
import type { BlogPost } from "@/type/blog";

export type BlogTeaser = {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  publishedAt?: string;
  excerpt?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  tags?: string[];
};

export type BlogTeasersProps = {
  title?: string;
  viewAllHref?: string;
  items?: BlogTeaser[];
  gradientCss?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  } catch {
    return "";
  }
}

const BlogTeasers: React.FC<BlogTeasersProps> = ({ title = "Từ blog của chúng tôi", viewAllHref = "/blog", items, gradientCss }) => {
  const { data: posts, isLoading } = usePosts({ page: 1, limit: 4 });
  const apiList = useMemo<BlogTeaser[]>(() => {
    const arr: BlogPost[] = Array.isArray(posts) ? posts : [];
    return arr.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      coverUrl: p.coverImage,
      publishedAt: p.createdAt,
      excerpt: p.excerpt,
      authorName: p.authorUsername || "LắcKey",
      authorAvatarUrl: p.authorUsername ? "/logo/logo.jpg" : "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      tags: [],
    } satisfies BlogTeaser));
  }, [posts]);

  const list = items && items.length ? items : apiList;
  return (
    <section aria-label="Blog" className="py-0">
      <div
        className=""
        style={{
          background:
            gradientCss ||
            "linear-gradient(90deg, var(--brand-grad-start), var(--brand-grad-mid), var(--brand-grad-end))",
          borderColor: "var(--color-cod-gray-900)",
        }}
      >
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-12">
          <SectionHeader
            title={<h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">{title}</h2>}
            ctaHref={viewAllHref}
            ctaText="Xem tất cả"
            align="left"
            inverted
          />

        <div className="md:hidden">
          <div className="flex flex-col gap-3">
            {isLoading && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="basis-full min-w-0 flex">
                    <div className="w-full overflow-hidden rounded-xl border border-surface bg-surface h-full flex flex-col">
                      <div className="relative w-full aspect-[16/10] bg-neutral-200 animate-pulse" />
                      <div className="p-3 flex-1 flex flex-col">
                        <div className="h-3 w-16 bg-neutral-200 rounded animate-pulse" />
                        <div className="mt-2 h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
                        <div className="mt-2 h-3 w-full bg-neutral-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && list.length === 0 && (
              <div className="w-full text-white/90 text-sm">Hiện chưa có bài viết nào.</div>
            )}
            {!isLoading && list.length > 0 && list.map((post) => (
              <div key={post.id} className="basis-full min-w-0 flex">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-xl border border-surface bg-surface hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 h-full flex flex-col"
                  aria-label={`Xem bài viết ${post.title}`}
                >
                  <div className="relative w-full aspect-[16/10]">
                    <Image
                      src={post.coverUrl || "/logo/logo.jpg"}
                      alt={post.title}
                      fill
                      sizes="100vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-[11px] text-neutral-600">{formatDate(post.publishedAt)}</div>
                    <h3 className="mt-1 text-sm font-semibold text-[var(--color-cod-gray-900)] line-clamp-2 break-words">{post.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full bg-neutral-100">
                        <Image src={post.authorAvatarUrl || "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg"} alt={post.authorName || "LắcKey"} fill sizes="24px" className="object-cover" />
                      </div>
                      <div className="text-[12px] text-neutral-700">{post.authorName || "LắcKey"}</div>
                      {post.tags && post.tags.length ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {post.excerpt ? (
                      <p className="mt-1 text-sm text-neutral-700 line-clamp-3 break-words">{post.excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {isLoading && (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="min-w-0">
                    <div className="block overflow-hidden rounded-xl border border-surface bg-surface h-full w-full flex flex-col">
                      <div className="relative w-full aspect-[16/10] bg-neutral-200 animate-pulse" />
                      <div className="p-3 flex-1 flex flex-col">
                        <div className="h-3.5 w-20 bg-neutral-200 rounded animate-pulse" />
                        <div className="mt-2 h-5 w-4/5 bg-neutral-200 rounded animate-pulse" />
                        <div className="mt-2 h-3 w-full bg-neutral-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {!isLoading && list.length === 0 && (
              <div className="w-full text-white/90 text-sm">Hiện chưa có bài viết nào.</div>
            )}
            {!isLoading && list.length > 0 && list.map((post) => (
              <div key={post.id} className="min-w-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block overflow-hidden rounded-xl border border-surface bg-surface hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 h-full flex flex-col"
                  aria-label={`Xem bài viết ${post.title}`}
                >
                  <div className="relative w-full aspect-[16/10]">
                    <Image
                      src={post.coverUrl || "/logo/logo.jpg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1280px) 33vw, 400px"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <div className="text-xs text-neutral-600">{formatDate(post.publishedAt)}</div>
                    <h3 className="mt-1 text-base font-semibold text-[var(--color-cod-gray-900)] line-clamp-2 break-words">{post.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative h-7 w-7 overflow-hidden rounded-full bg-neutral-100">
                        <Image src={post.authorAvatarUrl || "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg"} alt={post.authorName || "LắcKey"} fill sizes="28px" className="object-cover" />
                      </div>
                      <div className="text-xs text-neutral-700">{post.authorName || "LắcKey"}</div>
                      {post.tags && post.tags.length ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((t) => (
                            <span key={t} className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    {post.excerpt ? (
                      <p className="mt-1 text-sm text-neutral-700 line-clamp-3 break-words">{post.excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTeasers;
