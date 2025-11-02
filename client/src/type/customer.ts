export interface CustomerAddress {
  id: string;
  recipientName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  fullAddress?: string | null;
  isDefault?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  createdAt: string;
  addresses?: CustomerAddress[];
}
