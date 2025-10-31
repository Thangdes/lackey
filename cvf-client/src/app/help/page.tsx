import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constant/site";
import { HELP_PAGE } from "@/constant/pages/help";

export const metadata: Metadata = {
  title: `${HELP_PAGE.title} | ${siteConfig.name}`,
  description: HELP_PAGE.metadata.description,
  alternates: { canonical: `${siteConfig.url}/help` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/help`,
    siteName: siteConfig.name,
    title: `${HELP_PAGE.title} | ${siteConfig.name}`,
    description: HELP_PAGE.metadata.description,
    images: siteConfig.logo ? [{ url: siteConfig.logo, alt: `${siteConfig.name} Logo` }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: `${HELP_PAGE.title} | ${siteConfig.name}`,
    description: HELP_PAGE.metadata.description,
    images: siteConfig.logo ? [siteConfig.logo] : undefined,
  },
};

export default function HelpPage() {
  return (
    <main className=" px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <Script id="ld-breadcrumb-help" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Trợ giúp", item: `${siteConfig.url}/help` },
          ],
        })}
      </Script>
      <Script id="ld-faq-help" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            ...HELP_PAGE.sections.faq.items.slice(0, 3).map((q: string) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: q },
            }))
          ]
        })}
      </Script>
      <header className="mb-8">
        <span className="inline-flex items-center rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-neutral-700">{HELP_PAGE.badge}</span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">{HELP_PAGE.title}</h1>
        <p className="mt-2 text-neutral-700 max-w-2xl">{HELP_PAGE.introPrefix} {siteConfig.name}.</p>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
          <h2 className="text-xl font-semibold mb-2">{HELP_PAGE.sections.faq.title}</h2>
          <ul className="list-disc pl-6 space-y-2 text-neutral-800">
            <li>{HELP_PAGE.sections.faq.items[0]}</li>
            <li>
              {HELP_PAGE.sections.faq.items[1].replace("Chính sách giao hàng", "")}
              <Link href={ROUTES.shipping} className="text-[#0F5555] hover:underline">{HELP_PAGE.sections.faq.linkTexts.shipping}</Link>.
            </li>
            <li>
              {HELP_PAGE.sections.faq.items[2].replace("chính sách đổi trả", "")}
              <Link href={ROUTES.return} className="text-[#0F5555] hover:underline">{HELP_PAGE.sections.faq.linkTexts.return}</Link>.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-5">
          <h2 className="text-xl font-semibold mb-2">{HELP_PAGE.sections.quickLinks.title}</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link href={ROUTES.shipping}>{HELP_PAGE.sections.quickLinks.links.shipping}</Link></Button>
            <Button asChild variant="outline"><Link href={ROUTES.return}>{HELP_PAGE.sections.quickLinks.links.return}</Link></Button>
            <Button asChild variant="outline"><Link href={ROUTES.terms}>{HELP_PAGE.sections.quickLinks.links.terms}</Link></Button>
            <Button asChild variant="outline"><Link href={ROUTES.privacy}>{HELP_PAGE.sections.quickLinks.links.privacy}</Link></Button>
          </div>
        </section>

        {/* Getting started: Guest vs User */}
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Hướng dẫn sử dụng cho Khách vãng lai và Người dùng</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-black/10 p-4">
              <h3 className="font-semibold">Khách vãng lai</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800 space-y-1">
                <li>Thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng không cần đăng nhập.</li>
                <li>Sau khi đặt, lưu <b>mã đơn hàng</b> để tiện tra cứu ở trang <Link href="/orders/lookup" className="underline hover:text-black">Tra cứu đơn hàng</Link>.</li>
                <li>Nếu bạn tạo tài khoản bằng <b>email đã dùng khi đặt</b>, đơn hàng sẽ được liên kết và hiển thị trong mục <Link href="/orders" className="underline hover:text-black">Đơn hàng của tôi</Link>.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-black/10 p-4">
              <h3 className="font-semibold">Người dùng (đã đăng nhập)</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800 space-y-1">
                <li>Giỏ hàng sẽ được đồng bộ với tài khoản của bạn.</li>
                <li>Xem toàn bộ lịch sử đặt hàng tại <Link href="/orders" className="underline hover:text-black">Đơn hàng của tôi</Link>.</li>
                <li>Nhận cập nhật trạng thái đơn hàng nhanh chóng qua tài khoản.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cart & Checkout */}
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Giỏ hàng và Thanh toán</h2>
          <ul className="mt-2 list-disc pl-6 text-sm text-neutral-800 space-y-1">
            <li>Thêm/Xóa/Tăng giảm số lượng sản phẩm trong giỏ tại trang <Link href="/cart" className="underline hover:text-black">Giỏ hàng</Link>.</li>
            <li>Nhập mã ưu đãi (nếu có) tại phần Tóm tắt đơn hàng.</li>
            <li>Nhấn &quot;Thanh toán&quot; để điền thông tin giao hàng và chọn phương thức thanh toán.</li>
          </ul>
        </section>

        {/* Payment (VietQR) */}
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Thanh toán VietQR</h2>
          <ul className="mt-2 list-disc pl-6 text-sm text-neutral-800 space-y-1">
            <li>Quét mã VietQR hiển thị trong bước thanh toán để chuyển khoản.</li>
            <li>Vui lòng ghi <b>mã đơn hàng</b> ở phần nội dung chuyển khoản để dễ đối soát.</li>
            <li>Thanh toán sẽ được <b>xác nhận thủ công</b> bởi bộ phận hỗ trợ, vì vậy có thể mất thêm thời gian xử lý.</li>
            <li>Sau khi xác nhận thanh toán, trạng thái đơn hàng sẽ được cập nhật và bạn sẽ nhận thông báo.</li>
          </ul>
        </section>

        {/* Orders & Tracking */}
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Xem và tra cứu đơn hàng</h2>
          <ul className="mt-2 list-disc pl-6 text-sm text-neutral-800 space-y-1">
            <li>Đã đăng nhập: truy cập <Link href="/orders" className="underline hover:text-black">Đơn hàng của tôi</Link> để xem toàn bộ lịch sử.</li>
            <li>Khách vãng lai: dùng trang <Link href="/orders/lookup" className="underline hover:text-black">Tra cứu đơn hàng</Link> và nhập mã đơn để xem chi tiết.</li>
          </ul>
        </section>

        {/* Returns & Support */}
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="text-xl font-semibold">Đổi trả & Hỗ trợ</h2>
          <ul className="mt-2 list-disc pl-6 text-sm text-neutral-800 space-y-1">
            <li>Xem <Link href={ROUTES.return} className="underline hover:text-black">Chính sách đổi trả</Link> để biết điều kiện và quy trình.</li>
            <li>Tra cứu phí/điều kiện giao hàng tại <Link href={ROUTES.shipping} className="underline hover:text-black">Chính sách giao hàng</Link>.</li>
            <li>Nếu cần hỗ trợ, vui lòng liên hệ qua trang <Link href="/help" className="underline hover:text-black">Trợ giúp</Link> hoặc thông tin liên hệ trên website.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}