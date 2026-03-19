import { Zap, CheckCircle2, Star } from "lucide-react";
import { KEY_FEATURES } from "../../constant/keychain";

const FEATURE_ICONS = {
  "GIAO HÀNG NHANH": <Zap className="w-8 h-8" />,
  "CHẤT LƯỢNG CAO": <CheckCircle2 className="w-8 h-8" />,
  "THIẾT KẾ FREE": <Star className="w-8 h-8" />,
};

export function FeaturesSection() {
  return (
    <section className="bg-white py-16 md:py-24 border-y border-gray-100">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {KEY_FEATURES.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-blue-600">
                    {FEATURE_ICONS[item.title as keyof typeof FEATURE_ICONS]}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
