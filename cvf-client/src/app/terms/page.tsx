import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constant/site";
import { TERMS_PAGE } from "@/constant/pages/terms";

export const metadata: Metadata = {
  title: `${TERMS_PAGE.title} | ${siteConfig.name}`,
  description: TERMS_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/terms` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    title: `${TERMS_PAGE.title} | ${siteConfig.name}`,
    description: TERMS_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${TERMS_PAGE.title} | ${siteConfig.name}`,
    description: TERMS_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function TermsPage() {
  return (
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-breadcrumb-terms" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Điều khoản", item: `${siteConfig.url}/terms` },
          ],
        })}
      </Script>
      <Script id="ld-webpage-terms" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${TERMS_PAGE.title} | ${siteConfig.name}`,
          url: `${siteConfig.url}/terms`,
          description: TERMS_PAGE.metadata.description,
        })}
      </Script>
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-neutral-700">{TERMS_PAGE.badge}</span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{TERMS_PAGE.title}</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">{TERMS_PAGE.metadata.description}</p>
        <p className="mt-1 text-sm text-neutral-600">{TERMS_PAGE.lastUpdatedPrefix} 2025-09-03</p>
      </header>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[0].title}</h2>
        <p className="text-neutral-800">{TERMS_PAGE.sections[0].body}</p>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[1].title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {TERMS_PAGE.sections[1].items?.map((i) => (<li key={i}>{i}</li>))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[2].title}</h2>
        <p className="text-neutral-800">{TERMS_PAGE.sections[2].body}</p>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[3].title}</h2>
        <p className="text-neutral-800">
          Chính sách giao hàng được mô tả tại <Link href={ROUTES.shipping} className="text-[#0F5555] hover:underline">{TERMS_PAGE.sections[3].linkText}</Link>.
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[4].title}</h2>
        <p className="text-neutral-800">
          Vui lòng xem chi tiết <Link href={ROUTES.return} className="text-[#0F5555] hover:underline">{TERMS_PAGE.sections[4].linkText}</Link>.
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{TERMS_PAGE.sections[5].title}</h2>
        <p className="text-neutral-800">{TERMS_PAGE.sections[5].body}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href={ROUTES.privacy}>{TERMS_PAGE.links.privacy}</Link></Button>
        <Button asChild><Link href={ROUTES.products}>{TERMS_PAGE.links.products}</Link></Button>
      </div>
    </main>
  );
}
