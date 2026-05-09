import Link from "next/link";
import { Upload, Sparkles, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent" />
      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              THIẾT KẾ RIÊNG CHO BẠN
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 leading-tight">
            CUSTOM<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">MÓC KHÓA</span>
          </h1>
          
          <div className="mx-auto max-w-3xl">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Biến ý tưởng của bạn thành hiện thực! Gửi hình ảnh, concept, nhân vật yêu thích. 
              Chúng tôi thiết kế và in móc khóa acrylic chất lượng cao, hoàn toàn độc quyền.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link
              href="/contact?type=custom"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              <span>ĐẶT NGAY</span>
            </Link>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span>XEM GIÁ</span>
              <ArrowRight className="w-5 h-5 opacity-70" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
