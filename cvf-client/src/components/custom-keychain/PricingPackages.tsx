import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { PACKAGES } from "../../constant/keychain";

export function PricingPackages() {
  return (
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
            {PACKAGES.map((pkg, index) => (
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
  );
}
