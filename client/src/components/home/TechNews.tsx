"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { Calendar, ArrowRight } from "lucide-react";

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
};

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "Top 5 Switch Bàn Phím Cơ Tốt Nhất 2024",
    slug: "top-5-switch-ban-phim-co-tot-nhat-2024",
    excerpt: "Khám phá những loại switch được yêu thích nhất năm 2024 từ Gateron, Cherry MX đến Akko. Đâu là lựa chọn phù hợp với bạn?",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    date: "15/12/2024",
    category: "Review",
    readTime: "5 phút đọc",
  },
  {
    id: "2",
    title: "Hướng Dẫn Lube Switch Cho Người Mới Bắt Đầu",
    slug: "huong-dan-lube-switch-cho-nguoi-moi",
    excerpt: "Lube switch giúp bàn phím êm hơn, mượt hơn. Hướng dẫn chi tiết từ A-Z cho người mới bắt đầu với bàn phím cơ.",
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600",
    date: "12/12/2024",
    category: "Hướng dẫn",
    readTime: "8 phút đọc",
  },
  {
    id: "3",
    title: "So Sánh Keycap PBT vs ABS: Nên Chọn Loại Nào?",
    slug: "so-sanh-keycap-pbt-vs-abs",
    excerpt: "PBT hay ABS? Phân tích ưu nhược điểm của từng loại keycap để bạn có lựa chọn phù hợp nhất cho bàn phím của mình.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600",
    date: "10/12/2024",
    category: "So sánh",
    readTime: "6 phút đọc",
  },
  {
    id: "4",
    title: "Keychron Q1 Pro Review: Đáng Đồng Tiền Bát Gạo?",
    slug: "keychron-q1-pro-review",
    excerpt: "Review chi tiết Keychron Q1 Pro - một trong những bàn phím custom tốt nhất trong tầm giá. Có nên mua không?",
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600",
    date: "08/12/2024",
    category: "Review",
    readTime: "10 phút đọc",
  },
];

export default function TechNews() {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Tin tức công nghệ
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Cập nhật kiến thức và xu hướng mới nhất về bàn phím cơ
            </p>
          </div>
          <Link
            href={ROUTES.blog}
            className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {NEWS_ARTICLES.map((article) => (
            <Link
              key={article.id}
              href={`${ROUTES.blog}/${article.slug}`}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Image */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href={ROUTES.blog}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả tin tức
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
