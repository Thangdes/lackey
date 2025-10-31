import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { ROUTES } from "@/constant/route";
import { siteConfig } from "@/constant/site";
import type { BlogPost } from "@/type/blog";
import { BlogListServer } from "@/components/blog/BlogListServer";
import { postService } from "@/service/post.service";

export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description: `Tin tức, công thức và chia sẻ từ ${siteConfig.name}.`,
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description: `Tin tức, công thức và chia sẻ từ ${siteConfig.name}.`,
    siteName: siteConfig.name,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: `Tin tức, công thức và chia sẻ từ ${siteConfig.name}.`,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string }> }) {
  const placeholders: BlogPost[] = Array.from({ length: 6 }).map((_, idx) => {
    const createdAt = new Date().toISOString();
    return {
      id: `placeholder-${idx + 1}`,
      slug: `placeholder-${idx + 1}`,
      title: `Bài viết demo ${idx + 1}`,
      excerpt: "Nội dung đang được cập nhật.",
      createdAt,
      date: createdAt, // legacy alias
      coverImage: undefined,
    } as BlogPost;
  });
  const sp = await searchParams;
  const page = Number(sp?.page ?? 1) || 1;
  const limit = Number(sp?.limit ?? 10) || 10;

  let posts: BlogPost[] = placeholders;
  try {
    posts = await postService.list({ page, limit });
  } catch {
    posts = placeholders;
  }
  return (
    <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-blog" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${siteConfig.name} Blog`,
          url: `${siteConfig.url}/blog`,
          description: `Tin tức, công thức và chia sẻ từ ${siteConfig.name}.`,
        })}
      </Script>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 inline-flex items-center gap-2">
          <Newspaper className="size-7  mt-1" aria-hidden />
          Bài viết
        </h1>
        <p className="text-neutral-700 mt-2 text-lg">
          Tin tức, công thức, kinh nghiệm từ {siteConfig.name}. Nội dung mới sẽ được cập nhật thường xuyên.
        </p>
      </header>
      <Script id="ld-breadcrumb-blog" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
          ],
        })}
      </Script>

      <section>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-neutral-600">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <>
            <BlogListServer posts={posts} />
            <div className="mt-6 flex items-center justify-between">
              <Link
                href={{ pathname: ROUTES.blog, query: { page: Math.max(1, page - 1), limit } }}
                className={`text-sm rounded-full px-3 py-1.5 border ${
                  page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-neutral-50"
                }`}
                aria-disabled={page <= 1}
              >
                Trang trước
              </Link>
              <Link
                href={{ pathname: ROUTES.blog, query: { page: page + 1, limit } }}
                className="text-sm rounded-full px-3 py-1.5 border hover:bg-neutral-50"
              >
                Trang sau
              </Link>
            </div>
          </>
        )}

        <div className="mt-6 text-sm text-neutral-700">
          Gợi ý chủ đề bạn quan tâm qua mục Liên hệ hoặc theo dõi chúng tôi tại trang Giới thiệu.
          <div className="mt-2">
            <Link href={ROUTES.about} className="text-[#0F5555] hover:underline">
              Về {siteConfig.name}
            </Link>
            <span className="px-2">·</span>
            <Link href={ROUTES.contact} className="text-[#0F5555] hover:underline">
              Liên hệ
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}