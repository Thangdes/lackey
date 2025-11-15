"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import { siteContentService } from "@/service/site-content.service";

export default function CustomerReviews() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Array<{
    id: string;
    name: string;
    title: string;
    content: string;
    rating: number;
    reviewCount: number;
    imageUrl?: string;
    verified: boolean;
  }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await siteContentService.getTestimonials();
        if (!mounted) return;
        const mapped = (items || []).slice(0, 6).map((it) => ({
          id: it.id,
          name: it.name || "Khách hàng",
          title: it.role || "Đánh giá sản phẩm",
          content: it.content || "",
          rating: it.rating ?? 5,
          reviewCount: 0,
          imageUrl: it.imageUrl || "/placeholder.jpg",
          verified: true,
        }));
        setReviews(mapped);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-16 md:py-20">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-4 tracking-wider uppercase">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse border-2 border-black h-96" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src={review.imageUrl || "/placeholder.jpg"}
                  alt={review.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 md:p-6 flex-1 flex flex-col bg-white">
                <h3 className="font-[family-name:var(--font-retro)] text-lg md:text-xl font-bold mb-3 line-clamp-1 uppercase">
                  {review.title}
                </h3>

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
                  {review.reviewCount > 0 && (
                    <span className="text-xs text-gray-600">
                      {review.reviewCount} reviews
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-gray-700 mb-4 line-clamp-4 flex-1">
                  &ldquo;{review.content}&rdquo;
                </p>

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
