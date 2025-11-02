import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { FeaturesSection } from "@/components/custom-keychain/FeaturesSection";
import { PageBreadcrumb } from "@/components/custom-keychain/PageBreadcrumb";
import { HeroSection } from "@/components/custom-keychain/HeroSection";
import { ProcessSteps } from "@/components/custom-keychain/ProcessSteps";
import { PricingPackages } from "@/components/custom-keychain/PricingPackages";
import { GallerySection } from "@/components/custom-keychain/GallerySection";
import { CTASection } from "@/components/custom-keychain/CTASection";


export const metadata: Metadata = {
  title: `Custom Móc Khóa Theo Yêu Cầu | ${siteConfig.name}`,
  description: "Thiết kế và đặt làm móc khóa acrylic custom theo ý tưởng của bạn. Từ 1 chiếc đã nhận đơn. In offset chất lượng cao, giao hàng nhanh 3-5 ngày.",
  alternates: {
    canonical: `${siteConfig.url}/custom-keychain`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/custom-keychain`,
    title: `Custom Móc Khóa Theo Yêu Cầu | ${siteConfig.name}`,
    description: "Thiết kế và đặt làm móc khóa acrylic custom theo ý tưởng của bạn. Từ 1 chiếc đã nhận đơn.",
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export default function CustomKeychainPage() {
  return (
    <main className="min-h-screen bg-white">
      <Script id="ld-breadcrumb-custom" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Custom Keychain", item: `${siteConfig.url}/custom-keychain` },
          ],
        })}
      </Script>

      <PageBreadcrumb />
      <HeroSection />
      <ProcessSteps />
      <PricingPackages /> 
      <GallerySection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
