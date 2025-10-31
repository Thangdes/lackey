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
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
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
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">Liên hệ</h1>
        <p className="text-neutral-700 mt-2 text-lg">Thông tin liên hệ và kênh hỗ trợ của {siteConfig.name}.</p>
      </header>

      <ContactClient />

      <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">Bản đồ</h2>
        <div className="relative w-full overflow-hidden rounded-lg border border-black/10">
          <iframe
            title="Bản đồ địa chỉ"
            src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.company.address)}&output=embed`}
            className="w-full h-[320px]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-6">
        <h2 className="text-xl font-semibold mb-3">Hỗ trợ</h2>
        <p className="text-neutral-800">Xem thêm chính sách và câu hỏi thường gặp:</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <Link href={ROUTES.help} className="inline-flex items-center gap-1.5 text-[#0F5555] hover:underline">
            <HelpCircle className="size-4" aria-hidden /> Trung tâm trợ giúp
          </Link>
          <span className="text-neutral-300">•</span>
          <Link href={ROUTES.shipping} className="inline-flex items-center gap-1.5 text-[#0F5555] hover:underline">
            <Truck className="size-4" aria-hidden /> Chính sách vận chuyển
          </Link>
          <span className="text-neutral-300">•</span>
          <Link href={ROUTES.return} className="inline-flex items-center gap-1.5 text-[#0F5555] hover:underline">
            <RotateCcw className="size-4" aria-hidden /> Đổi trả & hoàn tiền
          </Link>
          <span className="text-neutral-300">•</span>
          <Link href={ROUTES.privacy} className="inline-flex items-center gap-1.5 text-[#0F5555] hover:underline">
            <Shield className="size-4" aria-hidden /> Quyền riêng tư
          </Link>
          <span className="text-neutral-300">•</span>
          <Link href={ROUTES.terms} className="inline-flex items-center gap-1.5 text-[#0F5555] hover:underline">
            <FileText className="size-4" aria-hidden /> Điều khoản
          </Link>
        </div>
      </section>
    </main>
  );
}
