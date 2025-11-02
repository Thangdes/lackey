import { Zap, CheckCircle2, Star } from "lucide-react";
import { KEY_FEATURES } from "../../constant/keychain";

const FEATURE_ICONS = {
  "GIAO HÀNG NHANH": <Zap className="w-8 h-8" />,
  "CHẤT LƯỢNG CAO": <CheckCircle2 className="w-8 h-8" />,
  "THIẾT KẾ FREE": <Star className="w-8 h-8" />,
};

export function FeaturesSection() {
  return (
    <section className="bg-[#fff100] border-y-4 border-black py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {KEY_FEATURES.map((item, index) => (
              <div key={index} className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-black flex items-center justify-center text-[#fff100]">
                    {FEATURE_ICONS[item.title as keyof typeof FEATURE_ICONS]}
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
  );
}
