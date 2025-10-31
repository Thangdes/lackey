export type Review = {
  id: string;
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
  createdAt?: string;
  author?: { name: string; avatarUrl?: string | null };
  // Optional fields used by UI components like ReviewCard
  variantNote?: string;
  hasVideo?: boolean;
  helpfulCount?: number;
  sellerReply?: string;
};
