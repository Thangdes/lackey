import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { SHIPPING_PAGE } from "@/constant/pages/shipping";
import { siteConfig } from "@/constant/site";

export const metadata: Metadata = {
  title: `${SHIPPING_PAGE.title} | ${siteConfig.name}`,
  description: SHIPPING_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/shipping` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/shipping`,
    siteName: siteConfig.name,
    title: `${SHIPPING_PAGE.title} | ${siteConfig.name}`,
    description: SHIPPING_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SHIPPING_PAGE.title} | ${siteConfig.name}`,
    description: SHIPPING_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function ShippingPage() {
  return (
    <main className="min-h-[60vh] bg-white">
      <Script id="ld-breadcrumb-shipping" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Vận chuyển", item: `${siteConfig.url}/shipping` },
          ],
        })}
      </Script>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 text-sm">
          <Link href={ROUTES.home} className="text-neutral-600 hover:text-black transition-colors">Trang chủ</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-black font-medium">Vận chuyển</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider uppercase text-black">
            {SHIPPING_PAGE.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-700">{SHIPPING_PAGE.metadata.description}</p>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <section id="scope">
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{SHIPPING_PAGE.sections.scope.title}</h2>
            <p className="text-neutral-700">{SHIPPING_PAGE.sections.scope.body}</p>
          </section>

          <section id="tracking">
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{SHIPPING_PAGE.sections.tracking.title}</h2>
            <p className="text-neutral-700">{SHIPPING_PAGE.sections.tracking.body}</p>
          </section>

          <section id="fee">
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{SHIPPING_PAGE.sections.fee.title}</h2>
            <ul className="space-y-3">
              {SHIPPING_PAGE.sections.fee.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-700">
                  <span className="text-black font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="time">
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{SHIPPING_PAGE.sections.time.title}</h2>
            <ul className="space-y-3 mb-4">
              {SHIPPING_PAGE.sections.time.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-neutral-700">
                  <span className="text-black font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {SHIPPING_PAGE.sections.time.note && (
              <div className="p-4 bg-neutral-50 border-l-4 border-black">
                <p className="text-sm text-neutral-600">ℹ️ {SHIPPING_PAGE.sections.time.note}</p>
              </div>
            )}
          </section>

          <div className="flex flex-wrap gap-3 pt-6">
            <Link href={ROUTES.return} className="px-6 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors">{SHIPPING_PAGE.links.return}</Link>
            <Link href={ROUTES.help} className="px-6 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors">{SHIPPING_PAGE.links.help}</Link>
            <Link href={ROUTES.products} className="px-6 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors">{SHIPPING_PAGE.links.products} →</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
