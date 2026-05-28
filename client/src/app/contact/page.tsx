import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { ROUTES } from "@/constant/route";
import { HelpCircle, Truck, RotateCcw, Shield, FileText } from "lucide-react";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: `Liên hệ | ${siteConfig.name}`,
  description: `Thông tin liên hệ và kênh hỗ trợ của ${siteConfig.name}.` ,
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/contact`,
    title: `Liên hệ | ${siteConfig.name}`,
    description: `Thông tin liên hệ và kênh hỗ trợ của ${siteConfig.name}.`,
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: `Liên hệ | ${siteConfig.name}`,
    description: `Thông tin liên hệ và kênh hỗ trợ của ${siteConfig.name}.`,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-[60vh] bg-white">
      <Script id="ld-breadcrumb-contact" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Liên hệ", item: `${siteConfig.url}/contact` },
          ],
        })}
      </Script>
      <Script id="ld-organization" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.company?.legalName || siteConfig.name,
          url: siteConfig.url,
          logo: siteConfig.logo,
          sameAs: siteConfig.sameAs,
          contactPoint: [{
            "@type": "ContactPoint",
            telephone: siteConfig.contact.telephoneE164,
            contactType: "customer service",
            areaServed: siteConfig.shipping?.regions,
            availableLanguage: ["vi", "en"],
          }],
          email: siteConfig.contact.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: siteConfig.company.address,
            addressLocality: "",
            addressRegion: "",
            addressCountry: "VN",
          },
        })}
      </Script>
      <Script id="ld-contactpage" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.company?.legalName || siteConfig.name,
            url: siteConfig.url,
          },
          url: `${siteConfig.url}/contact`,
          description: `Trang liên hệ và hỗ trợ của ${siteConfig.name}`,
        })}
      </Script>

      {}
      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 text-sm">
          <Link href={ROUTES.home} className="text-neutral-600 hover:text-black transition-colors">Trang chủ</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-black font-medium">Liên hệ</span>
        </div>
      </nav>

      {}
      <header className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider uppercase text-black">
            Liên hệ
          </h1>
          <p className="text-lg md:text-xl text-neutral-700">
            Thông tin liên hệ và kênh hỗ trợ của {siteConfig.name}
          </p>
        </div>
      </header>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <ContactClient />
        </div>
      </section>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 bg-neutral-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-neutral-200">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-black">Bản đồ</h2>
          </div>
          <div className="relative w-full overflow-hidden border-2 border-neutral-200">
            <iframe
              title="Bản đồ địa chỉ"
              src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.company.address)}&output=embed`}
              className="w-full h-[350px] md:h-[450px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {}
      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-neutral-200">
            <HelpCircle className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black">Hỗ trợ</h2>
          </div>
          <p className="text-neutral-600 text-sm">Xem thêm chính sách và câu hỏi thường gặp:</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Link href={ROUTES.help} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
              <HelpCircle className="size-4" aria-hidden /> Trợ giúp
            </Link>
            <Link href={ROUTES.shipping} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
              <Truck className="size-4" aria-hidden /> Vận chuyển
            </Link>
            <Link href={ROUTES.return} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
              <RotateCcw className="size-4" aria-hidden /> Đổi trả
            </Link>
            <Link href={ROUTES.privacy} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
              <Shield className="size-4" aria-hidden /> Bảo mật
            </Link>
            <Link href={ROUTES.terms} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
              <FileText className="size-4" aria-hidden /> Điều khoản
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
