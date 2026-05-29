import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import CustomKeyboardClient from "@/components/custom-keyboard/CustomKeyboardClient";

export const metadata: Metadata = {
  title: `Tự Thiết Kế Bàn Phím Cơ Custom | ${siteConfig.name}`,
  description: "Trực quan hóa thiết kế và trải nghiệm âm thanh gõ bàn phím cơ custom của bạn. Tùy chỉnh layout 60%, 65%, 75%, TKL, chất liệu vỏ phím nhôm/acrylic, loại switch và phối màu keycaps.",
  alternates: {
    canonical: `${siteConfig.url}/custom-keyboard`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/custom-keyboard`,
    title: `Tự Thiết Kế Bàn Phím Cơ Custom | ${siteConfig.name}`,
    description: "Trực quan hóa thiết kế và trải nghiệm âm thanh gõ bàn phím cơ custom của bạn. Tùy chỉnh layout, màu vỏ phím, switch và keycap.",
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export default function CustomKeyboardPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Schema */}
      <Script id="ld-breadcrumb-custom-keyboard" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Tự Thiết Kế Bàn Phím", item: `${siteConfig.url}/custom-keyboard` },
          ],
        })}
      </Script>



      {/* Configurator App client */}
      <CustomKeyboardClient />
    </main>
  );
}
