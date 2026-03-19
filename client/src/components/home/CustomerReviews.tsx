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
      <section className="w-full bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Khách hàng nói gì về chúng tôi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl animate-pulse border border-gray-100 h-96 shadow-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Những chia sẻ chân thực từ khách hàng
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 mb-8 shadow-sm">
            <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
            <span className="font-semibold text-sm">15,000+ Đánh giá 5 sao</span>
          </div>
          <br />
          <Link
            href="/reviews"
            className="inline-block px-8 py-3 bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 font-semibold rounded-full text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Xem tất cả đánh giá
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                  src={review.imageUrl || "/placeholder.jpg"}
                  alt={review.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
                  {review.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-100 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  {review.reviewCount > 0 && (
                    <span className="text-xs font-medium text-gray-500">
                      ({review.reviewCount})
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-gray-600 mb-6 line-clamp-4 flex-1">
                  &ldquo;{review.content}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                      {review.name}
                    </span>
                    {review.verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
