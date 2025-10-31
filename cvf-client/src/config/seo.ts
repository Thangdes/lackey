import type { Metadata } from "next";
import { siteConfig } from "@/constant/site";
import { absoluteUrl } from "@/lib/url";
import type { Product } from "@/type/product";
import type { Category } from "@/service/category.service";
import { buildProductsByCategory } from "@/constant/route";
import type { BlogPost } from "@/type/blog";


const defaultOgImage = siteConfig.logo || absoluteUrl("/logo/logo.jpg");

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.default.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.default.description,
  keywords: siteConfig.default.keywords,
  applicationName: siteConfig.name,
  generator: "Next.js",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    other: [{ rel: "logo", url: "/logo/logo.jpg" }],
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{ url: defaultOgImage, alt: `${siteConfig.name} logo`, width: 1200, height: 630 }],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{ url: defaultOgImage, alt: `${siteConfig.name} logo`, width: 1200, height: 630 }],
  },
  verification: {
    // Add if available:
    // google: "google-site-verification-code",
    // other: { me: ["mailto:hattruongxuan@gmail.com"] },
  },
};

export const getBlogPostSeo = (post: BlogPost): Metadata => {
  const baseTitle = post?.metaTitle || post?.title;
  const title = baseTitle ? `${baseTitle} | ${siteConfig.name}` : `Bài viết | ${siteConfig.name}`;
  const description = post?.metaDescription || post?.excerpt || `Bài viết từ ${siteConfig.name}`;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const coverAbs = post?.coverImage
    ? (/^https?:\/\//.test(post.coverImage) ? post.coverImage : absoluteUrl(post.coverImage))
    : undefined;
  const robots = post && post.isPublished === false ? { index: false, follow: false } : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: coverAbs ? [{ url: coverAbs, alt: post?.title || baseTitle || siteConfig.name }] : undefined,
      authors: post?.authorUsername ? [post.authorUsername] : undefined,
      publishedTime: post?.date,
      modifiedTime: post?.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverAbs ? [coverAbs] : undefined,
    },
  };
};

export const buildBlogPostJsonLd = (post: BlogPost) => {
  const coverAbs = post.coverImage
    ? (/^https?:\/\//.test(post.coverImage) ? post.coverImage : absoluteUrl(post.coverImage))
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    image: coverAbs ? [coverAbs] : undefined,
    author: post.authorUsername ? { "@type": "Person", name: post.authorUsername } : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo,
      },
    },
  };
};

export const getCategorySeo = (c: Category): Metadata => {
  const title = c.name;
  const description = c.description || siteConfig.default.description;
  const path = buildProductsByCategory(c.slug);
  const url = absoluteUrl(path);
  const image = c.thumbnailUrl || defaultOgImage;
  const imageAbs = /^https?:\/\//.test(String(image)) ? String(image) : absoluteUrl(String(image));

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: imageAbs }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageAbs],
    },
  };
};

export const buildCategoryJsonLd = (c: Category) => {
  const path = buildProductsByCategory(c.slug);
  const url = absoluteUrl(path);
  const image = c.thumbnailUrl || defaultOgImage;
  const imageAbs = /^https?:\/\//.test(String(image)) ? String(image) : absoluteUrl(String(image));
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.name,
    description: c.description || siteConfig.default.description,
    url,
    image: [imageAbs],
  };
};

export const buildProductJsonLd = (p: Product) => {
  const images = (p.images?.length ? p.images : [p.thumbnailUrl].filter(Boolean)) as string[];
  const offer = p.variants?.[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: images,
    description: p.description,
    brand: siteConfig.name,
    aggregateRating:
      p.ratingAvg && p.ratingCount
        ? {
            "@type": "AggregateRating",
            ratingValue: String(p.ratingAvg),
            reviewCount: String(p.ratingCount),
          }
        : undefined,
    offers: offer
      ? {
          "@type": "Offer",
          priceCurrency: "VND",
          price: String(offer.price ?? ""),
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/products/${p.slug}`),
        }
      : undefined,
  };
};

export const getProductSeo = (p: Product): Metadata => {
  const title = p.name;
  const description = p.description || siteConfig.default.description;
  const url = absoluteUrl(`/products/${p.slug}`);
  const ogImages =
    p.images?.length
      ? p.images
      : [p.thumbnailUrl || defaultOgImage].filter(Boolean);
  // Ensure OG/Twitter images use absolute URLs
  const ogImagesAbs = (ogImages as (string | undefined)[])
    .map((src) => (src ? (/^https?:\/\//.test(src) ? src : absoluteUrl(src)) : undefined))
    .filter((s): s is string => Boolean(s));

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: ogImagesAbs.map((src) => ({ url: src })),
    },
    other: {
      "og:type": "product",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImagesAbs,
    },
  };
};