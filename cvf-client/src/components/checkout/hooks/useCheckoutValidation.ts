"use client";

import { useCallback } from "react";
import type { User } from "@/type/user";
import type { PaymentMethod as Method } from "@/type/checkout";
import type { BuyerState, AltState } from "../types/checkout.client";
import { validate as validateCheckout } from "../validators";
import { validateForVietQR } from "../validators";

export function useCheckoutValidation() {
  const validateForMethod = useCallback(
    (params: {
      method: Method;
      buyer: BuyerState;
      alt: AltState;
      user: User | { email: string } | null;
      isCartLoading: boolean;
      itemsLength: number;
      canChooseDistrict: (c: string) => boolean;
    }): string | null => {
      const { method, buyer, alt, user, isCartLoading, itemsLength, canChooseDistrict } = params;
      if (method === "VIETQR") {
        return validateForVietQR({
          fullName: buyer.fullName,
          user,
          email: buyer.email,
          phone: buyer.phone,
          city: buyer.city,
          district: buyer.district,
          ward: buyer.ward,
          street: buyer.street,
        });
      }
      return validateCheckout({
        fullName: buyer.fullName,
        user,
        email: buyer.email,
        phone: buyer.phone,
        city: buyer.city,
        street: buyer.street,
        shipToDifferent: buyer.shipToDifferent,
        altFullName: alt.altFullName,
        altPhone: alt.altPhone,
        altCity: alt.altCity,
        altStreet: alt.altStreet,
        canChooseDistrict,
        isCartLoading,
        itemsLength,
      });
    },
    [],
  );

  return { validateForMethod };
}
