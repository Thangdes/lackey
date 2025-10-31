import type { BlogPost } from "@/type/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export function BlogListServer({ posts }: { posts: BlogPost[] }) {
  if (!posts?.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
