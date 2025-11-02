import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { SHIPPING_PAGE } from "@/constant/pages/shipping";
import { Truck, Globe, Timer, PackageSearch, ArrowRight, Info } from "lucide-react";
import { SectionList } from "@/components/shipping/SectionList";
import { siteConfig } from "@/constant/site";

export const metadata: Metadata = {
  title: SHIPPING_PAGE.metadata.title,
  description: SHIPPING_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/shipping` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/shipping`,
    siteName: siteConfig.name,
    title: SHIPPING_PAGE.metadata.title,
    description: SHIPPING_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: SHIPPING_PAGE.metadata.title,
    description: SHIPPING_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function ShippingPage() {
  return (
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
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
      <Script id="ld-webpage-shipping" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: SHIPPING_PAGE.metadata.title,
          url: `${siteConfig.url}/shipping`,
          description: SHIPPING_PAGE.metadata.description,
        })}
      </Script>
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{SHIPPING_PAGE.title}</h1>
        <p className="mt-2 text-sm text-neutral-600 flex items-center gap-2">
          <Info className="size-4 text-neutral-500" aria-hidden />
          {SHIPPING_PAGE.metadata.description}
        </p>

        <nav aria-label="Mục lục vận chuyển" className="mt-4">
          <ul className="flex flex-wrap items-center gap-2 text-sm">
            <li><Link href="#scope" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 hover:bg-neutral-50"><Globe className="size-4"/> Phạm vi</Link></li>
            <li><Link href="#fee" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 hover:bg-neutral-50"><Truck className="size-4"/> Phí</Link></li>
            <li><Link href="#time" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 hover:bg-neutral-50"><Timer className="size-4"/> Thời gian</Link></li>
            <li><Link href="#tracking" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 hover:bg-neutral-50"><PackageSearch className="size-4"/> Theo dõi</Link></li>
          </ul>
        </nav>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section id="scope" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><Globe className="size-5" aria-hidden/></div>
            <h2 className="text-lg font-semibold">{SHIPPING_PAGE.sections.scope.title}</h2>
          </div>
          <p className="mt-3 text-neutral-700 leading-relaxed">{SHIPPING_PAGE.sections.scope.body}</p>
        </section>

        <section id="tracking" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600"><PackageSearch className="size-5" aria-hidden/></div>
            <h2 className="text-lg font-semibold">{SHIPPING_PAGE.sections.tracking.title}</h2>
          </div>
          <p className="mt-3 text-neutral-700 leading-relaxed">{SHIPPING_PAGE.sections.tracking.body}</p>
        </section>

        <section id="fee" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-700"><Truck className="size-5" aria-hidden/></div>
            <h2 className="text-lg font-semibold">{SHIPPING_PAGE.sections.fee.title}</h2>
          </div>
          <SectionList items={SHIPPING_PAGE.sections.fee.items} bulletClass="bg-amber-500" />
        </section>

        <section id="time" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600"><Timer className="size-5" aria-hidden/></div>
            <h2 className="text-lg font-semibold">{SHIPPING_PAGE.sections.time.title}</h2>
          </div>
          <SectionList items={SHIPPING_PAGE.sections.time.items} bulletClass="bg-indigo-500" />
          <p className="mt-3 text-sm text-neutral-500">{SHIPPING_PAGE.sections.time.note}</p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={ROUTES.products} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white hover:bg-black/90">
          {SHIPPING_PAGE.links.products}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <Link href={ROUTES.return} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-800 hover:bg-neutral-50">
          {SHIPPING_PAGE.links.return}
        </Link>
        <Link href={ROUTES.help} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-800 hover:bg-neutral-50">
          {SHIPPING_PAGE.links.help}
        </Link>
      </div>
    </main>
  );
}