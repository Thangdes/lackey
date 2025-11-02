import Link from "next/link";
import { Upload, Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
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
  );
}
