import CartClientFull from "@/components/cart/CartClientFull";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { siteConfig } from "@/constant/site";
const CartRecommendations = dynamic(() => import("@/components/cart/CartRecommendations"));

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mb-10 mt-10">
      <Script id="ld-breadcrumb-cart" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Giỏ hàng", item: `${siteConfig.url}/cart` },
          ],
        })}
      </Script>
      
      <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-cod-gray-900)]">Giỏ hàng</h1>
      <nav className="mt-1 mb-4 text-sm text-neutral-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li>
            <Link href={ROUTES.home} className="hover:underline">Trang chủ</Link>
          </li>
          <li aria-hidden className="text-neutral-400">/</li>
          <li className="text-[var(--color-cod-gray-900)]" aria-current="page">Giỏ hàng</li>
        </ol>
      </nav>
      <CartClientFull />

      <CartRecommendations />
    </div>
  );
}