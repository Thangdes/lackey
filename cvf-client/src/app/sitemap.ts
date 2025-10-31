import type { MetadataRoute } from "next";
import { siteConfig } from "@/constant/site";
import { ROUTES, buildProductsByCategory } from "@/constant/route";
import { postService } from "@/service/post.service";
import { categoryService } from "@/service/category.service";
import { productService } from "@/service/product.service";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();
  const base = siteConfig.url.replace(/\/+$/, "");

  const entries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${base}${ROUTES.products}`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}${ROUTES.blog}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}${ROUTES.about}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}${ROUTES.contact}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}${ROUTES.terms}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}${ROUTES.privacy}`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}${ROUTES.help}`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}${ROUTES.shipping}`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}${ROUTES.return}`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const [postsRes, categoriesRes, productsRes] = await Promise.allSettled([
    postService
      .list({ page: 1, limit: 1000 })
      .then((posts) =>
        posts.map((p) => ({
          url: `${base}${ROUTES.blog}/${encodeURIComponent(p.slug)}`,
          lastModified: p.updatedAt ?? p.createdAt ?? now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      ),
    categoryService
      .list()
      .then((cats) =>
        (Array.isArray(cats) ? cats : []).map((c) => ({
          url: `${base}${buildProductsByCategory(c.slug)}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        }))
      ),
    (async () => {
      const all: { slug: string }[] = [];
      let page = 1;
      const limit = 100;
      const MAX_PAGES = 50;
      for (; page <= MAX_PAGES; page++) {
        const { data } = await productService.list({ page, limit });
        const batch = (data ?? []).map((p) => ({ slug: p.slug }));
        all.push(...batch);
        if (batch.length < limit) break;
      }
      return all.map((p) => ({
        url: `${base}${ROUTES.products}/${encodeURIComponent(p.slug)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    })(),
  ]);

  if (postsRes.status === "fulfilled") entries.push(...postsRes.value);
  if (categoriesRes.status === "fulfilled") entries.push(...categoriesRes.value);
  if (productsRes.status === "fulfilled") entries.push(...productsRes.value);

  return entries;
}