import { Upload, Palette, Package, Zap, ArrowRight } from "lucide-react";
import { PROCESS_STEPS } from "../../constant/keychain";

const STEP_ICONS = {
  "01": <Upload className="w-8 h-8" />,
  "02": <Palette className="w-8 h-8" />,
  "03": <Package className="w-8 h-8" />,
  "04": <Zap className="w-8 h-8" />,
};

export function ProcessSteps() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            QUY TRÌNH ĐẶT HÀNG
          </h2>
          <p className="text-lg text-gray-600">Đơn giản chỉ với 4 bước</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, index) => {
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-3xl p-8 h-full flex flex-col shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                    <span className="text-lg font-bold">{step.number}</span>
                  </div>
                  
                  <div className="flex justify-center mb-8 pt-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                      {STEP_ICONS[step.number as keyof typeof STEP_ICONS]}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 text-center leading-relaxed flex-grow font-medium">
                    {step.description}
                  </p>
                </div>
                
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 items-center justify-center -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
