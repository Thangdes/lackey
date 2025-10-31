import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { Button } from "@/components/ui/button";
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
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
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
      <Script id="ld-privacy-policy" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: `${PRIVACY_PAGE.title} | ${siteConfig.name}`,
          url: `${siteConfig.url}/privacy`,
          description: PRIVACY_PAGE.metadata.description,
          publisher: { "@type": "Organization", name: siteConfig.company?.legalName || siteConfig.name, url: siteConfig.url }
        })}
      </Script>
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-neutral-700">{PRIVACY_PAGE.badge}</span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{PRIVACY_PAGE.title}</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">{PRIVACY_PAGE.introPrefix} {siteConfig.name} thu thập, sử dụng và chia sẻ thông tin.</p>
      </header>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{PRIVACY_PAGE.sections.collect.title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {PRIVACY_PAGE.sections.collect.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{PRIVACY_PAGE.sections.purpose.title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {PRIVACY_PAGE.sections.purpose.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{PRIVACY_PAGE.sections.share.title}</h2>
        <p className="text-neutral-800">{PRIVACY_PAGE.sections.share.body}</p>
      </section>

      <section className="mb-8 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{PRIVACY_PAGE.sections.rights.title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {PRIVACY_PAGE.sections.rights.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href={ROUTES.terms}>{PRIVACY_PAGE.links.terms}</Link></Button>
        <Button asChild variant="outline"><Link href={ROUTES.help}>{PRIVACY_PAGE.links.help}</Link></Button>
      </div>
    </main>
  );
}