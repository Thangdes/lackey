import { PriceCalculator } from '@/infrastructure/common/utils/price.calculator';

export interface OrderItemData {
  quantity: number;
  productVariant: {
    price: number | any;
    discountPrice?: number | any | null;
  };
}

export class OrderCalculator {
  static calculateSubtotal(items: OrderItemData[]): number {
    return items.reduce((acc, item) => {
      const price = Number(item.productVariant.price);
      const discountPrice = item.productVariant.discountPrice
        ? Number(item.productVariant.discountPrice)
        : null;
      const effectivePrice = PriceCalculator.calculateEffectivePrice(
        price,
        discountPrice,
      );
      return acc + effectivePrice * item.quantity;
    }, 0);
  }

  static calculateTotal(
    subtotal: number,
    shippingFee: number,
    discountAmount: number,
  ): number {
    return subtotal + shippingFee - discountAmount;
  }

  static getEffectivePrice(
    price: number | any,
    discountPrice?: number | any | null,
  ): number {
    const priceNum = Number(price);
    const discountPriceNum = discountPrice ? Number(discountPrice) : null;
    return PriceCalculator.calculateEffectivePrice(priceNum, discountPriceNum);
  }
}
