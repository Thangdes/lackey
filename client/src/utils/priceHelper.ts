import type { ProductVariant } from "@/type/product";




export interface VariantPricingInput {
  price?: number;
  discountPrice?: number | null;
}





export function getVariantPricing(variant: VariantPricingInput) {
  
  const originalPrice = Number(variant.price ?? 0);
  const discountPriceRaw = variant.discountPrice ?? null;
  const discountPrice = discountPriceRaw !== null ? Number(discountPriceRaw) : null;
  
  
  let effectivePrice = originalPrice;
  if (discountPrice !== null && discountPrice > 0 && discountPrice < originalPrice) {
    effectivePrice = discountPrice;
  }
  
  
  const hasDiscount = effectivePrice > 0 && effectivePrice < originalPrice;
  
  
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;
  
  return {
    effectivePrice,    
    originalPrice,     
    hasDiscount,       
    discountPercent,   
    discountPrice,     
  };
}




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




export function getMinPrice(variants: ProductVariant[]): number {
  if (!variants.length) return 0;
  
  const prices = variants.map(v => {
    const pricing = getVariantPricing(v);
    return pricing.effectivePrice;
  }).filter(p => p > 0);
  
  return prices.length ? Math.min(...prices) : 0;
}




export function getDiscountedVariants(variants: ProductVariant[]) {
  return variants
    .map(v => ({
      variant: v,
      pricing: getVariantPricing(v)
    }))
    .filter(x => x.pricing.hasDiscount)
    .sort((a, b) => b.pricing.discountPercent - a.pricing.discountPercent);
}
