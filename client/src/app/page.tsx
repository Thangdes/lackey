import type { Metadata } from "next";
import { siteConfig } from "@/constant/site";
import BannerLoader from "@/components/home/BannerLoader";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import ClientOnly from "@/components/common/ClientOnly";
import TestimonialsLoader from "@/components/home/TestimonialsLoader";
import PromoStripLoader from "@/components/home/PromoStripLoader";
import BestSellers from "@/components/home/BestSellers";
import TopCollections from "@/components/home/TopCollections";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import RetroSaleBanner from "@/components/home/RetroSaleBanner";
import RetroValueProps from "@/components/home/RetroValueProps";
import CustomKeychainCTA from "@/components/home/CustomKeychainCTA";
import RetroFAQ from "@/components/home/RetroFAQ";

export const metadata: Metadata = {
  title: siteConfig.default.title,
  description: siteConfig.default.description,
  keywords: siteConfig.default.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: siteConfig.url },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    siteName: siteConfig.name,
    locale: "vi_VN",
    images: [
      { url: siteConfig.logo, alt: siteConfig.name, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.name,
    title: siteConfig.default.title,
    description: siteConfig.default.description,
    images: [{ url: siteConfig.logo, alt: siteConfig.name }],
  },
};

export default function Home() {
  return (
    <div>
      <BannerLoader />
      <PromoStripLoader />

      <RetroValueProps
        title="VÌ SAO CHỌN LẮC KEY?"
        subtitle="Móc khóa chất lượng cao - Thiết kế độc đáo - Giao hàng nhanh"
        items={[
          {
            icon: "🎨",
            title: "CUSTOM THEO Ý TƯỞNG",
            description: "Thiết kế móc khóa theo hình ảnh, nhân vật yêu thích của bạn. In sắc nét, chất liệu cao cấp.",
            ctaHref: "/custom-keychain",
            ctaLabel: "Đặt custom ngay",
          },
          {
            icon: "🎁",
            title: "GIAO HÀNG SIÊU TỐC",
            description: "Giao hàng toàn quốc 1-3 ngày. Đóng gói cẩn thận, an toàn tuyệt đối.",
            ctaHref: "/shipping",
            ctaLabel: "Xem chi tiết",
          },
          {
            icon: "⭐",
            title: "CHẤT LƯỢNG CAO CẤP",
            description: "Acrylic trong suốt, bền đẹp. In offset chất lượng cao, không phai màu theo thời gian.",
            ctaHref: "/about",
            ctaLabel: "Cam kết",
          },
          {
            icon: "🔄",
            title: "ĐỔI TRẢ DỄ DÀNG",
            description: "Đổi trả trong 7 ngày. Hoàn tiền 100% nếu có lỗi từ nhà sản xuất.",
            ctaHref: "/return",
            ctaLabel: "Chính sách",
          },
        ]}
      />

      <BestSellers />

      <CustomKeychainCTA />

      <MarqueeBanner />

      <TopCollections />
      <RetroSaleBanner />

      <ClientOnly>
        <CategoriesGrid
          title="Danh mục nổi bật"
          subtitle="Khám phá bộ sưu tập móc khóa đa dạng từ Anime, Kpop đến Game. Tìm món đồ yêu thích của bạn!"
          viewAllText="Xem tất cả danh mục"
          mobileLayout="grid"
          showDescription
        />
      </ClientOnly>

      <TestimonialsLoader />

      <RetroFAQ
        title="CÂU HỎI THƯỜNG GẶP"
        subtitle="Giải đáp mọi thắc mắc của bạn về móc khóa LắcKey"
      />

    </div>
  )
}
