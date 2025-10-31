"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogPost } from "@/type/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [loading, setLoading] = useState(true);
  const data = useMemo(() => posts ?? [], [posts]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <article key={idx} className="rounded-xl border border-black/10 bg-white/80 overflow-hidden">
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title="Chưa có bài viết"
        description="Khi có nội dung mới, bài viết sẽ xuất hiện tại đây."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {data.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
