import Link from "next/link";
import { Upload } from "lucide-react";

export function CTASection() {
  return (
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
  );
}
