export interface ServerCartItem {
  id: string;
  productVariantId: string;
  quantity: number;
  name?: string;
  sku?: string;
  price?: number; 
  discountPrice?: number | null; 
  effectivePrice?: number; 
  stockQuantity?: number;
  lineTotal?: number;
  isOutOfStock?: boolean;
  canIncrease?: boolean;
  canDecrease?: boolean;
  maxAddable?: number;
  product?: {
    id?: string;
    name?: string;
    slug?: string;
    thumbnailUrl?: string | null;
  };
  productVariant?: {
    price?: number;
    discountPrice?: number;
    name?: string;
    sku?: string;
    product?: {
      id?: string;
      name?: string;
      slug?: string;
      thumbnailUrl?: string | null;
    };
  };
}

export interface ServerCart {
  cartId?: string;
  items: ServerCartItem[];
  totals?: {
    subtotal: number;
    discount?: number;
    totalAfterDiscount?: number;
    totalItems?: number;
    totalUniqueItems?: number;
    savings?: number;
  };
  appliedDiscount?: {
    code: string;
    type?: string;
    value?: number;
  } | null;
}

export interface SmartCartItem {
  itemId?: string;
  variantId: string;
  quantity: number;
  price?: number;
  compareAt?: number;
  lineTotal?: number;
  productName: string;
  variantName: string;
  thumbnailUrl?: string | null;
  sku: string;
  productId?: string;
  productSlug?: string;
  canIncrease?: boolean;
  canDecrease?: boolean;
  maxAddable?: number;
  isOutOfStock?: boolean;
  supplierName?: string;
}

export type CartItemPayload = {
  productVariantId: string;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};
