"use client";

import { useEffect, useState } from "react";
import { shippingService } from "@/service/shipping.service";

export type ShippingInputs = {
  city: string;
  district: string;
  ward: string;
  altCity: string;
  altDistrict: string;
  altWard: string;
  shipToDifferent: boolean;
  totalWeight?: number;
  subtotal?: number;
};

export function useShippingFee({ city, district, ward, altCity, altDistrict, altWard, shipToDifferent, totalWeight, subtotal }: ShippingInputs) {
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const c = shipToDifferent ? (altCity || city) : city;
    const d = shipToDifferent ? (altDistrict || district) : district;
    const w = shipToDifferent ? (altWard || ward) : ward;

    const doCalc = async () => {
      try {
        if (!c || !d || !w) {
          if (!cancelled) setShippingFee(0);
          return;
        }
        
        const fee = await shippingService.calculateFee({ 
          city: c, 
          district: d, 
          ward: w,
          totalWeight,
          subtotal
        });
        if (!cancelled) setShippingFee(Number.isFinite(fee) ? fee : 0);
      } catch (error) {
        console.error('[SHIPPING_FEE] Error calculating fee:', error);
        if (!cancelled) setShippingFee(0);
      }
    };
    doCalc();
    return () => { cancelled = true; };
  }, [city, district, ward, altCity, altDistrict, altWard, shipToDifferent, totalWeight, subtotal]);

  return shippingFee;
}
