// Server response DTOs for blog module (client-side only)
export type BlogListResponseItem = {
  title?: string;
  slug?: string;
  excerpt?: string;
  thumbnailUrl?: string | null;
  createdAt?: string; // ISO
  author?: { username?: string } | null;
};

export type BlogDetailResponse = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  thumbnailUrl?: string | null;
  createdAt?: string; // ISO
  author?: { username?: string } | null;
  isPublished?: boolean;
};
