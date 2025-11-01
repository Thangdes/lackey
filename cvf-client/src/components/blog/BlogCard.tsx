"use client";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/type/blog";
import { Calendar, ArrowRight } from "lucide-react";

export function BlogCard({ post }: { post: BlogPost }) {
  const authorName = post.authorUsername || "LắcKey";
  const authorAvatar = post.authorUsername 
    ? "/logo/logo.jpg" 
    : "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white border border-transparent hover:border-black transition-all flex flex-col h-full"
    >
      {post.coverImage ? (
        <div className="relative aspect-[16/9] bg-gray-200 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] bg-gray-200" />
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-neutral-600 uppercase tracking-wide inline-flex items-center gap-1 mb-2">
          <Calendar className="size-3.5" aria-hidden />
          {(() => {
            const isoDate = post.date ?? post.updatedAt;
            if (!isoDate) return null;
            return (
              <time dateTime={isoDate}>{new Date(isoDate).toLocaleDateString("vi-VN")}</time>
            );
          })()}
        </div>
        
        <h3 className="text-base md:text-lg font-bold text-neutral-900 group-hover:text-black line-clamp-2 mb-2 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-neutral-600 line-clamp-3 mb-auto">
          {post.excerpt}
        </p>
        
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gray-200 border border-black">
              <Image 
                src={authorAvatar} 
                alt={authorName} 
                fill 
                sizes="24px" 
                className="object-cover" 
              />
            </div>
            <div className="text-xs font-medium text-neutral-900">{authorName}</div>
          </div>
          
          <div className="text-xs font-medium text-black uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
            Đọc thêm
            <ArrowRight className="size-3.5" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}
