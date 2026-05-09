import Link from "next/link";
import { Upload } from "lucide-react";

export function CTASection() {
  return (
    <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-16 text-center shadow-lg border border-blue-500 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10 blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Sẵn sàng tạo móc khóa của bạn?
            </h2>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Gửi yêu cầu ngay hôm nay và nhận báo giá chi tiết trong vòng 24 giờ
            </p>

            <Link
              href="/contact?type=custom"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              <span>Gửi yêu cầu ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
