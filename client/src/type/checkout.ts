import type React from "react";

export type LocalCartItem = {
  sku: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price?: number;
  quantity: number;
  thumbnailUrl?: string | null;
};

export type PaymentMethod = "COD" | "VIETQR" | "CARD" | "BANK_TRANSFER" | "MOMO" | "ZALOPAY";



export type Address = {
  recipient_name?: string;
  phone_number?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
};

export type BuyerInfoFormProps = {
  user: unknown;
  values: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
    notes: string;
    shipToDifferent: boolean;
    altFullName: string;
    altPhone: string;
    altCity: string;
    altDistrict: string;
    altWard: string;
    altStreet: string;
  };
  onChange: {
    onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onDistrictChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onWardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onShipToDifferentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAltFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAltPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAltCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onAltDistrictChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onAltWardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAltStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  canChooseDistrict: (city: string) => boolean;
};

export type DiscountBoxProps = {
  options: Array<{ code: string; description?: string | null }>;
  selectedCode: string;
  appliedCode: string | null;
  discountAmount: number;
  applyingDiscount: boolean;
  itemsLength: number;
  onSelect: (code: string) => void;
  onClear: () => void;
  formatVND: (v: number) => string;
};
