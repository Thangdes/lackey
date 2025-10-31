import type { Metadata } from "next";
import { siteConfig } from "@/constant/site";
import BannerLoader from "@/components/home/BannerLoader";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import ClientOnly from "@/components/common/ClientOnly";
import ProductCarousel from "@/components/home/ProductCarousel";
import TestimonialsLoader from "@/components/home/TestimonialsLoader";
import BlogTeasers from "@/components/home/BlogTeasers";
import PromoStripLoader from "@/components/home/PromoStripLoader";

export const metadata: Metadata = {
  title: siteConfig.default.title,
  description: siteConfig.default.description,
  keywords: siteConfig.default.keywords,
  alternates: { canonical: siteConfig.url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    siteName: siteConfig.name,
    images: [
      { url: siteConfig.logo, alt: `${siteConfig.name} logo`, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [siteConfig.logo],
  },
};

export default function Home() {
  return (
    <div>
      {/* <BannerLoader />
      <PromoStripLoader />
      <ProductCarousel
        title="Bán chạy"
        pageSize={21}
      />
      <ProductCarousel
        title="Ưu đãi hàng đầu"
        pageSize={21}
        sort="rating"
      />
      <ClientOnly>
        <CategoriesGrid
          title="Danh mục nổi bật"
          viewAllText="Xem tất cả"
          mobileLayout="carousel"
          showDescription
        />
      </ClientOnly> */}
      {/* <ValueProps /> */}
      {/* <BrandCarousel /> */}
      {/* Testimonials from CMS (site-content/testimonials). Fallback to ensure >= 4 */}
      {/* <TestimonialsLoader /> */}
      {/* <BlogTeasers /> */}
      {/* <Newsletter /> */}
    </div>
  )
}
