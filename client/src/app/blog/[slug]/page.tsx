import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { Home, ChevronRight, Calendar, List } from "lucide-react";
import type { BlogPost } from "@/type/blog";
import { siteConfig } from "@/constant/site";
import { ROUTES } from "@/constant/route";
import { sanitizeHtml } from "@/utils/sanitize";
import { getBlogPostSeo, buildBlogPostJsonLd } from "@/config/seo";

export const dynamic = "force-dynamic";

const RAW_PREFIX = process.env.NEXT_INTERNAL_API_PREFIX || "/api/v1";
const API_PREFIX = `/${RAW_PREFIX.replace(/^\/+/, "").replace(/\/$/, "")}`;

function getBackendBase(): string {
  const internal = process.env.NEXT_INTERNAL_API_BASE?.replace(/\/$/, "");
  if (internal) return `${internal}${API_PREFIX}`;

  const pub = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  if (pub && /^https?:\/\//i.test(pub)) return pub;

  return `http://localhost:8000${API_PREFIX}`;
}

function normalizePost(raw: unknown): BlogPost | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const s = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
  const su = (v: unknown) => (typeof v === "string" ? v : undefined);
  const id = s(r["id"]);
  const slug = s(r["slug"]);
  if (!id && !slug) return undefined;
  const createdAt = s(r["createdAt"], new Date().toISOString());
  const author = r["author"] as { username?: unknown } | undefined;
  return {
    id: id || slug,
    slug,
    title: s(r["title"]),
    excerpt: s(r["excerpt"], ""),
    contentHtml: s(r["content"], ""),
    createdAt,
    date: createdAt,
    updatedAt: su(r["updatedAt"]),
    coverImage: su(r["thumbnailUrl"]),
    authorUsername: typeof author?.username === "string" ? author.username : undefined,
    metaTitle: su(r["metaTitle"]),
    metaDescription: su(r["metaDescription"]),
    isPublished: typeof r["isPublished"] === "boolean" ? r["isPublished"] : undefined,
  } as BlogPost;
}

async function fetchPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const backendBase = getBackendBase();
  const url = `${backendBase}/posts/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return undefined;
    const json = await res.json();
    // Unwrap { success, data } envelope if present
    const raw =
      json && typeof json === "object" && (json as { success?: boolean }).success === true && "data" in json
        ? (json as { data: unknown }).data
        : json;
    return normalizePost(raw);
  } catch {
    return undefined;
  }
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (post) return getBlogPostSeo(post);
  const url = `${siteConfig.url}/blog/${slug}`;
  return {
    title: `Bài viết | ${siteConfig.name}`,
    description: `Bài viết từ ${siteConfig.name}`,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `Bài viết | ${siteConfig.name}`,
      description: `Bài viết từ ${siteConfig.name}`,
      siteName: siteConfig.name,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return notFound();
  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-12 md:py-20 md:px-6 lg:px-8 mt-20">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-600">
        <ol className="flex items-center gap-1">
          <li>
            <Link href={ROUTES.home || "/"} className="inline-flex items-center gap-1 hover:underline">
              <Home className="size-3.5" aria-hidden /> Trang chủ
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5 text-neutral-400" />
          </li>
          <li>
            <Link href={ROUTES.blog} className="hover:underline">Blog</Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5 text-neutral-400" />
          </li>
          <li className="text-neutral-800 line-clamp-1" aria-current="page">{post.title}</li>
        </ol>
      </nav>
      {(() => {
        return (
          <Script id={`ld-breadcrumb-${post.slug}`} type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Trang chủ",
                  item: siteConfig.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: `${siteConfig.url}${ROUTES.blog}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: `${siteConfig.url}/blog/${post.slug}`,
                },
              ],
            })}
          </Script>
        );
      })()}
      {(() => {
        return (
          <Script id={`ld-article-${post.slug}`} type="application/ld+json">
            {JSON.stringify(buildBlogPostJsonLd(post))}
          </Script>
        );
      })()}
      <article>
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{post.title}</h1>
          <div className="mt-1 text-neutral-600 text-sm inline-flex items-center gap-1">
            {(() => {
              const isoDate = post.date ?? post.updatedAt;
              if (!isoDate) return null;
              return (
                <>
                  <Calendar className="size-3.5" aria-hidden />
                  <time dateTime={isoDate}>{new Date(isoDate).toLocaleDateString("vi-VN")}</time>
                </>
              );
            })()}
          </div>
        </header>

        <aside className="mb-6 rounded-lg border border-neutral-200 bg-white/70 p-4">
          <div className="flex items-center gap-2 text-neutral-800 font-medium">
            <List className="size-4" aria-hidden /> Mục lục (sẽ tự động khi có nội dung dài)
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
            <li>Giới thiệu</li>
            <li>Nguyên liệu/Chuẩn bị</li>
            <li>Các bước thực hiện</li>
            <li>Mẹo nhỏ</li>
          </ul>
        </aside>

        {post.contentHtml ? (
          <div
            className="text-neutral-800 leading-7"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.contentHtml) }}
          />
        ) : (
          <>
            <p className="text-neutral-800 leading-7">{post.excerpt}</p>
            <div className="mt-6 text-neutral-500 text-sm">Nội dung chi tiết sẽ được cập nhật.</div>
          </>
        )}
      </article>
    </main>
  );
}
