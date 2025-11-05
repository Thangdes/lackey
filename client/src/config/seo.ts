import type { Metadata } from "next";
import { siteConfig } from "@/constant/site";
import { absoluteUrl } from "@/lib/url";
import type { Product } from "@/type/product";
import type { Category } from "@/service/category.service";
import { buildProductsByCategory } from "@/constant/route";
import type { BlogPost } from "@/type/blog";

const defaultOgImage = siteConfig.logo || absoluteUrl("/logo/logo.jpg");
const defaultImageDimensions = { width: 1200, height: 630 };

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.default.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.default.description,
  keywords: siteConfig.default.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "e-commerce",
  alternates: { canonical: "/" },
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/logo.jpg", type: "image/jpeg" },
    ],
    apple: [{ url: "/logo/logo.jpg" }],
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{
      url: defaultOgImage,
      alt: siteConfig.name,
      ...defaultImageDimensions,
    }],
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.name,
    creator: siteConfig.name,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{
      url: defaultOgImage,
      alt: siteConfig.name,
    }],
  },
};

export const getBlogPostSeo = (post: BlogPost): Metadata => {
  const title = post?.metaTitle || post?.title || "Bài viết";
  const description = post?.metaDescription || post?.excerpt || `Bài viết từ ${siteConfig.name}`;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const coverAbs = post?.coverImage
    ? (/^https?:\/\//.test(post.coverImage) ? post.coverImage : absoluteUrl(post.coverImage))
    : defaultOgImage;
  const robots = post?.isPublished === false ? { index: false, follow: false } : { index: true, follow: true };

  return {
    title,
    description,
    authors: post?.authorUsername ? [{ name: post.authorUsername }] : [{ name: siteConfig.name }],
    alternates: { canonical: url },
    robots,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "vi_VN",
      images: [{
        url: coverAbs,
        alt: title,
        ...defaultImageDimensions,
      }],
      authors: post?.authorUsername ? [post.authorUsername] : undefined,
      publishedTime: post?.date,
      modifiedTime: post?.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: coverAbs, alt: title }],
    },
  };
};

export const buildBlogPostJsonLd = (post: BlogPost) => {
  const coverAbs = post.coverImage
    ? (/^https?:\/\//.test(post.coverImage) ? post.coverImage : absoluteUrl(post.coverImage))
    : defaultOgImage;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.metaDescription,
    image: [coverAbs],
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": post.authorUsername ? "Person" : "Organization",
      name: post.authorUsername || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
    inLanguage: "vi-VN",
  };
};

export const getCategorySeo = (c: Category): Metadata => {
  const title = `${c.name} - ${siteConfig.name}`;
  const description = c.description || `Xem tất cả sản phẩm ${c.name} tại ${siteConfig.name}`;
  const path = buildProductsByCategory(c.slug);
  const url = absoluteUrl(path);
  const image = c.thumbnailUrl || defaultOgImage;
  const imageAbs = /^https?:\/\//.test(String(image)) ? String(image) : absoluteUrl(String(image));

  return {
    title,
    description,
    keywords: [c.name, siteConfig.name, ...siteConfig.default.keywords],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: "vi_VN",
      images: [{
        url: imageAbs,
        alt: c.name,
        ...defaultImageDimensions,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageAbs, alt: c.name }],
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
    description: c.description || `Danh mục ${c.name}`,
    url,
    image: imageAbs,
    mainEntity: {
      "@type": "ItemList",
      name: c.name,
    },
    breadcrumb: {
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
          name: c.name,
          item: url,
        },
      ],
    },
  };
};

export const buildProductJsonLd = (p: Product) => {
  const images = (p.images?.length ? p.images : [p.thumbnailUrl].filter(Boolean)) as string[];
  const imageUrls = images.map(img => /^https?:\/\//.test(img) ? img : absoluteUrl(img));
  const offer = p.variants?.[0];
  const price = offer?.discountPrice && offer.discountPrice > 0 ? offer.discountPrice : offer?.price;
  const availability = (offer?.stockQuantity ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: imageUrls,
    description: p.description || `Sản phẩm ${p.name} tại ${siteConfig.name}`,
    sku: offer?.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    aggregateRating: p.ratingAvg && p.ratingCount
      ? {
          "@type": "AggregateRating",
          ratingValue: p.ratingAvg,
          reviewCount: p.ratingCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    offers: offer
      ? {
          "@type": "Offer",
          url: absoluteUrl(`/products/${p.slug}`),
          priceCurrency: "VND",
          price: price,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability,
          itemCondition: "https://schema.org/NewCondition",
          seller: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        }
      : undefined,
  };
};

export const getProductSeo = (p: Product): Metadata => {
  const title = `${p.name} - ${siteConfig.name}`;
  const description = p.description || `Mua ${p.name} chất lượng cao tại ${siteConfig.name}. Giao hàng nhanh toàn quốc.`;
  const url = absoluteUrl(`/products/${p.slug}`);
  const ogImages = p.images?.length ? p.images : [p.thumbnailUrl || defaultOgImage].filter(Boolean);
  const ogImagesAbs = (ogImages as (string | undefined)[])
    .map((src) => (src ? (/^https?:\/\//.test(src) ? src : absoluteUrl(src)) : undefined))
    .filter((s): s is string => Boolean(s));

  const offer = p.variants?.[0];
  const price = offer?.discountPrice && offer.discountPrice > 0 ? offer.discountPrice : offer?.price;
  const keywords = [p.name, siteConfig.name, ...siteConfig.default.keywords];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: "vi_VN",
      images: ogImagesAbs.map((src) => ({
        url: src,
        alt: p.name,
        ...defaultImageDimensions,
      })),
    },
    other: price ? {
      "product:price:amount": price.toString(),
      "product:price:currency": "VND",
    } : undefined,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImagesAbs.map(src => ({ url: src, alt: p.name })),
    },
  };
};

export const buildOrganizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.company.legalName,
  url: siteConfig.url,
  logo: siteConfig.logo,
  description: siteConfig.default.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.company.address,
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.contact.telephoneE164,
    contactType: "customer service",
    email: siteConfig.contact.email,
    areaServed: "VN",
    availableLanguage: ["vi"],
  },
  sameAs: siteConfig.sameAs,
});

export const buildWebsiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.default.description,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    logo: siteConfig.logo,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "vi-VN",
});

export const buildBreadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

type FAQItem = { question: string; answer: string };
export const buildFAQJsonLd = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const buildLocalBusinessJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": siteConfig.url,
  name: siteConfig.name,
  image: siteConfig.logo,
  telephone: siteConfig.contact.telephone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.company.address,
    addressCountry: "VN",
  },
  url: siteConfig.url,
  openingHoursSpecification: siteConfig.openingHours.map(hours => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.split(" ")[0].split("-"),
    opens: hours.split(" ")[1].split("-")[0],
    closes: hours.split(" ")[1].split("-")[1],
  })),
  priceRange: "$$",
  sameAs: siteConfig.sameAs,
});