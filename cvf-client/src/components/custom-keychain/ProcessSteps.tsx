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
    <section className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
            QUY TRÌNH ĐẶT HÀNG
          </h2>
          <p className="text-lg md:text-xl text-black/70">Đơn giản chỉ với 4 bước</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {PROCESS_STEPS.map((step, index) => {
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
                      {STEP_ICONS[step.number as keyof typeof STEP_ICONS]}
                    </div>
                  </div>
                  
                  <h3 className="font-[family-name:var(--font-retro)] text-xl font-bold uppercase text-black text-center mb-3 tracking-wide">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-black/80 text-center leading-relaxed flex-grow">
                    {step.description}
                  </p>
                </div>
                
                {index < PROCESS_STEPS.length - 1 && (
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
  );
}
