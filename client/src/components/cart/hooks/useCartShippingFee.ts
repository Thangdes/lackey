"use client";

import { useState, useMemo, useCallback } from "react";
import { useShippingFee } from "../../checkout/hooks/useShippingFee";
import { useAddressInit } from "../../checkout/hooks/useAddressInit";
import type { SmartCartItem } from "@/type/cart";
import type { Address } from "@/type/checkout";
import { extractCartItemWeight, logWeightExtraction } from "../../../utils/weightExtractor";

export type UseCartShippingFeeResult = {
  shippingFee: number;
  loading: boolean;
  hasAddress: boolean;
  currentAddress: {
    city: string;
    district: string;
    ward: string;
  } | null;
  addressModalOpen: boolean;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  customerId: string | null;
  refreshAddresses: () => Promise<void>;
};

export function useCartShippingFee(items: SmartCartItem[], subtotal: number): UseCartShippingFeeResult {
  const [currentShippingAddress, setCurrentShippingAddress] = useState<Address>({
    recipient_name: "",
    phone_number: "",
    city: "Tp. Hồ Chí Minh",
    district: "",
    ward: "",
    street: "",
  });

  const totalWeight = useMemo(() => {
    const calculatedWeight = items.reduce((total, item) => {
      const weightResult = extractCartItemWeight({
        sku: item.sku,
        variantName: item.variantName,
        productName: item.productName
      });
      
      logWeightExtraction(
        { sku: item.sku, variantName: item.variantName, productName: item.productName },
        weightResult,
        item.quantity
      );
      
      const itemWeight = weightResult.weight;
      return total + (item.quantity * itemWeight);
    }, 0);

    return calculatedWeight;
  }, [items]);

  const addressInit = useAddressInit(
    useCallback((addr: Address) => {
      setCurrentShippingAddress(addr);
    }, []),
    useCallback(() => {
    }, [])
  );

  const shippingFee = useShippingFee({
    city: currentShippingAddress.city || "",
    district: currentShippingAddress.district || "",
    ward: currentShippingAddress.ward || "",
    altCity: "",
    altDistrict: "",
    altWard: "",
    shipToDifferent: false,
    totalWeight,
    subtotal,
  });

  const hasAddress = !!(currentShippingAddress.city && currentShippingAddress.district && currentShippingAddress.ward);
  
  const currentAddress = hasAddress ? {
    city: currentShippingAddress.city || "",
    district: currentShippingAddress.district || "",
    ward: currentShippingAddress.ward || "",
  } : null;

  return {
    shippingFee,
    loading: false,
    hasAddress,
    currentAddress,
    addressModalOpen: addressInit.addressModalOpen,
    openAddressModal: addressInit.openAddressModal,
    closeAddressModal: addressInit.closeAddressModal,
    customerId: addressInit.customerId,
    refreshAddresses: addressInit.refreshAddresses,
  };
}
