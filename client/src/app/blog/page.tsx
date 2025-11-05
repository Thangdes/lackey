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
  description: `Tin tức, kiến thức và cảm hứng về móc khóa từ ${siteConfig.name}. Khám phá xu hướng mới nhất và hướng dẫn bảo quản.`,
  keywords: [...siteConfig.default.keywords, "blog", "tin tức", "kiến thức móc khóa"],
  alternates: { canonical: `${siteConfig.url}/blog` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description: `Tin tức, kiến thức và cảm hứng về móc khóa từ ${siteConfig.name}`,
    siteName: siteConfig.name,
    locale: "vi_VN",
    images: [{ url: siteConfig.logo, alt: siteConfig.name, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: `Tin tức, kiến thức và cảm hứng về móc khóa từ ${siteConfig.name}`,
    images: [{ url: siteConfig.logo, alt: siteConfig.name }],
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
    <main className="bg-white min-h-screen">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <Script id="ld-blog" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${siteConfig.name} Blog`,
            url: `${siteConfig.url}/blog`,
            description: `Tin tức, công thức và chia sẻ từ ${siteConfig.name}.`,
          })}
        </Script>
        <header className="mb-12 md:mb-16 border-b border-black pb-8">
          <h1 className="font-[family-name:var(--font-retro)] text-5xl md:text-6xl lg:text-7xl text-neutral-900 mb-4 tracking-wider uppercase">
            Blog
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-2xl">
            Tin tức, kiến thức và cảm hứng về móc khóa. Khám phá những xu hướng mới nhất, 
            hướng dẫn bảo quản và cách phối đồ cùng móc khóa yêu thích.
          </p>
        </header>
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={siteConfig.url} className="text-neutral-600 hover:text-black transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <span className="text-neutral-600">/</span>
            </li>
            <li>
              <span className="text-neutral-900">Blog</span>
            </li>
          </ol>
        </nav>
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
            <div className="text-center py-20">
              <Newspaper className="size-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-neutral-900">Chưa có bài viết nào</p>
              <p className="text-sm text-neutral-600 mt-2">Nội dung sẽ được cập nhật sớm</p>
            </div>
          ) : (
            <>
              <BlogListServer posts={posts} />
              <div className="mt-12 flex items-center justify-between">
                <Link
                  href={{ pathname: ROUTES.blog, query: { page: Math.max(1, page - 1), limit } }}
                  className={`px-6 py-3 border-2 border-black bg-white text-black font-bold uppercase text-sm tracking-wider transition-all ${
                    page <= 1 ? "pointer-events-none opacity-30" : "hover:bg-black hover:text-white"
                  }`}
                  aria-disabled={page <= 1}
                >
                  ← Trang trước
                </Link>
                
                <span className="text-sm font-medium text-neutral-600">
                  Trang {page}
                </span>
                
                <Link
                  href={{ pathname: ROUTES.blog, query: { page: page + 1, limit } }}
                  className="px-6 py-3 border-2 border-black bg-black text-white font-bold uppercase text-sm tracking-wider hover:bg-white hover:text-black transition-all"
                >
                  Trang sau →
                </Link>
              </div>
            </>
          )}

          <div className="mt-12 p-8 bg-gray-50 border border-gray-200">
            <p className="text-sm text-neutral-700 mb-3">
              💡 Có ý tưởng cho bài viết mới? Hãy chia sẻ với chúng tôi!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href={ROUTES.contact} 
                className="px-4 py-2 bg-black text-white font-medium text-sm hover:bg-neutral-800 transition-colors"
              >
                Liên hệ người viết
              </Link>
              <Link 
                href={ROUTES.about} 
                className="px-4 py-2 border border-black text-black font-medium text-sm hover:bg-black hover:text-white transition-colors"
              >
                Về {siteConfig.name}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}