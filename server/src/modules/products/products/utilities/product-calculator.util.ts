export class ProductCalculatorUtil {
  static getMinEffectivePrice(variants: any[]): number | null {
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return null;
    }

    const effectivePrices = variants
      .map((v) => {
        const price = v.price != null ? Number(v.price) : undefined;
        const disc = v.discountPrice != null ? Number(v.discountPrice) : undefined;

        if (typeof price === 'number' && !Number.isNaN(price) && typeof disc === 'number' && !Number.isNaN(disc)) {
          return Math.min(price, disc);
        }
        if (typeof price === 'number' && !Number.isNaN(price)) return price;
        if (typeof disc === 'number' && !Number.isNaN(disc)) return disc;
        return undefined;
      })
      .filter((x): x is number => typeof x === 'number');

    return effectivePrices.length > 0 ? Math.min(...effectivePrices) : null;
  }

  static enrichProductWithCalculatedFields(product: any): any {
    if (!product) return product;

    const minEffectivePrice = ProductCalculatorUtil.getMinEffectivePrice(product.variants);

    const buy = Number(product.buyCount ?? 0);
    const initial = Number(product.initialBuyCount ?? 0);
    const totalBuyCount = buy + initial;

    // Optional: variantCount if requested or _count is present
    let variantCount = product.variantCount;
    if (variantCount === undefined && product._count?.variants !== undefined) {
      variantCount = product._count.variants;
    } else if (variantCount === undefined && Array.isArray(product.variants)) {
      variantCount = product.variants.length;
    }

    const { _count, ...rest } = product;

    const inStock = Array.isArray(product.variants) 
      ? product.variants.some((v: any) => {
          const q = v.stockQuantity != null ? Number(v.stockQuantity) : 0;
          return typeof q === 'number' && !Number.isNaN(q) && q > 0;
        })
      : undefined;

    return {
      ...rest,
      totalBuyCount,
      minEffectivePrice,
      ...(variantCount !== undefined ? { variantCount } : {}),
      ...(inStock !== undefined ? { inStock } : {}),
    };
  }
}
