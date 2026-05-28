export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  contentHtml?: string;
  excerpt?: string;
  createdAt: string;
  updatedAt?: string;
  coverImage?: string;
  authorUsername?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  date?: string;
}

export type BlogListResponseItem = {
  title?: string;
  slug?: string;
  excerpt?: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
  author?: { username?: string } | null;
};

export type BlogDetailResponse = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  thumbnailUrl?: string | null;
  createdAt?: string;
  author?: { username?: string } | null;
  isPublished?: boolean;
};
