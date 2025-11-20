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
    <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6">
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
      <nav aria-label="Breadcrumb" className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          <span className="text-sm font-bold uppercase tracking-wide text-black">Vận chuyển</span>
        </div>
      </nav>

      <header className="mb-10 bg-[#fff100] border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider uppercase text-black mb-3">{SHIPPING_PAGE.title}</h1>
        <p className="text-black font-medium text-lg">{SHIPPING_PAGE.metadata.description}</p>
      </header>

      <section id="scope" className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{SHIPPING_PAGE.sections.scope.title}</h2>
        <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
          <p className="font-medium text-neutral-800">{SHIPPING_PAGE.sections.scope.body}</p>
        </div>
      </section>

      <section id="tracking" className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{SHIPPING_PAGE.sections.tracking.title}</h2>
        <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
          <p className="font-medium text-neutral-800">{SHIPPING_PAGE.sections.tracking.body}</p>
        </div>
      </section>

      <section id="fee" className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{SHIPPING_PAGE.sections.fee.title}</h2>
        <ul className="space-y-3">
          {SHIPPING_PAGE.sections.fee.items.map((item) => (
            <li key={item} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-neutral-300">
              <span className="text-xl shrink-0">•</span>
              <span className="font-medium text-neutral-800">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="time" className="mb-8 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{SHIPPING_PAGE.sections.time.title}</h2>
        <ul className="space-y-3 mb-4">
          {SHIPPING_PAGE.sections.time.items.map((item) => (
            <li key={item} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-neutral-300">
              <span className="text-xl shrink-0">•</span>
              <span className="font-medium text-neutral-800">{item}</span>
            </li>
          ))}
        </ul>
        {SHIPPING_PAGE.sections.time.note && (
          <div className="p-3 bg-neutral-100 border-2 border-neutral-400">
            <p className="text-sm font-medium text-neutral-700">ℹ️ {SHIPPING_PAGE.sections.time.note}</p>
          </div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.return} className="px-6 py-3 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">{SHIPPING_PAGE.links.return}</Link>
        <Link href={ROUTES.help} className="px-6 py-3 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">{SHIPPING_PAGE.links.help}</Link>
        <Link href={ROUTES.products} className="px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">{SHIPPING_PAGE.links.products} →</Link>
      </div>
    </main>
  );
}