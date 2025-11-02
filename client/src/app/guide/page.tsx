import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { GUIDE_PAGE } from "@/constant/pages/guide";
import { siteConfig } from "@/constant/site";

export const metadata: Metadata = {
  title: GUIDE_PAGE.title,
  description: GUIDE_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}${ROUTES.guide}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}${ROUTES.guide}`,
    siteName: siteConfig.name,
    title: GUIDE_PAGE.title,
    description: GUIDE_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: GUIDE_PAGE.title,
    description: GUIDE_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function GuidePage() {
  return (
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-breadcrumb-guide" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Hướng dẫn mua hàng", item: `${siteConfig.url}${ROUTES.guide}` },
          ],
        })}
      </Script>
      <Script id="ld-webpage-guide" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: GUIDE_PAGE.title,
          url: `${siteConfig.url}${ROUTES.guide}`,
          description: GUIDE_PAGE.metadata.description,
        })}
      </Script>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs text-neutral-700">
          {GUIDE_PAGE.badge}
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">{GUIDE_PAGE.title}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {GUIDE_PAGE.introPrefix} {siteConfig.name}.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{GUIDE_PAGE.sections.steps.title}</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-neutral-700">
            {GUIDE_PAGE.sections.steps.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">{GUIDE_PAGE.sections.tips.title}</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-neutral-700">
            {GUIDE_PAGE.sections.tips.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold">{GUIDE_PAGE.sections.support.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href={ROUTES.shipping} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-50">
              {GUIDE_PAGE.sections.support.links.shipping}
            </Link>
            <Link href={ROUTES.return} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-50">
              {GUIDE_PAGE.sections.support.links.return}
            </Link>
            <Link href={ROUTES.help} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-50">
              {GUIDE_PAGE.sections.support.links.help}
            </Link>
            <Link href={ROUTES.contact} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-50">
              {GUIDE_PAGE.sections.support.links.contact}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
