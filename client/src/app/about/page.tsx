import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_PAGE } from "../../constant/pages/about";
import { ROUTES } from "@/constant/route";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { CheckCircle2, Truck, Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: `Về ${siteConfig.name}`,
  description: ABOUT_PAGE.metadata.description,
  keywords: [...siteConfig.default.keywords, "giới thiệu", "về chúng tôi", "LắcKey"],
  alternates: { canonical: `${siteConfig.url}${ROUTES.about}` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}${ROUTES.about}`,
    title: `Về ${siteConfig.name}`,
    description: ABOUT_PAGE.metadata.description,
    siteName: siteConfig.name,
    locale: "vi_VN",
    images: [{ url: siteConfig.logo, alt: siteConfig.name, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Về ${siteConfig.name}`,
    description: ABOUT_PAGE.metadata.description,
    images: [{ url: siteConfig.logo, alt: siteConfig.name }],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-[60vh] bg-white">
      <Script id="ld-breadcrumb-about" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Giới thiệu", item: `${siteConfig.url}${ROUTES.about}` },
          ],
        })}
      </Script>
      <Script id="ld-webpage-about" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Giới thiệu",
          url: `${siteConfig.url}${ROUTES.about}`,
          description: ABOUT_PAGE.metadata.description,
        })}
      </Script>

      {}
      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 text-sm">
          <Link href={ROUTES.home} className="text-neutral-600 hover:text-black transition-colors">Trang chủ</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-black font-medium">Giới thiệu</span>
        </div>
      </nav>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider uppercase text-black">
            {ABOUT_PAGE.hero.titlePrefix} {siteConfig.name}
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 leading-relaxed max-w-2xl mx-auto">
            {ABOUT_PAGE.hero.intro}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Link href={ROUTES.products} className="px-8 py-3 bg-black text-white font-medium hover:bg-neutral-800 transition-colors">
              {ABOUT_PAGE.hero.ctas.viewProducts}
            </Link>
            <Link href={ROUTES.contact} className="px-8 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors">
              {ABOUT_PAGE.hero.ctas.contact}
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-black">Tại sao chọn chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {ABOUT_PAGE.features.map((f: { title: string; body: string }, idx: number) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="shrink-0 w-12 h-12 bg-black flex items-center justify-center group-hover:bg-neutral-800 transition-colors">
                  <CheckCircle2 className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black mb-2">{f.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-neutral-200">
              <Truck className="w-6 h-6 text-black" />
              <h3 className="text-lg font-bold text-black">{ABOUT_PAGE.shipping.title}</h3>
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed">{ABOUT_PAGE.shipping.freeNote}</p>
            <p className="text-neutral-600 text-sm">
              {ABOUT_PAGE.shipping.feePrefix} <span className="font-bold text-black">{siteConfig.shipping.defaultFee.toLocaleString('vi-VN')}đ</span>
            </p>
            <Link href={ROUTES.shipping} className="inline-flex items-center text-sm font-medium text-black hover:text-neutral-600 transition-colors group">
              {ABOUT_PAGE.shipping.policyLink}
              <span className="ml-1 group-hover:ml-2 transition-all">→</span>
            </Link>
          </div>

          {}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-neutral-200">
              <Phone className="w-6 h-6 text-black" />
              <h3 className="text-lg font-bold text-black">{ABOUT_PAGE.contact.title}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-neutral-600">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <div><span className="font-semibold text-black">{ABOUT_PAGE.contact.labels.phone}:</span> {siteConfig.contact.telephone}</div>
              </div>
              <div className="flex items-start gap-2 text-sm text-neutral-600">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <div><span className="font-semibold text-black">{ABOUT_PAGE.contact.labels.email}:</span> {siteConfig.contact.email}</div>
              </div>
              <div className="flex items-start gap-2 text-sm text-neutral-600">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div><span className="font-semibold text-black">{ABOUT_PAGE.contact.labels.address}:</span> {siteConfig.company.address}</div>
              </div>
            </div>
            <div className="text-xs text-neutral-600 pt-2">
              <span className="font-semibold text-black">{ABOUT_PAGE.contact.labels.workingHoursPrefix}:</span> 08:30–17:30 (T2–T7)
            </div>
            <Link href={ROUTES.help} className="inline-flex items-center text-sm font-medium text-black hover:text-neutral-600 transition-colors group">
              {ABOUT_PAGE.contact.faqLink}
              <span className="ml-1 group-hover:ml-2 transition-all">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}