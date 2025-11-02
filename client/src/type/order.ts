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
  // From Prisma Order
  deliveryCode?: string | null;
  notes?: string | null;
  discountId?: string | null;
  discountAmount?: number; // Decimal serialized as number from API
}

export interface OrderDetail extends OrderSummary {
  orderItems: OrderItem[];
  subtotalAmount?: number;
  subtotal?: number;
  shippingFee?: number;
  // Discount fields from BE
  discountAmount?: number;
  discount?: {
    id?: string;
    code?: string;
    description?: string;
    type?: string; // FIXED_AMOUNT | PERCENTAGE
    value?: number;
    isActive?: boolean;
    startDate?: string;
    endDate?: string | null;
    minAmount?: number | null;
  } | null;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus | string;
}
import type { PaymentMethod } from "@/type/checkout";

export type ShippingMethod = "STANDARD" | "EXPRESS";

export interface CheckoutPayload {
  // Buyer info (logged-in user may omit email)
  fullName?: string;
  email?: string;
  phone?: string;

  // Shipping address (can be same as buyer or alternate)
  recipientName?: string;
  phoneNumber?: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;

  // Order options
  paymentMethod: PaymentMethod;
  shippingMethod?: ShippingMethod;
  shippingFee?: number;
  notes?: string;
  discountCode?: string;
}
