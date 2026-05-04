export type ProductVariant = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  discountPrice?: number | null;
  weight?: number;
};

export type Product = {
  id: string;
  categoryId?: string;
  sellerId?: string;
  supplierId?: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  thumbnailUrl?: string | null;
  variants?: ProductVariant[];
  buyCount?: number;
  initialBuyCount?: number;
  totalBuyCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  tags?: string[];
  isActive?: boolean;
  brand?: string;
  gtin?: string;
  mpn?: string;
  minEffectivePrice?: number | null;
  priceEffective?: number | null;
  priceOriginal?: number | null;
  compareAt?: number | null;
  isOnSale?: boolean;
  discountPercent?: number | null;
  badges?: string[];
  soldDisplay?: string;
  inStock?: boolean;
  totalStock?: number;
  isOutOfStock?: boolean;
  primaryVariantId?: string | null;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
  };
  supplier?: {
    id?: string;
    name?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    description?: string;
  };
};

export type ProductSort = "popularity" | "rating" | "priceAsc" | "priceDesc";

export type ProductQuery = {
  q?: string;
  category?: string;
  categoryId?: string;
  categoryIds?: string[];
  categorySlugs?: string[];
  supplierIds?: string[];
  offers?: string[];
  sort?: ProductSort;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

export interface CreateProductPayload {
  categoryId?: string;
  sellerId?: string;
  supplierId?: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  thumbnailUrl?: string | null;
  variants?: ProductVariant[];
  tags?: string[];
  isActive?: boolean;
  initialBuyCount?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
