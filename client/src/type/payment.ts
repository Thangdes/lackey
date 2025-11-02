export type OrderItem = {
    sku: string
    quantity: number
    price: number
  }
  
  export type Payment = {
    method: "COD" | "VIETQR"
    amount: number
    status?: "PENDING" | "SUCCESS" | "FAILED"
    transaction_code?: string
  }
  
  export type OrderRecord = {
    code: string
    createdAt: string
    subtotal_amount: number
    shipping_fee: number
    total_amount: number
    notes?: string
    items: OrderItem[]
    payment: Payment
    status: "PENDING_CONFIRMATION" | "CONFIRMED" | "PREPARING_SHIPMENT" | "SHIPPED" | "COMPLETED" | "CANCELED"
    paid?: boolean
  }
  
  export type Address = {
    recipient_name?: string
    phone_number?: string
    street?: string
    ward?: string
    district?: string
    city?: string
  }

// Response returned by POST /payments/create-link
export interface PaymentLinkResponse {
  orderId: string;
  orderCode?: string;
  amount: number;
  qrCodeImageUrl?: string;
  url?: string;
  paymentId: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

// Response returned by GET /payments/pending
export interface PendingPaymentsResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Minimal shape for a pending payment item; keep it flexible as backend includes order and customer
export interface PendingPaymentItem {
  id: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  amount?: number | string;
  paidAt?: string | null;
  method?: string;
  order?: {
    id: string;
    orderCode: string;
    customer?: { id: string; name?: string; email?: string } | null;
  } | null;
  [key: string]: unknown;
}

export interface PendingPaymentsResponse {
  data: PendingPaymentItem[];
  meta: PendingPaymentsResponseMeta;
}

// Response returned by POST /payments/reconcile-csv
export interface ReconcileCsvResultItem {
  transactionId?: string;
  matchedOrderCode?: string;
  matchedPaymentId?: string;
  status: "matched" | "skipped" | "error";
  reason?: string;
}

export interface ReconcileCsvResponse {
  results: ReconcileCsvResultItem[];
}