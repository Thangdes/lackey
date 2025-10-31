"use client";

import { useMemo } from "react";
import type { BlogPost } from "@/type/blog";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { usePosts } from "@/hook/usePost";

export function BlogListContainer({ page = 1, limit = 10, placeholders }: { page?: number; limit?: number; placeholders?: BlogPost[] }) {
  const { data, isLoading, isError } = usePosts({ page, limit });

  // Fallbacks to keep UX identical when data not ready or error
  const posts: BlogPost[] = useMemo(() => {
    if (isLoading || isError) return placeholders ?? [];
    return Array.isArray(data) ? data : placeholders ?? [];
  }, [data, isError, isLoading, placeholders]);

  return <BlogListClient posts={posts} />;
}
