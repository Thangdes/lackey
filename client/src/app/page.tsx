import type { Metadata } from "next";
import { siteConfig } from "@/constant/site";
import BannerLoader from "@/components/home/BannerLoader";
import PromoStripLoader from "@/components/home/PromoStripLoader";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ProductSection from "@/components/home/ProductSection";
import TopCollections from "@/components/home/TopCollections";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import RetroSaleBanner from "@/components/home/RetroSaleBanner";
import CategoryIcons from "@/components/home/CategoryIcons";
import TechNews from "@/components/home/TechNews";
import { fetchHomeProducts } from "@/lib/home-data";
import { ROUTES } from "@/constant/route";

export const metadata: Metadata = {
  title: siteConfig.default.title,
  description: siteConfig.default.description,
  keywords: siteConfig.default.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: siteConfig.url },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    siteName: siteConfig.name,
    locale: "vi_VN",
    images: [
      { url: siteConfig.logo, alt: siteConfig.name, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.name,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{ url: siteConfig.logo, alt: siteConfig.name }],
  },
};

export default async function Home() {
  const { bestSellers, keycaps, switches, kits, accessories, categories } =
    await fetchHomeProducts();

  const keycapCategory = categories.find((c) => c.slug === "keycap");
  const switchCategory = categories.find((c) => c.slug === "switch");
  const kitCategory = categories.find((c) => c.slug === "bo-kit-tu-lap");
  const accessoryCategory = categories.find((c) => c.slug === "lube-phu-kien");

  return (
    <div>
      <BannerLoader />
      <PromoStripLoader />

      <FeaturedProducts products={bestSellers} categories={categories} />

      <ProductSection
        title="Keycap bán chạy"
        products={keycaps}
        viewAllHref={
          keycapCategory
            ? `${ROUTES.products}?categorySlugs=keycap`
            : ROUTES.products
        }
      />

      <ProductSection
        title="Switch bán chạy"
        products={switches}
        viewAllHref={
          switchCategory
            ? `${ROUTES.products}?categorySlugs=switch`
            : ROUTES.products
        }
      />

      <ProductSection
        title="Bộ Kit tự lắp"
        products={kits}
        viewAllHref={
          kitCategory
            ? `${ROUTES.products}?categorySlugs=bo-kit-tu-lap`
            : ROUTES.products
        }
      />

      <ProductSection
        title="Phụ kiện & Lube"
        products={accessories}
        viewAllHref={
          accessoryCategory
            ? `${ROUTES.products}?categorySlugs=lube-phu-kien`
            : ROUTES.products
        }
      />

      <MarqueeBanner />

      <TopCollections />

      <RetroSaleBanner />

      <CategoryIcons />

      <TechNews />
    </div>
  );
}
