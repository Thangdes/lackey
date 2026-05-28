import { http, api } from "@/utils/http";
import { API } from "@/constant/api";
import type { BlogPost, BlogListResponseItem } from "@/type/blog";

export const postService = {
  
  list: (params?: { page?: number; limit?: number }) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const qp = [`page=${page}`, `limit=${limit}`].join("&");
    return http
      .get<unknown>(`${API.blog.root}?${qp}`)
      .then((payload) => {
        const arr = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { data?: unknown[] } | undefined)?.data)
          ? ((payload as { data?: unknown[] }).data as unknown[])
          : [];
        return normalizeList(arr as BlogListResponseItem[]);
      });
  },
  
  getBySlug: (slug: string) => http.get<unknown>(API.blog.bySlug(slug)).then(normalizeDetail),

  
  admin: {
    
    list: (params?: { page?: number; limit?: number }) => {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;
      const qp = [`page=${page}`, `limit=${limit}`].join("&");
      
      return http
        .get<unknown>(`${API.blog.admin}?${qp}`)
        .then((payload) => {
          const arr = Array.isArray(payload)
            ? payload
            : Array.isArray((payload as { data?: unknown[] } | undefined)?.data)
            ? ((payload as { data?: unknown[] }).data as unknown[])
            : [];
          return arr.map(normalizeAdminItem);
        });
    },
    
    getById: (id: string) => http.get<unknown>(API.blog.adminById(id)).then(normalizeAdminDetail),
    
    create: (payload: Partial<BlogPost>) => {
      const body: Record<string, unknown> = {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.contentHtml,
        isPublished: payload.isPublished,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
      };
      Object.keys(body).forEach((k) => { if (body[k] === undefined) delete body[k]; });
      return http.post<unknown>(API.blog.root, body).then(normalizeAdminDetail);
    },
    
    update: (id: string, payload: Partial<BlogPost>) => {
      const body: Record<string, unknown> = {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.contentHtml,
        isPublished: payload.isPublished,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
      };
      Object.keys(body).forEach((k) => { if (body[k] === undefined) delete body[k]; });
      return http.patch<unknown>(API.blog.byId(id), body).then(normalizeAdminDetail);
    },
    
    delete: (id: string) => http.delete<unknown>(API.blog.byId(id)),
    
    uploadThumbnail: (id: string, file: File) => {
      const form = new FormData();
      form.append("thumbnail", file);
      return api
        .post<unknown>(API.blog.thumbnail(id), form, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true })
        .then((r) => normalizeAdminDetail(r.data));
    },
  },
};

function normalizeList(items: BlogListResponseItem[] | unknown): BlogPost[] {
  const arr = Array.isArray(items) ? items : [];
  return arr.map((raw, idx) => {
    const r = (raw ?? {}) as Record<string, unknown>;
    const toString = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
    const title = toString(r["title"], "");
    const slug = toString(r["slug"], String(idx + 1));
    const excerpt = toString(r["excerpt"], "");
    const createdAt = toString(r["createdAt"], new Date().toISOString());
    const id = toString(r["id"], slug || String(idx + 1));
    const coverImage = r["thumbnailUrl"] == null ? undefined : String(r["thumbnailUrl"]);
    const author = r["author"] as { username?: unknown } | undefined;
    return {
      id,
      slug,
      title,
      excerpt,
      createdAt,
      date: createdAt, 
      coverImage,
      authorUsername: typeof author?.username === "string" ? author?.username : undefined,
    } as BlogPost;
  });
}

function normalizeDetail(raw: unknown): BlogPost {
  const r = (raw ?? {}) as Record<string, unknown>;
  const toString = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
  const toStringU = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
  const author = r["author"] as { username?: unknown } | undefined;
  const createdAt = toString(r["createdAt"], new Date().toISOString());
  return {
    id: toString(r["id"], ""),
    slug: toString(r["slug"]),
    title: toString(r["title"]),
    excerpt: toString(r["excerpt"], ""),
    contentHtml: toString(r["content"], ""),
    createdAt,
    date: createdAt, 
    updatedAt: toStringU(r["updatedAt"]),
    coverImage: toStringU(r["thumbnailUrl"]),
    authorUsername: typeof author?.username === "string" ? author?.username : undefined,
    metaTitle: toStringU(r["metaTitle"]),
    metaDescription: toStringU(r["metaDescription"]),
    isPublished: toBoolU(r["isPublished"]),
  } as BlogPost;
}


function normalizeAdminItem(raw: unknown): BlogPost {
  const r = (raw ?? {}) as Record<string, unknown>;
  const toString = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
  const toStringU = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
  const createdAt = toString(r["createdAt"], new Date().toISOString());
  return {
    id: toString(r["id"], toString(r["slug"], "")),
    slug: toString(r["slug"], ""),
    title: toString(r["title"], ""),
    excerpt: toStringU(r["excerpt"]),
    createdAt,
    date: createdAt, 
    updatedAt: toStringU(r["updatedAt"]),
    coverImage: toStringU(r["thumbnailUrl"]),
    metaTitle: toStringU(r["metaTitle"]),
    metaDescription: toStringU(r["metaDescription"]),
    isPublished: toBoolU(r["isPublished"]),
  } as BlogPost;
}

function normalizeAdminDetail(raw: unknown): BlogPost {
  return normalizeAdminItem(raw);
}


function toBoolU(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(s)) return true;
    if (["false", "0", "no", "n"].includes(s)) return false;
  }
  return undefined;
}
