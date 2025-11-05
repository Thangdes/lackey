export class PriceCalculator {
  static calculateEffectivePrice(
    price: number,
    discountPrice?: number | null,
  ): number {
    if (discountPrice && discountPrice > 0 && discountPrice < price) {
      return discountPrice;
    }
    return price;
  }

  static calculateLineTotal(
    price: number,
    quantity: number,
    discountPrice?: number | null,
  ): number {
    const effectivePrice = this.calculateEffectivePrice(price, discountPrice);
    return effectivePrice * quantity;
  }

  static calculateSubtotal(
    items: Array<{
      price: number;
      quantity: number;
      discountPrice?: number | null;
    }>,
  ): number {
    return items.reduce((acc, item) => {
      const lineTotal = this.calculateLineTotal(
        item.price,
        item.quantity,
        item.discountPrice,
      );
      return acc + lineTotal;
    }, 0);
  }

  static calculateTotalSavings(
    items: Array<{
      price: number;
      quantity: number;
      discountPrice?: number | null;
    }>,
  ): number {
    return items.reduce((acc, item) => {
      const effectivePrice = this.calculateEffectivePrice(
        item.price,
        item.discountPrice,
      );
      const savings = Math.max(0, (item.price - effectivePrice) * item.quantity);
      return acc + savings;
    }, 0);
  }

  static applyDiscountAmount(
    subtotal: number,
    discountAmount: number,
  ): number {
    return Math.max(0, subtotal - discountAmount);
  }
}
