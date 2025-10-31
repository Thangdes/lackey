import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT_PAGE } from "../../constant/pages/about";
import { ROUTES } from "@/constant/route";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Truck, CreditCard, Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: `Về ${siteConfig.name}`,
  description: ABOUT_PAGE.metadata.description,
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

      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6">
        <ol className="flex items-center gap-2 text-sm text-neutral-600">
          <li>
            <Link href={ROUTES.home} className="hover:underline">Trang chủ</Link>
          </li>
          <li className="opacity-60">/</li>
          <li className="text-neutral-900">Giới thiệu</li>
        </ol>
      </nav>
      <section className="relative overflow-hidden">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-plantation-900)]">
                {ABOUT_PAGE.hero.titlePrefix} {siteConfig.name}
              </h1>
              <p className="text-base md:text-lg text-[var(--color-cod-gray-700)]">
                {ABOUT_PAGE.hero.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={ROUTES.products}>
                  <Button className="bg-[var(--color-plantation-800)] hover:bg-[var(--color-plantation-700)] text-white">
                    {ABOUT_PAGE.hero.ctas.viewProducts}
                  </Button>
                </Link>
                <Link href={ROUTES.contact}>
                  <Button variant="secondary">
                    {ABOUT_PAGE.hero.ctas.contact}
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {ABOUT_PAGE.features.map((f: { title: string; body: string }, idx: number) => (
                  <Badge key={idx} variant="secondary" className="rounded-full">
                    {f.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-5 md:gap-6">
          {ABOUT_PAGE.features.map((f: { title: string; body: string }, idx: number) => (
            <div key={idx} className="rounded-xl bg-white border border-[var(--color-athens-gray-200)] p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[var(--color-seagull-600)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-plantation-900)]">{f.title}</h3>
                  <p className="text-[var(--color-cod-gray-700)]">{f.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12 md:pb-16">
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl bg-white border border-[var(--color-athens-gray-200)] p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="text-[var(--color-seagull-600)]" />
              <h3 className="text-lg font-semibold">{ABOUT_PAGE.shipping.title}</h3>
            </div>
            <p className="text-[var(--color-cod-gray-700)]">{ABOUT_PAGE.shipping.freeNote}</p>
            <p className="text-[var(--color-cod-gray-700)]">{ABOUT_PAGE.shipping.feePrefix} {siteConfig.shipping.defaultFee.toLocaleString('vi-VN')}đ</p>
            <Separator className="my-4" />
            <Link href={ROUTES.shipping} className="text-[var(--color-plantation-800)] hover:underline">
              {ABOUT_PAGE.shipping.policyLink}
            </Link>
          </div>

          <div className="rounded-xl bg-white border border-[var(--color-athens-gray-200)] p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="text-[var(--color-seagull-600)]" />
              <h3 className="text-lg font-semibold">{ABOUT_PAGE.payments.title}</h3>
            </div>
            <p className="text-[var(--color-cod-gray-700)]">{ABOUT_PAGE.payments.supportNote}</p>
            <ul className="mt-3 space-y-1 text-sm text-[var(--color-cod-gray-700)]">
              <li><span className="font-medium">{ABOUT_PAGE.payments.labels.bank}</span> {siteConfig.payments.vietqr.bank}</li>
              <li><span className="font-medium">{ABOUT_PAGE.payments.labels.accountName}</span> {siteConfig.payments.vietqr.accountName}</li>
              <li><span className="font-medium">{ABOUT_PAGE.payments.labels.accountNumber}</span> {siteConfig.payments.vietqr.accountNumber}</li>
            </ul>
            <Separator className="my-4" />
            <Link href={ROUTES.return} className="text-[var(--color-plantation-800)] hover:underline">
              {ABOUT_PAGE.payments.returnLink}
            </Link>
          </div>

          <div className="rounded-xl bg-white border border-[var(--color-athens-gray-200)] p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="text-[var(--color-seagull-600)]" />
              <h3 className="text-lg font-semibold">{ABOUT_PAGE.contact.title}</h3>
            </div>
            <ul className="space-y-2 text-[var(--color-cod-gray-700)]">
              <li className="flex items-center gap-2"><Phone className="size-4 opacity-70" /> <span className="font-medium">{ABOUT_PAGE.contact.labels.phone}</span> {siteConfig.contact.telephone}</li>
              <li className="flex items-center gap-2"><Mail className="size-4 opacity-70" /> <span className="font-medium">{ABOUT_PAGE.contact.labels.email}</span> {siteConfig.contact.email}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4 opacity-70" /> <span className="font-medium">{ABOUT_PAGE.contact.labels.address}</span> {siteConfig.company.address}</li>
            </ul>
            <Separator className="my-4" />
            <div className="text-sm text-[var(--color-cod-gray-700)]">
              <span className="font-medium">{ABOUT_PAGE.contact.labels.workingHoursPrefix}</span> 08:30–17:30 (T2–T7)
            </div>
            <div className="mt-4">
              <Link href={ROUTES.help} className="text-[var(--color-plantation-800)] hover:underline">
                {ABOUT_PAGE.contact.faqLink}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}