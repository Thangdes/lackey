export type Review = {
  id: string;
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  createdAt?: string;
  author?: { name: string; avatarUrl?: string | null };
  
  variantNote?: string;
  hasVideo?: boolean;
  helpfulCount?: number;
  sellerReply?: string;
};
