import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { siteConfig } from "@/constant/site";
import { ROUTES } from "@/constant/route";
import { Upload, Zap, CheckCircle2, Sparkles, MessageCircle, ArrowRight, Package, Palette, Clock, Star } from "lucide-react";

export const metadata: Metadata = {
  title: `Custom Móc Khóa Theo Yêu Cầu | ${siteConfig.name}`,
  description: "Thiết kế và đặt làm móc khóa acrylic custom theo ý tưởng của bạn. Từ 1 chiếc đã nhận đơn. In offset chất lượng cao, giao hàng nhanh 3-5 ngày.",
  alternates: {
    canonical: `${siteConfig.url}/custom-keychain`,
  },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/custom-keychain`,
    title: `Custom Móc Khóa Theo Yêu Cầu | ${siteConfig.name}`,
    description: "Thiết kế và đặt làm móc khóa acrylic custom theo ý tưởng của bạn. Từ 1 chiếc đã nhận đơn.",
    siteName: siteConfig.name,
  },
  robots: { index: true, follow: true },
};

export default function CustomKeychainPage() {
  const packages = [
    {
      name: "CƠ BẢN",
      price: "50.000đ",
      unit: "/chiếc",
      minQty: "Từ 1 chiếc",
      features: [
        "Thiết kế FREE theo ảnh bạn gửi",
        "In offset chất lượng cao",
        "Acrylic trong suốt 3mm",
        "Móc kim loại không gỉ",
        "Giao hàng 5-7 ngày",
      ],
      highlight: false,
    },
    {
      name: "PREMIUM",
      price: "80.000đ",
      unit: "/chiếc",
      minQty: "Từ 1 chiếc",
      features: [
        "Thiết kế PREMIUM từ concept",
        "In offset độ phân giải cao",
        "Acrylic trong suốt 4mm",
        "Móc kim loại cao cấp",
        "Giao hàng nhanh 3-5 ngày",
        "Đóng gói gift box sang trọng",
      ],
      highlight: true,
    },
    {
      name: "SỐ LƯỢNG LỚN",
      price: "Liên hệ",
      unit: "Giá tốt nhất",
      minQty: "Từ 50 chiếc",
      features: [
        "Giảm giá đặc biệt số lượng lớn",
        "Thiết kế không giới hạn",
        "Chất lượng đồng nhất",
        "Hỗ trợ xuất hóa đơn VAT",
        "Giao hàng toàn quốc",
      ],
      highlight: false,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "GỬI YÊU CẦU",
      description: "Gửi hình ảnh, concept, hoặc mô tả ý tưởng của bạn qua form liên hệ",
      icon: <Upload className="w-8 h-8" />,
    },
    {
      number: "02",
      title: "THIẾT KẾ & BÁO GIÁ",
      description: "Chúng tôi thiết kế và gửi bản preview cùng báo giá chi tiết",
      icon: <Palette className="w-8 h-8" />,
    },
    {
      number: "03",
      title: "XÁC NHẬN & SẢN XUẤT",
      description: "Sau khi bạn đồng ý, chúng tôi bắt đầu in ấn và sản xuất",
      icon: <Package className="w-8 h-8" />,
    },
    {
      number: "04",
      title: "GIAO HÀNG",
      description: "Đóng gói cẩn thận và giao hàng tận nơi trong 3-7 ngày",
      icon: <Zap className="w-8 h-8" />,
    },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400",
    "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
    "https://images.unsplash.com/photo-1565372195458-9de0b320ef04?w=400",
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400",
    "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400",
    "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400",
  ];

  return (
    <main className="min-h-screen bg-white">
      <Script id="ld-breadcrumb-custom" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Custom Keychain", item: `${siteConfig.url}/custom-keychain` },
          ],
        })}
      </Script>

      <nav aria-label="Breadcrumb" className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-6 mb-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href={ROUTES.home} className="text-sm font-bold uppercase tracking-wide hover:text-[#229090] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          <span className="text-sm font-bold uppercase tracking-wide text-black">Custom Keychain</span>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-[#fff100] border-y-4 border-black">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 10px)
            `,
          }} />
        </div>
        <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,144,144,1)]">
              <Sparkles className="w-5 h-5 text-[#fff100]" />
              <span className="font-[family-name:var(--font-retro)] text-base md:text-lg font-bold uppercase text-white tracking-wider">
                THIẾT KẾ RIÊNG CHO BẠN
              </span>
            </div>
            
            <h1 className="font-[family-name:var(--font-retro)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider uppercase text-black leading-tight">
              CUSTOM<br />
              <span className="text-[#229090]">MÓC KHÓA</span>
            </h1>
            
            <div className="inline-block bg-white border-4 border-black px-8 py-6 shadow-[8px_8px_0px_0px_#B5CCBC] max-w-3xl">
              <p className="text-lg md:text-xl font-medium text-black leading-relaxed">
                Biến ý tưởng của bạn thành hiện thực! Gửi hình ảnh, concept, nhân vật yêu thích. 
                Chúng tôi thiết kế và in móc khóa acrylic chất lượng cao, hoàn toàn độc quyền.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link
                href="/contact?type=custom"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-[family-name:var(--font-retro)] text-xl uppercase tracking-wider transition-all shadow-[8px_8px_0px_0px_rgba(34,144,144,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
              >
                <Upload className="w-5 h-5" />
                <span>ĐẶT NGAY</span>
              </Link>
              <Link
                href="#packages"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black hover:bg-black hover:text-white border-4 border-black font-bold text-xl uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5"
              >
                <span>XEM GIÁ</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
              QUY TRÌNH ĐẶT HÀNG
            </h2>
            <p className="text-lg md:text-xl text-black/70">Đơn giản chỉ với 4 bước</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            {steps.map((step, index) => {
              const rotations = [2, -2, 2, -2];
              const rotation = rotations[index];
              
              return (
                <div key={index} className="relative" style={{ transform: `rotate(${rotation}deg)` }}>
                  <div 
                    className="bg-white border-4 border-black p-8 h-full flex flex-col hover:scale-105 transition-all"
                    style={{ 
                      boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
                      transform: `rotate(${-rotation}deg)`,
                    }}
                  >
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#fff100] border-4 border-black flex items-center justify-center">
                      <span className="font-[family-name:var(--font-retro)] text-xl font-bold">{step.number}</span>
                    </div>
                    
                    <div className="flex justify-center mb-6 pt-4">
                      <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center text-[#fff100]">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="font-[family-name:var(--font-retro)] text-xl font-bold uppercase text-black text-center mb-3 tracking-wide">
                      {step.title}
                    </h3>
                    
                    <p className="text-sm text-black/80 text-center leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className="hidden lg:block absolute top-1/2 -right-6 z-10"
                      style={{ transform: `translateY(-50%) rotate(${-rotation}deg)` }}
                    >
                      <ArrowRight className="w-8 h-8 text-[#229090]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="packages" className="bg-[#f5f5f5] py-16 md:py-24">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
                BẢNG GIÁ
              </h2>
              <p className="text-lg md:text-xl text-black/70">Chọn gói phù hợp với nhu cầu của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`relative bg-white border-4 border-black p-8 transition-all ${
                    pkg.highlight
                      ? "transform -translate-y-4 shadow-[12px_12px_0px_0px_#229090]"
                      : "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2"
                  }`}
                >
                  {pkg.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#fff100] border-4 border-black px-4 py-2">
                      <span className="font-[family-name:var(--font-retro)] text-sm font-bold uppercase flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        PHỔ BIẾN
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6 pt-4">
                    <h3 className="font-[family-name:var(--font-retro)] text-2xl font-bold uppercase tracking-wider mb-4">
                      {pkg.name}
                    </h3>
                    <div className="mb-2">
                      <span className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl font-bold text-[#229090]">
                        {pkg.price}
                      </span>
                      <span className="text-lg text-black/70">{pkg.unit}</span>
                    </div>
                    <div className="inline-block px-4 py-2 bg-black text-white text-sm font-bold uppercase">
                      {pkg.minQty}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#229090] shrink-0 mt-0.5" />
                        <span className="text-sm text-black/90 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/contact?type=custom"
                    className={`block w-full text-center px-6 py-4 border-4 border-black font-bold uppercase tracking-wide transition-all ${
                      pkg.highlight
                        ? "bg-[#fff100] text-black hover:bg-black hover:text-[#fff100]"
                        : "bg-black text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    ĐẶT NGAY
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
              MẪU THIẾT KẾ
            </h2>
            <p className="text-lg md:text-xl text-black/70">Một số mẫu móc khóa custom đã thực hiện</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img, index) => (
              <div
                key={index}
                className="aspect-square bg-white border-4 border-black overflow-hidden hover:-translate-y-2 transition-all"
                style={{ boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
              >
                <img src={img} alt={`Custom keychain ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products?custom=true"
              className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white hover:bg-[#fff100] hover:text-black border-4 border-black font-bold text-lg uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5"
            >
              <span>XEM THÊM MẪU</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fff100] border-y-4 border-black py-16 md:py-20">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Zap className="w-8 h-8" />, title: "GIAO HÀNG NHANH", desc: "3-7 ngày làm việc" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "CHẤT LƯỢNG CAO", desc: "In offset sắc nét" },
                { icon: <Star className="w-8 h-8" />, title: "THIẾT KẾ FREE", desc: "Không phí thiết kế" },
              ].map((item, index) => (
                <div key={index} className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-black flex items-center justify-center text-[#fff100]">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-[family-name:var(--font-retro)] text-xl font-bold uppercase mb-2">
                    {item.title}
                  </h3>
                  <p className="text-black/80 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black p-8 md:p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-[family-name:var(--font-retro)] text-2xl md:text-3xl font-bold uppercase text-black mb-4 tracking-wide">
              Sẵn sàng tạo móc khóa của bạn?
            </h2>
            
            <p className="text-base md:text-lg text-black/80 mb-6 max-w-2xl mx-auto">
              Gửi yêu cầu ngay hôm nay và nhận báo giá chi tiết trong vòng 24 giờ
            </p>

            <Link
              href="/contact?type=custom"
              className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white hover:bg-white hover:text-black border-4 border-black font-bold text-base uppercase tracking-wide transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              <Upload className="w-5 h-5" />
              <span>Gửi yêu cầu</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
