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

  static getPricingSummary(variants: any[]) {
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return {
        priceEffective: null,
        priceOriginal: null,
        compareAt: null,
        isOnSale: false,
        discountPercent: null,
      } as const;
    }

    let best: {
      effective: number;
      original: number;
      hasDiscount: boolean;
    } | null = null;

    for (const v of variants) {
      const price = v?.price != null ? Number(v.price) : NaN;
      const disc = v?.discountPrice != null ? Number(v.discountPrice) : NaN;
      const hasPrice = Number.isFinite(price) && price > 0;
      const hasDisc = Number.isFinite(disc) && disc > 0;

      if (!hasPrice && !hasDisc) continue;

      const original = hasPrice ? price : disc;
      const effective = hasPrice && hasDisc ? Math.min(price, disc) : original;
      const hasDiscount = hasPrice && hasDisc && disc < price;

      if (!best || effective < best.effective) {
        best = { effective, original, hasDiscount };
      }
    }

    if (!best) {
      return {
        priceEffective: null,
        priceOriginal: null,
        compareAt: null,
        isOnSale: false,
        discountPercent: null,
      } as const;
    }

    const isOnSale = best.hasDiscount;
    const compareAt = isOnSale ? best.original : null;
    const discountPercent =
      isOnSale && best.original > 0
        ? Math.max(1, Math.min(90, Math.round(((best.original - best.effective) / best.original) * 100)))
        : null;

    return {
      priceEffective: best.effective,
      priceOriginal: best.original,
      compareAt,
      isOnSale,
      discountPercent,
    } as const;
  }

  static formatSoldDisplay(totalBuyCount: number) {
    const n = Number(totalBuyCount) || 0;
    if (n >= 1000) {
      const k = Math.floor(n / 100) / 10;
      const s = Number.isInteger(k) ? String(k) : k.toFixed(1);
      return `${s}k+`;
    }
    return n.toLocaleString('vi-VN');
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

    const totalStock = Array.isArray(product.variants)
      ? product.variants.reduce((sum: number, v: any) => {
          const q = v?.stockQuantity != null ? Number(v.stockQuantity) : 0;
          return sum + (Number.isFinite(q) && q > 0 ? q : 0);
        }, 0)
      : undefined;

    const inStock = Array.isArray(product.variants) 
      ? product.variants.some((v: any) => {
          const q = v.stockQuantity != null ? Number(v.stockQuantity) : 0;
          return typeof q === 'number' && !Number.isNaN(q) && q > 0;
        })
      : undefined;

    const pricing = ProductCalculatorUtil.getPricingSummary(product.variants);

    const badges: string[] = [];
    const totalSold = totalBuyCount;
    if (typeof totalSold === 'number' && totalSold >= 500) badges.push('BEST');
    if (pricing.isOnSale) badges.push('SALE');

    return {
      ...rest,
      totalBuyCount,
      minEffectivePrice,
      priceEffective: pricing.priceEffective,
      priceOriginal: pricing.priceOriginal,
      compareAt: pricing.compareAt,
      isOnSale: pricing.isOnSale,
      discountPercent: pricing.discountPercent,
      badges,
      soldDisplay: ProductCalculatorUtil.formatSoldDisplay(totalBuyCount),
      ...(variantCount !== undefined ? { variantCount } : {}),
      ...(inStock !== undefined ? { inStock } : {}),
      ...(totalStock !== undefined ? { totalStock } : {}),
      ...(typeof inStock === 'boolean' ? { isOutOfStock: !inStock } : {}),
    };
  }
}
