export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "PREPARING_SHIPMENT"
  | "COMPLETED"
  | "CANCELED"
  | "SHIPPED"; // Note: SHIPPED is set via delivery-code API, not via status update

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "PREPARING_SHIPMENT",
  "SHIPPED",
  "COMPLETED",
  "CANCELED",
];

// Allowed to be set via updateStatus() on server
export const ADMIN_UPDATABLE_STATUSES: OrderStatus[] = [
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "PREPARING_SHIPMENT",
  "SHIPPED",
  "COMPLETED",
  "CANCELED",
];

export const STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PREPARING_SHIPMENT: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELED: "bg-rose-50 text-rose-700 border-rose-200",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING_SHIPMENT: "Chuẩn bị giao",
  SHIPPED: "Đã bàn giao vận chuyển",
  COMPLETED: "Hoàn tất",
  CANCELED: "Đã hủy",
};

export function statusLabel(status?: string | null | undefined): string {
  const s = String(status || "").toUpperCase() as OrderStatus;
  return STATUS_LABELS[s] || s;
}

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  PENDING_CONFIRMATION: "Đã tạo đơn, chờ xác nhận thanh toán hoặc duyệt đơn.",
  CONFIRMED: "Đơn đã được xác nhận, chuẩn bị xử lý.",
  PREPARING_SHIPMENT: "Đơn đang được đóng gói và bàn giao cho vận chuyển.",
  SHIPPED: "Đã giao cho đơn vị vận chuyển, vui lòng theo dõi mã vận đơn.",
  COMPLETED: "Đơn hàng đã hoàn tất.",
  CANCELED: "Đơn hàng đã bị hủy.",
};

export function statusDescription(status?: string | null | undefined): string {
  const s = String(status || "").toUpperCase() as OrderStatus;
  return STATUS_DESCRIPTIONS[s] || "";
}

export function statusClasses(status?: string | null | undefined): string {
  const s = String(status || "").toUpperCase() as OrderStatus;
  return STATUS_BADGE_CLASS[s] || "bg-gray-50 text-gray-700 border-gray-200";
}
