import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ROUTES } from "@/constant/route";
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
    <main className="min-h-[60vh] bg-white">
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

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 pb-4">
        <div className="inline-flex items-center gap-2 text-sm">
          <Link href={ROUTES.home} className="text-neutral-600 hover:text-black transition-colors">Trang chủ</Link>
          <span className="text-neutral-400">/</span>
          <span className="text-black font-medium">Trợ giúp</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="font-[family-name:var(--font-retro)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider uppercase text-black">
            {HELP_PAGE.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-700">
            {HELP_PAGE.introPrefix} {siteConfig.name}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{HELP_PAGE.sections.faq.title}</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-700">
                <span className="text-black font-bold shrink-0">•</span>
                <span>{HELP_PAGE.sections.faq.items[0]}</span>
              </li>
              <li className="flex items-start gap-3 text-neutral-700">
                <span className="text-black font-bold shrink-0">•</span>
                <span>
                  {HELP_PAGE.sections.faq.items[1].replace("Chính sách giao hàng", "")}
                  <Link href={ROUTES.shipping} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">{HELP_PAGE.sections.faq.linkTexts.shipping}</Link>.
                </span>
              </li>
              <li className="flex items-start gap-3 text-neutral-700">
                <span className="text-black font-bold shrink-0">•</span>
                <span>
                  {HELP_PAGE.sections.faq.items[2].replace("chính sách đổi trả", "")}
                  <Link href={ROUTES.return} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">{HELP_PAGE.sections.faq.linkTexts.return}</Link>.
                </span>
              </li>
            </ul>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">{HELP_PAGE.sections.quickLinks.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link href={ROUTES.shipping} className="px-4 py-3 bg-black text-white text-xs font-medium text-center hover:bg-neutral-800 transition-colors">{HELP_PAGE.sections.quickLinks.links.shipping}</Link>
              <Link href={ROUTES.return} className="px-4 py-3 bg-black text-white text-xs font-medium text-center hover:bg-neutral-800 transition-colors">{HELP_PAGE.sections.quickLinks.links.return}</Link>
              <Link href={ROUTES.terms} className="px-4 py-3 bg-black text-white text-xs font-medium text-center hover:bg-neutral-800 transition-colors">{HELP_PAGE.sections.quickLinks.links.terms}</Link>
              <Link href={ROUTES.privacy} className="px-4 py-3 bg-black text-white text-xs font-medium text-center hover:bg-neutral-800 transition-colors">{HELP_PAGE.sections.quickLinks.links.privacy}</Link>
            </div>
          </section>

          {/* User Guide */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">Hướng dẫn sử dụng</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black pb-2 border-b border-neutral-200">Khách vãng lai</h3>
                <ul className="space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">1</span>
                    <span>Thêm sản phẩm vào giỏ hàng và tiến hành đặt hàng không cần đăng nhập.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">2</span>
                    <span>Sau khi đặt, lưu <b>mã đơn hàng</b> để tiện tra cứu ở trang <Link href="/orders/lookup" className="underline font-semibold hover:text-black transition-colors">Tra cứu đơn hàng</Link>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">3</span>
                    <span>Nếu bạn tạo tài khoản bằng <b>email đã dùng khi đặt</b>, đơn hàng sẽ được liên kết và hiển thị trong mục <Link href="/orders" className="underline font-semibold hover:text-black transition-colors">Đơn hàng của tôi</Link>.</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-black pb-2 border-b border-neutral-200">Người dùng đã đăng nhập</h3>
                <ul className="space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">1</span>
                    <span>Giỏ hàng sẽ được đồng bộ với tài khoản của bạn.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">2</span>
                    <span>Xem toàn bộ lịch sử đặt hàng tại <Link href="/orders" className="underline font-semibold hover:text-black transition-colors">Đơn hàng của tôi</Link>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-xs font-bold shrink-0">3</span>
                    <span>Nhận cập nhật trạng thái đơn hàng nhanh chóng qua tài khoản.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cart & Payment */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">Giỏ hàng và Thanh toán</h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Thêm/Xóa/Tăng giảm số lượng sản phẩm trong giỏ tại trang <Link href="/cart" className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Giỏ hàng</Link>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Nhập mã ưu đãi (nếu có) tại phần Tóm tắt đơn hàng.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Nhấn &quot;Thanh toán&quot; để điền thông tin giao hàng và chọn phương thức thanh toán.</span>
              </li>
            </ul>
          </section>

          {/* VietQR */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">Thanh toán VietQR</h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Quét mã VietQR hiển thị trong bước thanh toán để chuyển khoản.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Vui lòng ghi <b>mã đơn hàng</b> ở phần nội dung chuyển khoản để dễ đối soát.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Thanh toán sẽ được <b>xác nhận thủ công</b> bởi bộ phận hỗ trợ, vì vậy có thể mất thêm thời gian xử lý.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Sau khi xác nhận thanh toán, trạng thái đơn hàng sẽ được cập nhật và bạn sẽ nhận thông báo.</span>
              </li>
            </ul>
          </section>

          {/* Order Lookup */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">Xem và tra cứu đơn hàng</h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Đã đăng nhập: truy cập <Link href="/orders" className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Đơn hàng của tôi</Link> để xem toàn bộ lịch sử.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Khách vãng lai: dùng trang <Link href="/orders/lookup" className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Tra cứu đơn hàng</Link> và nhập mã đơn để xem chi tiết.</span>
              </li>
            </ul>
          </section>

          {/* Support */}
          <section>
            <h2 className="text-2xl font-bold text-black mb-6 pb-4 border-b-2 border-neutral-200">Đổi trả & Hỗ trợ</h2>
            <ul className="space-y-3 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Xem <Link href={ROUTES.return} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Chính sách đổi trả</Link> để biết điều kiện và quy trình.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Tra cứu phí/điều kiện giao hàng tại <Link href={ROUTES.shipping} className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Chính sách giao hàng</Link>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-black font-bold shrink-0">•</span>
                <span>Nếu cần hỗ trợ, vui lòng liên hệ qua trang <Link href="/contact" className="font-semibold text-black underline hover:text-neutral-600 transition-colors">Liên hệ</Link> hoặc thông tin liên hệ trên website.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
