import type { Product, ProductVariant } from "./product";

export type WishlistItem = {
  id: string;
  productId: string;
  variantId?: string;
  addedAt: Date | string;
  product?: Product;
  variant?: ProductVariant;
};

export type CreateWishlistItemDto = {
  productId: string;
  variantId?: string;
};

export type WishlistSummary = {
  totalItems: number;
  productIds: string[];
};
