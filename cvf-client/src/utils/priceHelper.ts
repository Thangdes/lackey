import type { ProductVariant } from "@/type/product";

/**
 * Minimal variant pricing interface - supports both full ProductVariant and OrderItem.productVariant
 */
export interface VariantPricingInput {
  price?: number;
  discountPrice?: number | null;
}

/**
 * Calculate effective price and discount information for a product variant
 * This ensures consistent pricing display across admin and user interfaces
 */
export function getVariantPricing(variant: VariantPricingInput) {
  // Handle Decimal from Prisma - convert to number
  const originalPrice = Number(variant.price ?? 0);
  const discountPriceRaw = variant.discountPrice ?? null;
  const discountPrice = discountPriceRaw !== null ? Number(discountPriceRaw) : null;
  
  // Determine effective price (what customer will pay)
  let effectivePrice = originalPrice;
  if (discountPrice !== null && discountPrice > 0 && discountPrice < originalPrice) {
    effectivePrice = discountPrice;
  }
  
  // Check if there's a discount
  const hasDiscount = effectivePrice > 0 && effectivePrice < originalPrice;
  
  // Calculate discount percentage
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;
  
  return {
    effectivePrice,    // Giá hiệu lực (sau giảm nếu có)
    originalPrice,     // Giá gốc
    hasDiscount,       // Có giảm giá không
    discountPercent,   // % giảm giá
    discountPrice,     // Giá khuyến mãi (raw)
  };
}

/**
 * Get the best (highest discount %) variant from a list of variants
 */
export function getBestDiscountVariant(variants: ProductVariant[]) {
  let best: { variant: ProductVariant; pricing: ReturnType<typeof getVariantPricing> } | null = null;
  let maxPercent = 0;
  
  for (const v of variants) {
    const pricing = getVariantPricing(v);
    if (pricing.hasDiscount && pricing.discountPercent > maxPercent) {
      maxPercent = pricing.discountPercent;
      best = { variant: v, pricing };
    }
  }
  
  return best;
}

/**
 * Get minimum price from variants (considers discount prices)
 */
export function getMinPrice(variants: ProductVariant[]): number {
  if (!variants.length) return 0;
  
  const prices = variants.map(v => {
    const pricing = getVariantPricing(v);
    return pricing.effectivePrice;
  }).filter(p => p > 0);
  
  return prices.length ? Math.min(...prices) : 0;
}

/**
 * Get all variants with discounts, sorted by discount percentage (highest first)
 */
export function getDiscountedVariants(variants: ProductVariant[]) {
  return variants
    .map(v => ({
      variant: v,
      pricing: getVariantPricing(v)
    }))
    .filter(x => x.pricing.hasDiscount)
    .sort((a, b) => b.pricing.discountPercent - a.pricing.discountPercent);
}
