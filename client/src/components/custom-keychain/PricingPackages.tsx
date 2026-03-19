import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { PACKAGES } from "../../constant/keychain";

export function PricingPackages() {
  return (
    <section id="packages" className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Bảng Giá
            </h2>
            <p className="text-lg text-gray-600">Chọn gói phù hợp với nhu cầu của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PACKAGES.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 md:p-10 transition-all duration-300 ${
                  pkg.highlight
                    ? "ring-2 ring-blue-600 shadow-xl md:-translate-y-4"
                    : "border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2"
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-full shadow-md">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {pkg.name}
                  </h3>
                  <div className="mb-4 flex flex-col items-center justify-center">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-medium text-gray-500">{pkg.unit}</span>
                  </div>
                  <div className="inline-flex items-center justify-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold uppercase tracking-wide">
                    {pkg.minQty}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      <span className="text-sm text-gray-700 font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact?type=custom"
                  className={`block w-full text-center px-6 py-4 rounded-xl font-semibold text-base transition-all ${
                    pkg.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                      : "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
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
