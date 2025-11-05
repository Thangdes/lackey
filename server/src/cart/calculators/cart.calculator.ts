import { PriceCalculator } from '../../common/utils/price.calculator';

export interface CartItemData {
  id: string;
  productVariantId: string;
  quantity: number;
  productVariant: {
    name: string;
    sku: string;
    price: number | any;
    discountPrice?: number | any | null;
    stockQuantity: number;
    product: {
      id: string;
      name: string;
      slug: string;
      thumbnailUrl?: string | null;
    };
  };
}

export interface NormalizedCartItem {
  id: string;
  productVariantId: string;
  name: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  effectivePrice: number;
  stockQuantity: number;
  quantity: number;
  lineTotal: number;
  isOutOfStock: boolean;
  canIncrease: boolean;
  canDecrease: boolean;
  maxAddable: number;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnailUrl?: string | null;
  };
}

export class CartCalculator {
  static normalizeCartItem(item: CartItemData): NormalizedCartItem {
    const price = Number(item.productVariant.price);
    const discountPrice = item.productVariant.discountPrice
      ? Number(item.productVariant.discountPrice)
      : null;

    const effectivePrice = PriceCalculator.calculateEffectivePrice(
      price,
      discountPrice,
    );

    const lineTotal = effectivePrice * item.quantity;
    const isOutOfStock = item.productVariant.stockQuantity <= 0;
    const canIncrease = item.quantity < item.productVariant.stockQuantity;
    const canDecrease = item.quantity > 1;
    const maxAddable = Math.max(
      0,
      item.productVariant.stockQuantity - item.quantity,
    );

    return {
      id: item.id,
      productVariantId: item.productVariantId,
      name: item.productVariant.name,
      sku: item.productVariant.sku,
      price,
      discountPrice,
      effectivePrice,
      stockQuantity: item.productVariant.stockQuantity,
      quantity: item.quantity,
      lineTotal,
      isOutOfStock,
      canIncrease,
      canDecrease,
      maxAddable,
      product: {
        id: item.productVariant.product.id,
        name: item.productVariant.product.name,
        slug: item.productVariant.product.slug,
        thumbnailUrl: item.productVariant.product.thumbnailUrl,
      },
    };
  }

  static calculateTotals(items: NormalizedCartItem[]) {
    const subtotal = items.reduce((acc, it) => acc + it.lineTotal, 0);

    const savings = items.reduce(
      (acc, it) =>
        acc + Math.max(0, (it.price - it.effectivePrice) * it.quantity),
      0,
    );

    const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
    const totalUniqueItems = items.length;

    return {
      subtotal,
      savings,
      totalItems,
      totalUniqueItems,
    };
  }
}
