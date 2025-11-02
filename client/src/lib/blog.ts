import type { BlogPost } from "@/type/blog";
import { postService } from "@/service/post.service";

function validateAndNormalize(posts: BlogPost[]): BlogPost[] {
  const seen = new Set<string>();
  const dupSlugs: string[] = [];
  const unique: BlogPost[] = [];
  for (const p of posts) {
    if (seen.has(p.slug)) {
      if (!dupSlugs.includes(p.slug)) dupSlugs.push(p.slug);
      continue; // keep first occurrence
    }
    seen.add(p.slug);
    unique.push(p);
  }

  if (dupSlugs.length > 0) {
    const msg = `Duplicate blog slugs detected: ${dupSlugs.join(", ")}. Slugs must be unique.`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
    
      console.warn(msg);
    }
  }

  // sort by date desc if valid ISO, fallback to original order
  return unique.slice().sort((a, b) => {
    const da = Date.parse(a.date || "");
    const db = Date.parse(b.date || "");
    if (Number.isNaN(da) || Number.isNaN(db)) return 0;
    return db - da;
  });
}

let cached: BlogPost[] | null = null;

async function getCached(): Promise<BlogPost[]> {
  if (!cached) {
    const list = await postService.list({ page: 1, limit: 50 }).catch(() => [] as BlogPost[]);
    cached = validateAndNormalize(Array.isArray(list) ? list : []);
  }
  return cached;
}

export async function getAllPosts(): Promise<BlogPost[]> { 
  return getCached(); 
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const post = await postService.getBySlug(slug);
    return post as BlogPost;
  } catch {
    const list = await getCached();
    return list.find((p) => p.slug === slug);
  }
}
