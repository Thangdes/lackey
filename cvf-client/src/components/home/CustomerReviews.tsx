"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";

type Review = {
  id: string;
  name: string;
  title: string;
  content: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  verified?: boolean;
};

// Mock reviews data - Testimonials
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Minh Anh",
    title: "Móc khóa anime cực chất!",
    content: "Mình mua móc khóa Naruto và nó đẹp hơn mong đợi rất nhiều! Chất lượng in ảnh sắc nét, màu sắc rực rỡ. Shop giao hàng siêu nhanh, đóng gói cẩn thận. Giá cả hợp lý, mình đã giới thiệu cho bạn bè mua luôn!",
    rating: 5,
    reviewCount: 127,
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    verified: true,
  },
  {
    id: "2",
    name: "Tuấn Kiệt",
    title: "Fan Kpop phải có!",
    content: "Móc khóa BTS của shop quá xịn! Design đẹp, chất liệu bền. Bạn mình thấy cũng đặt mua ngay. Giá cả phải chăng, chất lượng vượt trội. Shop phục vụ nhiệt tình, tư vấn tận tâm. Rất hài lòng!",
    rating: 5,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    verified: true,
  },
  {
    id: "3",
    name: "Phương Linh",
    title: "Quà tặng ý nghĩa nhất!",
    content: "Mua làm quà sinh nhật cho em trai, em ấy mở ra rất thích và bất ngờ! Móc khóa Pikachu cute lắm, màu sắc tươi, chất liệu bền đẹp. Đóng gói đẹp, kèm thiệp chúc mừng nữa. Đã giới thiệu shop cho cả lớp rồi!",
    rating: 5,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400",
    verified: true,
  },
  {
    id: "4",
    name: "Hoàng Nam",
    title: "Chất lượng vượt trội!",
    content: "Shop uy tín, sản phẩm đúng như hình, thậm chí còn đẹp hơn. Móc khóa custom theo yêu cầu của mình rất đẹp, shop tư vấn nhiệt tình. Sẽ tiếp tục ủng hộ và mua thêm nhiều sản phẩm khác!",
    rating: 5,
    reviewCount: 203,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    verified: true,
  },
  {
    id: "5",
    name: "Thanh Hà",
    title: "Gấu Brown quá dễ thương!",
    content: "Móc khóa gấu Brown của Line Friends quá cute! Chất liệu mềm mại, màu nâu đẹp mê. Bạn mình nhìn thấy cũng đặt mua ngay 3 cái. Shop tư vấn tận tình, giao hàng nhanh chóng. Rất đáng mua!",
    rating: 5,
    reviewCount: 94,
    imageUrl: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400",
    verified: true,
  },
  {
    id: "6",
    name: "Đức Anh",
    title: "Game thủ phải có!",
    content: "Móc khóa Among Us và Valorant đẹp xỉu! Thiết kế độc đáo, màu sắc sống động. Treo vào balo gaming cực ngầu. Bạn game thủ mình ai cũng khen. Shop có nhiều mẫu game hay lắm!",
    rating: 5,
    reviewCount: 178,
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
    verified: true,
  },
];

export default function CustomerReviews() {
  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 tracking-wider uppercase">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-base md:text-lg text-neutral-600 mb-6 max-w-2xl mx-auto">
            Những chia sẻ chân thực từ khách hàng
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff100] border-2 border-black mb-6">
            <Star className="w-5 h-5 fill-black text-black" />
            <span className="font-bold text-lg">15,000+ Đánh giá 5 sao</span>
          </div>
          <Link
            href="/reviews"
            className="inline-block px-6 py-3 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold text-sm uppercase tracking-wider transition-all"
          >
            Xem tất cả đánh giá
          </Link>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src={review.imageUrl}
                  alt={review.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 flex-1 flex flex-col bg-white">
                {/* Title */}
                <h3 className="font-[family-name:var(--font-retro)] text-lg md:text-xl font-bold mb-3 line-clamp-1 uppercase">
                  {review.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-black text-black"
                            : "fill-none text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {review.reviewCount} reviews
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm leading-relaxed text-gray-700 mb-4 line-clamp-4 flex-1">
                  &ldquo;{review.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-black">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-black">
                      {review.name}
                    </span>
                    {review.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[#00ff9d]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
