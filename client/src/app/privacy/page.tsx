import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { siteConfig } from "@/constant/site";
import { PRIVACY_PAGE } from "@/constant/pages/privacy";

export const metadata: Metadata = {
  title: `${PRIVACY_PAGE.title} | ${siteConfig.name}`,
  description: PRIVACY_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    title: `${PRIVACY_PAGE.title} | ${siteConfig.name}`,
    description: PRIVACY_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRIVACY_PAGE.title} | ${siteConfig.name}`,
    description: PRIVACY_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function PrivacyPage() {
  return (
    <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-breadcrumb-privacy" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Quyền riêng tư", item: `${siteConfig.url}/privacy` },
          ],
        })}
      </Script>
      <nav aria-label="Breadcrumb" className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          <span className="text-sm font-bold uppercase tracking-wide text-black">Quyền riêng tư</span>
        </div>
      </nav>

      <header className="mb-10 bg-[#fff100] border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <div className="inline-block px-4 py-1 bg-black text-white border-2 border-black mb-4">
          <span className="text-xs font-bold uppercase tracking-wider">{PRIVACY_PAGE.badge}</span>
        </div>
        <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider uppercase text-black mb-3">{PRIVACY_PAGE.title}</h1>
        <p className="text-black font-medium text-lg">{PRIVACY_PAGE.introPrefix} {siteConfig.name} thu thập, sử dụng và chia sẻ thông tin.</p>
      </header>

      <section className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{PRIVACY_PAGE.sections.collect.title}</h2>
        <ul className="space-y-3">
          {PRIVACY_PAGE.sections.collect.items.map((i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-neutral-300">
              <span className="text-xl shrink-0">•</span>
              <span className="font-medium text-neutral-800">{i}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{PRIVACY_PAGE.sections.purpose.title}</h2>
        <ul className="space-y-3">
          {PRIVACY_PAGE.sections.purpose.items.map((i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-neutral-300">
              <span className="text-xl shrink-0">•</span>
              <span className="font-medium text-neutral-800">{i}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{PRIVACY_PAGE.sections.share.title}</h2>
        <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
          <p className="font-medium text-neutral-800">{PRIVACY_PAGE.sections.share.body}</p>
        </div>
      </section>

      <section className="mb-8 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-4 pb-3 border-b-4 border-black">{PRIVACY_PAGE.sections.rights.title}</h2>
        <ul className="space-y-3">
          {PRIVACY_PAGE.sections.rights.items.map((i) => (
            <li key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-neutral-300">
              <span className="text-xl shrink-0">•</span>
              <span className="font-medium text-neutral-800">{i}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.terms} className="px-6 py-3 bg-white text-black border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">{PRIVACY_PAGE.links.terms}</Link>
        <Link href={ROUTES.help} className="px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase text-sm tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">{PRIVACY_PAGE.links.help} →</Link>
      </div>
    </main>
  );
}