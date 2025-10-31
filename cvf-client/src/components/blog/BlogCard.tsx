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
    <article className="group rounded-xl border border-black/10 bg-white/80 overflow-hidden flex flex-col">
      {post.coverImage ? (
        <div className="relative aspect-[16/9]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-neutral-500 inline-flex items-center gap-1">
          <Calendar className="size-3.5" aria-hidden />
          {(() => {
            const isoDate = post.date ?? post.updatedAt;
            if (!isoDate) return null;
            return (
              <time dateTime={isoDate}>{new Date(isoDate).toLocaleDateString("vi-VN")}</time>
            );
          })()}
        </div>
        <h3 className="mt-1 font-semibold text-neutral-900 line-clamp-2">{post.title}</h3>
        <p className="mt-1 text-sm text-neutral-700 line-clamp-2">{post.excerpt}</p>
        
        {/* Author info */}
        <div className="mt-2 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full bg-neutral-100">
            <Image 
              src={authorAvatar} 
              alt={authorName} 
              fill 
              sizes="24px" 
              className="object-cover" 
            />
          </div>
          <div className="text-xs text-neutral-600">{authorName}</div>
        </div>

        <div className="mt-3">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0F5555] px-3 py-1.5 text-sm text-white hover:bg-[#0F5555]/90"
            aria-label={`Xem bài: ${post.title}`}
          >
            Đọc tiếp
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
