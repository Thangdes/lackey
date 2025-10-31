import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constant/site";
import { RETURN_PAGE } from "@/constant/pages/return";

export const metadata: Metadata = {
  title: `${RETURN_PAGE.title} | ${siteConfig.name}`,
  description: RETURN_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/return` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/return`,
    siteName: siteConfig.name,
    title: `${RETURN_PAGE.title} | ${siteConfig.name}`,
    description: RETURN_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${RETURN_PAGE.title} | ${siteConfig.name}`,
    description: RETURN_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function ReturnPage() {
  return (
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-breadcrumb-return" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Đổi trả & hoàn tiền", item: `${siteConfig.url}/return` },
          ],
        })}
      </Script>
      <Script id="ld-merchant-return-policy" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MerchantReturnPolicy",
          name: `${RETURN_PAGE.title} | ${siteConfig.name}`,
          url: `${siteConfig.url}/return`,
          merchantReturnDays: 7,
          returnFees: "https://schema.org/FreeReturn",
          applicableCountry: "VN",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          inStoreReturnsOffered: false
        })}
      </Script>
      <Script id="ld-webpage-return" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${RETURN_PAGE.title} | ${siteConfig.name}`,
          url: `${siteConfig.url}/return`,
          description: RETURN_PAGE.metadata.description,
        })}
      </Script>
      <header className="mb-8">
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{RETURN_PAGE.title}</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">{RETURN_PAGE.introPrefix} {siteConfig.name}.</p>
      </header>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{RETURN_PAGE.sections.time.title}</h2>
        <p className="text-neutral-800">{RETURN_PAGE.sections.time.body}</p>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{RETURN_PAGE.sections.conditions.title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {RETURN_PAGE.sections.conditions.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{RETURN_PAGE.sections.process.title}</h2>
        <ol className="list-decimal pl-6 space-y-2 text-neutral-800">
          {RETURN_PAGE.sections.process.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      </section>

      <section className="mb-8 rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
        <h2 className="text-xl font-semibold mb-2">{RETURN_PAGE.sections.shippingFee.title}</h2>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {RETURN_PAGE.sections.shippingFee.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="text-neutral-600 text-sm">{RETURN_PAGE.sections.shippingFee.note}</p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href={ROUTES.shipping}>{RETURN_PAGE.links.shipping}</Link></Button>
        <Button asChild variant="outline"><Link href={ROUTES.help}>{RETURN_PAGE.links.help}</Link></Button>
        <Button asChild><Link href={ROUTES.products}>{RETURN_PAGE.links.products}</Link></Button>
      </div>
    </main>
  );
}