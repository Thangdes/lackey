import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_PAGE } from "../../constant/pages/about";
import { ROUTES } from "@/constant/route";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { CheckCircle2, Truck, CreditCard, Phone, Mail, MapPin } from "lucide-react";

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
    <main className="min-h-[60vh]">
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

      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 mb-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          <span className="text-sm font-bold uppercase tracking-wide text-black">Giới thiệu</span>
        </div>
      </nav>
      <section className="relative overflow-hidden bg-[#fff100] border-y-4 border-black">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider uppercase text-black">
              {ABOUT_PAGE.hero.titlePrefix} {siteConfig.name}
            </h1>
            <div className="inline-block bg-white border-4 border-black px-6 py-4 shadow-[8px_8px_0px_0px_#B5CCBC]">
              <p className="text-base md:text-lg font-medium text-black">
                {ABOUT_PAGE.hero.intro}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href={ROUTES.products}>
                <button className="px-8 py-3 bg-black text-white border-2 border-black font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                  {ABOUT_PAGE.hero.ctas.viewProducts}
                </button>
              </Link>
              <Link href={ROUTES.contact}>
                <button className="px-8 py-3 bg-white text-black border-2 border-black font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                  {ABOUT_PAGE.hero.ctas.contact}
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {ABOUT_PAGE.features.map((f: { title: string; body: string }, idx: number) => (
                <span key={idx} className="px-4 py-2 bg-black text-white border-2 border-black text-xs font-bold uppercase tracking-wide">
                  {f.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl font-bold tracking-wider uppercase text-center mb-10 md:mb-12">Tại sao chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ABOUT_PAGE.features.map((f: { title: string; body: string }, idx: number) => (
            <div key={idx} className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#B5CCBC] hover:shadow-[12px_12px_0px_0px_#B5CCBC] hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
                  <CheckCircle2 className="text-[#fff100] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-black mb-2">{f.title}</h3>
                  <p className="text-neutral-700 font-medium leading-relaxed">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Truck className="text-[#fff100] w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide">{ABOUT_PAGE.shipping.title}</h3>
            </div>
            <p className="text-neutral-700 font-medium mb-2">{ABOUT_PAGE.shipping.freeNote}</p>
            <p className="text-neutral-700 font-medium mb-4">{ABOUT_PAGE.shipping.feePrefix} <span className="font-bold text-black">{siteConfig.shipping.defaultFee.toLocaleString('vi-VN')}đ</span></p>
            <Link href={ROUTES.shipping} className="inline-block px-4 py-2 bg-black text-white border-2 border-black text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
              {ABOUT_PAGE.shipping.policyLink} →
            </Link>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <CreditCard className="text-[#fff100] w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide">{ABOUT_PAGE.payments.title}</h3>
            </div>
            <p className="text-neutral-700 font-medium mb-3">{ABOUT_PAGE.payments.supportNote}</p>
            <div className="space-y-2 mb-4 p-3 bg-neutral-50 border-2 border-neutral-300">
              <div className="text-xs"><span className="font-bold uppercase text-black">{ABOUT_PAGE.payments.labels.bank}</span> {siteConfig.payments.vietqr.bank}</div>
              <div className="text-xs"><span className="font-bold uppercase text-black">{ABOUT_PAGE.payments.labels.accountName}</span> {siteConfig.payments.vietqr.accountName}</div>
              <div className="text-xs"><span className="font-bold uppercase text-black">{ABOUT_PAGE.payments.labels.accountNumber}</span> {siteConfig.payments.vietqr.accountNumber}</div>
            </div>
            <Link href={ROUTES.return} className="inline-block px-4 py-2 bg-black text-white border-2 border-black text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
              {ABOUT_PAGE.payments.returnLink} →
            </Link>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b-4 border-black">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Phone className="text-[#fff100] w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wide">{ABOUT_PAGE.contact.title}</h3>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm"><Phone className="w-4 h-4 mt-0.5 shrink-0" /> <div><span className="font-bold text-black">{ABOUT_PAGE.contact.labels.phone}</span> {siteConfig.contact.telephone}</div></div>
              <div className="flex items-start gap-2 text-sm"><Mail className="w-4 h-4 mt-0.5 shrink-0" /> <div><span className="font-bold text-black">{ABOUT_PAGE.contact.labels.email}</span> {siteConfig.contact.email}</div></div>
              <div className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> <div><span className="font-bold text-black">{ABOUT_PAGE.contact.labels.address}</span> {siteConfig.company.address}</div></div>
            </div>
            <div className="px-3 py-2 bg-[#fff100] border-2 border-black text-xs font-bold mb-4">
              <span className="uppercase">{ABOUT_PAGE.contact.labels.workingHoursPrefix}</span> 08:30–17:30 (T2–T7)
            </div>
            <Link href={ROUTES.help} className="inline-block px-4 py-2 bg-black text-white border-2 border-black text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors">
              {ABOUT_PAGE.contact.faqLink} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}