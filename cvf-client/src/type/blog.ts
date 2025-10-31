export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  contentHtml?: string; 
  excerpt?: string;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
  coverImage?: string;
  authorUsername?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished?: boolean;
  
  
  date?: string;
}
