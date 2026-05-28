export interface OrderItem {
  id: string;
  productVariantId: string;
  quantity: number;
  priceAtPurchase?: number;
  productVariant?: {
    id?: string;
    name?: string;
    price?: number;
    discountPrice?: number | null;
    sku?: string;
    imageUrl?: string | null;
    images?: Array<{ url?: string | null } | null> | null;
    product?: {
      id?: string;
      name?: string;
      thumbnailUrl?: string | null;
    };
  };
}

import type { OrderStatus } from "@/constant/order-status";

export interface OrderSummary {
  id: string;
  orderCode?: string;
  code?: string;
  status: OrderStatus | string;
  totalAmount?: number;
  total?: number;
  createdAt?: string;
  paymentMethod?: string;
  estimatedDelivery?: string;
  deliveryEstimate?: string;
  
  deliveryCode?: string | null;
  notes?: string | null;
  discountId?: string | null;
  discountAmount?: number; 
}

export interface OrderDetail extends OrderSummary {
  orderItems: OrderItem[];
  subtotalAmount?: number;
  subtotal?: number;
  shippingFee?: number;
  
  discountAmount?: number;
  discount?: {
    id?: string;
    code?: string;
    description?: string;
    type?: string; 
    value?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string | null;
    minAmount?: number | null;
  } | null;
  payments?: Array<{ id?: string; method?: string; amount?: number; status?: string; paidAt?: string | null }>;
  shippingAddress?: {
    recipientName?: string;
    phoneNumber?: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    fullAddress?: string | null;
  };
  customer?: {
    id?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus | string;
}
import type { PaymentMethod } from "@/type/checkout";

export type ShippingMethod = "STANDARD" | "EXPRESS";

export interface CheckoutPayload {
  
  fullName?: string;
  email?: string;
  phone?: string;

  
  recipientName?: string;
  phoneNumber?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;

  
  paymentMethod: PaymentMethod;
  shippingMethod?: ShippingMethod;
  shippingFee?: number;
  notes?: string;
  discountCode?: string;
}
