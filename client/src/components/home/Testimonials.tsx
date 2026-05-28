"use client";

import React from "react";
import Image from "next/image";
import { BsPatchCheck } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import SectionHeader from "@/components/common/SectionHeader";

export type Testimonial = {
  id: string;
  name: string;
  avatarUrl?: string;
  imageUrl?: string;
  rating: number; 
  content: string;
  role?: string;
};

export type TestimonialsProps = {
  title?: string;
  subtitle?: string;
  items?: Testimonial[];
  gradientStrip?: boolean;
  gradientCss?: string;
  disableFallback?: boolean;
};

const defaults: Testimonial[] = [
  {
    id: "t1",
    name: "Minh Anh",
    role: "Khách hàng thân thiết",
    avatarUrl: "/logo/logo.jpg",
    imageUrl: "https://cdn.dribbble.com/userupload/29703852/file/original-e95556e95b29bcf06dc22d76d89ce316.png?format=webp&resize=450x338&vertical=center",
    rating: 5,
    content: "Bàn phím custom build rất đẹp và độc đáo, giao hàng nhanh chóng và đóng gói vô cùng cẩn thận. Switch gõ cực êm, lube chuẩn không bị quá tay. Tôi chắc chắn sẽ tiếp tục ủng hộ dài dài!",
  },
  {
    id: "t2",
    name: "Thanh Bình",
    role: "Nhân viên văn phòng",
    avatarUrl: "/logo/logo.jpg",
    imageUrl: "https://cdn.dribbble.com/userupload/34789040/file/original-4a2b90b050080dc5331e53b6174c38c5.jpg?format=webp&resize=450x338&vertical=center",
    rating: 5,
    content: "Phím cơ build theo yêu cầu rất đẹp và chất lượng ổn định. Mẫu mã đa dạng, dễ dàng chọn kit và switch theo phong cách cá nhân. Giá cả so với thị trường cũng rất cạnh tranh, phù hợp làm quà tặng.",
  },
  {
    id: "t3",
    name: "Quỳnh Như",
    role: "Fashion blogger",
    avatarUrl: "/logo/logo.jpg",
    imageUrl: "https://cdn.dribbble.com/userupload/27692021/file/original-28c286f987c2b303d011f8b2422bbc66.jpg?format=webp&resize=450x338&vertical=center",
    rating: 4,
    content: "Keycap artisan rất sáng tạo, dễ dàng kết hợp với nhiều phong cách setup khác nhau. Đặc biệt, dịch vụ tư vấn custom phím rất hữu ích, giúp tôi có thêm nhiều ý tưởng góc làm việc mới lạ. Một nơi đáng cân nhắc cho anh em chơi phím.",
  },
  {
    id: "t4",
    name: "Hồng Phúc",
    role: "Chủ cửa hàng nhỏ",
    avatarUrl: "/logo/logo.jpg",
    imageUrl: "https://cdn.dribbble.com/userupload/28184572/file/original-b02c243ad03f33bacae0f173771d4073.png?format=webp&resize=450x338&vertical=center",
    rating: 5,
    content: "Tôi đã thử nhiều nơi bán bàn phím cơ khác nhau, nhưng LắcKey thực sự nổi bật bởi dịch vụ mod phím và chất lượng ổn định. Khách hàng của tôi thường khen phím gõ êm và bền hơn những nơi khác. Đây chắc chắn sẽ là địa chỉ ruột của tôi.",
  },
];


function RatingStars({ value }: { value: number }) {
  const full = Math.round(Math.max(1, Math.min(5, value)));
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`Đánh giá ${full}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <IoIosStar key={i} className={`h-5 w-5 ${i < full ? "text-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );
}

const Testimonials: React.FC<TestimonialsProps> = ({ title = "Khách hàng nói gì về chúng tôi", subtitle = "Những chia sẻ chân thực từ khách hàng", items, disableFallback = false }) => {
  const list = (disableFallback ? (items || []) : (items && items.length ? items : defaults)).slice(0, 4);
  return (
    <section aria-label="Testimonials" className="py-12 bg-gray-50">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-12">
          <SectionHeader
            title={<h2 className="text-gray-900 text-3xl font-bold">{title}</h2>}
            subtitle={subtitle}
            align="center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((t) => {
            const hero = t.imageUrl || t.avatarUrl || "/logo/logo.jpg";
            return (
              <article key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full aspect-[16/10]">
                  <Image src={hero} alt={t.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-center mb-3">
                    <RatingStars value={t.rating} />
                  </div>
                  <p className="text-center text-sm text-gray-600 leading-relaxed line-clamp-4">&quot;{t.content}&quot;</p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                      <BsPatchCheck className="text-blue-500 text-base" />
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                        {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
