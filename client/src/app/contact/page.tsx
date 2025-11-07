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
    <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6">
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
      <nav aria-label="Breadcrumb" className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          <span className="text-sm font-bold uppercase tracking-wide text-black">Liên hệ</span>
        </div>
      </nav>

      <header className="mb-10 bg-[#fff100] border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider uppercase text-black mb-3">Liên hệ</h1>
        <p className="text-black font-medium text-lg md:text-xl">Thông tin liên hệ và kênh hỗ trợ của {siteConfig.name} 📞</p>
      </header>

      <ContactClient />

      <section className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <svg className="w-6 h-6 text-[#fff100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Bản đồ</h2>
        </div>
        <div className="relative w-full overflow-hidden border-4 border-black">
          <iframe
            title="Bản đồ địa chỉ"
            src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.company.address)}&output=embed`}
            className="w-full h-[350px]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-[#fff100]" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Hỗ trợ</h2>
        </div>
        <p className="text-neutral-800 font-medium mb-4">Xem thêm chính sách và câu hỏi thường gặp:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link href={ROUTES.help} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <HelpCircle className="size-4" aria-hidden /> Trợ giúp
          </Link>
          <Link href={ROUTES.shipping} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <Truck className="size-4" aria-hidden /> Vận chuyển
          </Link>
          <Link href={ROUTES.return} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <RotateCcw className="size-4" aria-hidden /> Đổi trả
          </Link>
          <Link href={ROUTES.privacy} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <Shield className="size-4" aria-hidden /> Bảo mật
          </Link>
          <Link href={ROUTES.terms} className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            <FileText className="size-4" aria-hidden /> Điều khoản
          </Link>
        </div>
      </section>
    </main>
  );
}
