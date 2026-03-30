import { useMemo } from "react";
import type { OrderItem } from "@/type/order";
import { getVariantPricing } from "@/utils/priceHelper";

export function useOrderItemPrice(item: OrderItem) {
  return useMemo(() => {
    const pv = item.productVariant;
    
  
    if (item.priceAtPurchase !== undefined && item.priceAtPurchase !== null) {
      const priceAtPurchase = item.priceAtPurchase;
      
      const currentPricing = pv ? getVariantPricing(pv) : null;
      
      let originalPrice = priceAtPurchase;
      let effectivePrice = priceAtPurchase;
      
      if (currentPricing && currentPricing.hasDiscount) {
        if (Math.abs(priceAtPurchase - currentPricing.effectivePrice) < 0.01) {
          originalPrice = currentPricing.originalPrice;
          effectivePrice = priceAtPurchase;
        }
        else if (Math.abs(priceAtPurchase - currentPricing.originalPrice) < 0.01) {
          originalPrice = priceAtPurchase;
          effectivePrice = currentPricing.effectivePrice;
        }
      }
      
      const hasDiscount = effectivePrice > 0 && effectivePrice < originalPrice;
      const discountPercent = hasDiscount && originalPrice > 0
        ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
        : 0;
      const lineTotal = effectivePrice * (item.quantity ?? 1);
      
      return {
        effectivePrice,
        originalPrice,
        hasDiscount,
        discountPercent,
        lineTotal,
        quantity: item.quantity ?? 1,
      };
    }
    
    if (pv) {
      const pricing = getVariantPricing(pv);
      const lineTotal = pricing.effectivePrice * (item.quantity ?? 1);
      
      return {
        effectivePrice: pricing.effectivePrice,
        originalPrice: pricing.originalPrice,
        hasDiscount: pricing.hasDiscount,
        discountPercent: pricing.discountPercent,
        lineTotal,
        quantity: item.quantity ?? 1,
      };
    }
    
    return {
      effectivePrice: 0,
      originalPrice: 0,
      hasDiscount: false,
      discountPercent: 0,
      lineTotal: 0,
      quantity: item.quantity ?? 1,
    };
  }, [item]);
}
