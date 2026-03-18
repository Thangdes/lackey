import type { PaymentMethod as Method } from "@/type/checkout";
import type { BuyerState, AltState } from "../types/checkout.client";
import { generatePersonalizedTempEmail } from "@/utils/tempEmail";

export type CheckoutPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  recipientName?: string;
  phoneNumber?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  paymentMethod: Method;
  notes?: string;
  discountCode?: string;
  shippingFee: number;
};

export function buildPayload(
  method: Method,
  buyer: BuyerState,
  alt: AltState,
  appliedCode: string | null,
  shippingFee: number,
): CheckoutPayload {
  const toValue = (str: string | undefined) => {
    if (!str || str.trim() === "") return undefined;
    return str.trim();
  };
  
  const getEmailWithTempGeneration = (email: string | undefined, fullName?: string, phone?: string) => {
    const cleanEmail = toValue(email);
    
    // If user provided email, use it
    if (cleanEmail && cleanEmail.length > 0) {
      return cleanEmail;
    }
    
    // Generate personalized temporary email based on name and phone
    const tempEmail = generatePersonalizedTempEmail(fullName, phone);
    return tempEmail;
  };

  if (method === "VIETQR") {
    const payload = {
      fullName: toValue(buyer.fullName),
      email: getEmailWithTempGeneration(buyer.email, buyer.fullName, buyer.phone),
      phone: toValue(buyer.phone),
      recipientName: toValue(buyer.fullName),
      phoneNumber: toValue(buyer.phone),
      street: toValue(buyer.street),
      ward: toValue(buyer.ward),
      district: toValue(buyer.district),
      city: toValue(buyer.city) || "Tp. Hồ Chí Minh",
      paymentMethod: method,
      notes: toValue(buyer.notes),
      discountCode: appliedCode || undefined,
      shippingFee,
    };

    return payload;
  }

  const payload = {
    fullName: toValue(buyer.fullName),
    email: getEmailWithTempGeneration(buyer.email, buyer.fullName, buyer.phone),
    phone: toValue(buyer.phone),
    recipientName: buyer.shipToDifferent ? toValue(alt.altFullName) : toValue(buyer.fullName),
    phoneNumber: buyer.shipToDifferent ? toValue(alt.altPhone) : toValue(buyer.phone),
    street: buyer.shipToDifferent ? toValue(alt.altStreet) : toValue(buyer.street),
    ward: buyer.shipToDifferent ? toValue(alt.altWard) : toValue(buyer.ward),
    district: buyer.shipToDifferent ? toValue(alt.altDistrict) : toValue(buyer.district),
    city: buyer.shipToDifferent ? (toValue(alt.altCity) || "Tp. Hồ Chí Minh") : (toValue(buyer.city) || "Tp. Hồ Chí Minh"),
    paymentMethod: method,
    notes: toValue(buyer.notes),
    discountCode: appliedCode || undefined,
    shippingFee,
  };

  return payload;
}

export function persistDefaultAddress(payload: CheckoutPayload): void {
  try {
    if (typeof window === "undefined") return;
    const data = {
      recipient_name: payload.recipientName,
      phone_number: payload.phoneNumber,
      street: payload.street,
      ward: payload.ward,
      district: payload.district,
      city: payload.city,
    };
    localStorage.setItem("defaultAddress", JSON.stringify(data));
  } catch {}
}
