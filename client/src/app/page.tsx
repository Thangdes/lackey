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
// import CustomKeychainCTA from "@/components/home/CustomKeychainCTA";
import { 
  KEYCAP_BRANDS, 
  SWITCH_BRANDS, 
  KIT_BRANDS, 
  ACCESSORY_BRANDS,
  KEYCAPS,
  SWITCHES,
  KITS,
  ACCESSORIES
} from "@/data/featuredProducts";

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

export default function Home() {
  return (
    <div>
      <BannerLoader />
      <PromoStripLoader />

      <FeaturedProducts />

      <ProductSection 
        title="Keycap bán chạy"
        brands={KEYCAP_BRANDS}
        products={KEYCAPS}
      />

      <ProductSection 
        title="Switch bán chạy"
        brands={SWITCH_BRANDS}
        products={SWITCHES}
      />

      <ProductSection 
        title="Kit & Combo bán chạy"
        brands={KIT_BRANDS}
        products={KITS}
      />

      <ProductSection 
        title="Phụ kiện setup"
        brands={ACCESSORY_BRANDS}
        products={ACCESSORIES}
      />

      {/* <CustomKeychainCTA /> */}

      <MarqueeBanner />

      <TopCollections />
      
      <RetroSaleBanner />

      {/* Testimonials section - temporarily hidden */}
      {/* <ClientOnly>
        <TestimonialsLoader />
      </ClientOnly> */}

      <CategoryIcons />

      <TechNews />

    </div>
  )
}
