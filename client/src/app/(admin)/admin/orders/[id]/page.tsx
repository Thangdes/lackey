"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { statusClasses, statusLabel } from "@/constant/order-status";
import { formatVND, formatDate } from "@/utils/format";
import { useAuthProfile } from "@/hook/useAuth";
import { useOrderById } from "@/hook/useOrder";
import type { OrderDetail } from "@/type/order";
import StatusUpdater from "@/components/admin/orders/StatusUpdater";
import DeliveryCodeUpdater from "@/components/admin/orders/DeliveryCodeUpdater";
import { OrderItemRow } from "@/components/admin/orders/OrderItemRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, Printer, Package, User as UserIcon, MapPin, CreditCard } from "lucide-react";
import ManualTracking from "@/components/admin/orders/ManualTracking";
import {
  AdminDetailHeader,
  AdminDetailSection,
  AdminDetailField,
  AdminInfoCard,
} from "@/components/admin/shared";

type LooseOrder = Partial<OrderDetail> & {
  customer?: {
    id?: string;
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    profile?: {
      fullName?: string;
      name?: string;
      email?: string;
      phone?: string;
    };
  };
  user?: LooseOrder["customer"];
  recipientPhone?: string;
  phone?: string;
  email?: string;
  deliveryCode?: string;
  shippingAddress?: {
    line1?: string;
    address1?: string;
    street?: string;
    ward?: string;
    wardName?: string;
    district?: string;
    districtName?: string;
    province?: string;
    provinceName?: string;
  };
  address?: LooseOrder["shippingAddress"];
  recipientName?: string;
  receiverName?: string;
  name?: string;
  shippingAddressText?: string;
  discountAmount?: number | string;
  discount?: { code?: string };
  paymentMethod?: string;
  paymentStatus?: string;
  paidAt?: string | number | Date;
  payment?: { method?: string; status?: string; paidAt?: string | number | Date };
  notes?: string | null;
  history?: Array<{ status?: string; note?: string; at?: string | number | Date }>;
  timeline?: Array<{ status?: string; note?: string; at?: string | number | Date }>;
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const { data: me, isLoading: authLoading } = useAuthProfile();
  const { data, isLoading, error } = useOrderById(id);

  const o: OrderDetail | undefined = data;
  const items = Array.isArray(o?.orderItems) ? o!.orderItems : [];

  const existingDeliveryCode = useMemo(() => {
    const r = (o as unknown as LooseOrder) || {};
    return typeof r.deliveryCode === "string" ? r.deliveryCode : undefined;
  }, [o]);

  const isAdmin = !!me && String(me.role || "").toUpperCase() === "ADMIN";

  const handleCopy = useCallback(async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label ? `Đã copy ${label}` : "Đã copy");
    } catch {}
  }, []);

  const paymentBadgeClass = useCallback((s: string) => {
    const v = String(s || "").toUpperCase();
    if (v.includes("PAID") || v === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (v.includes("PENDING") || v.includes("PROCESS")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (v.includes("REFUND")) return "bg-sky-50 text-sky-700 border-sky-200";
    if (v.includes("FAIL") || v.includes("UNPAID")) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-muted text-muted-foreground border-border";
  }, []);

  // Loading & Error States
  if (!id) return <div className="p-6">Không tìm thấy mã đơn.</div>;
  if (authLoading) return <div className="p-6">Đang kiểm tra quyền truy cập...</div>;
  if (!isAdmin) return <div className="p-6">403 - Bạn không có quyền truy cập trang quản trị.</div>;
  
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !o) return <div className="p-6">Không thể tải chi tiết đơn hàng.</div>;

  // Extract data
  const r = o as unknown as LooseOrder;
  const customer = r.customer || r.user || {};
  const profile = customer.profile || {};
  const customerName = customer.name || profile.fullName || profile.name || customer.fullName || "—";
  const customerPhone = customer.phone || profile.phone || r.recipientPhone || r.phone || "—";
  const customerEmail = customer.email || profile.email || r.email || "—";
  const customerId = customer.id || customer._id;

  const shippingAddr = r.shippingAddress || r.address || {};
  const addressText =
    r.shippingAddressText ||
    [
      shippingAddr.line1 || shippingAddr.address1 || shippingAddr.street,
      shippingAddr.ward || shippingAddr.wardName,
      shippingAddr.district || shippingAddr.districtName,
      shippingAddr.province || shippingAddr.provinceName,
    ]
      .filter(Boolean)
      .join(", ") ||
    "—";

  const recipientName = r.recipientName || r.receiverName || r.name || customerName;

  const paymentMethod = String(r.paymentMethod || r.payment?.method || "").toUpperCase();
  const paymentType = paymentMethod.includes("VIETQR") ? "VietQR" : paymentMethod.includes("COD") ? "COD" : paymentMethod || "—";
  const paymentStatus = r.paymentStatus || r.payment?.status || "Chưa thanh toán";
  const paidAt = r.paidAt || r.payment?.paidAt;

  const discountAmount = Number(r.discountAmount || 0);
  const discountCode = r.discount?.code;
  const notes = r.notes;
  const history = r.history || r.timeline || [];

  return (
    <div className="space-y-6 p-6">
      <AdminDetailHeader
        backHref="/admin/orders"
        backLabel="Danh sách đơn hàng"
        title={`Đơn hàng #${o.orderCode || o.code || id}`}
        subtitle={o.createdAt ? `Tạo lúc: ${formatDate(o.createdAt)}` : undefined}
        badge={
          <Badge variant="outline" className={statusClasses(o.status)}>
            {statusLabel(o.status)}
          </Badge>
        }
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(o.orderCode || o.code || id, "mã đơn hàng")}
            >
              <Copy className="size-4" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/orders/${id}/print`} target="_blank">
                <Printer className="size-4" />
                In hóa đơn
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Products Section */}
          <AdminDetailSection
            title="Sản phẩm"
            description={`${items.length} sản phẩm`}
          >
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">
                <Package className="size-12 mx-auto mb-3 text-muted-foreground/30" />
                Không có sản phẩm
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Đơn giá</TableHead>
                    <TableHead className="text-right">SL</TableHead>
                    <TableHead className="text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <OrderItemRow key={it.id} item={it} />
                  ))}
                </TableBody>
              </Table>
            )}
          </AdminDetailSection>

          {/* Customer & Shipping Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <AdminInfoCard icon={UserIcon} title="Thông tin khách hàng">
              <AdminDetailField label="Họ tên" value={customerName} vertical />
              <AdminDetailField
                label="Số điện thoại"
                value={customerPhone}
                copyable
                copyValue={customerPhone}
                vertical
              />
              <AdminDetailField
                label="Email"
                value={customerEmail}
                copyable
                copyValue={customerEmail}
                vertical
              />
              {customerId && (
                <Link
                  href={`/admin/customers/${customerId}`}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
                >
                  Xem hồ sơ khách hàng →
                </Link>
              )}
            </AdminInfoCard>

            <AdminInfoCard icon={MapPin} title="Địa chỉ giao hàng">
              <AdminDetailField label="Người nhận" value={recipientName} vertical />
              <AdminDetailField
                label="Số điện thoại"
                value={customerPhone}
                copyable
                vertical
              />
              <AdminDetailField label="Địa chỉ" value={addressText} vertical />
            </AdminInfoCard>
          </div>

          {/* Payment Info */}
          <AdminInfoCard icon={CreditCard} title="Thông tin thanh toán">
            <AdminDetailField label="Phương thức" value={paymentType} />
            <AdminDetailField
              label="Trạng thái"
              value={
                <Badge variant="outline" className={paymentBadgeClass(String(paymentStatus))}>
                  {String(paymentStatus)}
                </Badge>
              }
            />
            {paidAt && <AdminDetailField label="Thanh toán lúc" value={formatDate(paidAt)} />}
          </AdminInfoCard>

          {/* Manual Tracking */}
          {existingDeliveryCode && (
            <AdminDetailSection title="Tra cứu vận đơn">
              <ManualTracking
                defaultCarrier="tramavandon-spx"
                defaultTracking={existingDeliveryCode}
              />
            </AdminDetailSection>
          )}

          {/* Order History */}
          {history.length > 0 && (
            <AdminDetailSection title="Lịch sử đơn hàng">
              <div className="space-y-2">
                {history.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm py-2 border-b last:border-0">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {h.at ? formatDate(String(h.at)) : "—"}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {h.status || "—"}
                    </Badge>
                    {h.note && <div className="text-xs text-muted-foreground truncate">{h.note}</div>}
                  </div>
                ))}
              </div>
            </AdminDetailSection>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Order Summary */}
          <AdminDetailSection title="Tổng quan đơn hàng">
            <div className="space-y-3">
              <AdminDetailField
                label="Tạm tính"
                value={formatVND(o.subtotalAmount ?? o.subtotal ?? 0)}
              />
              <AdminDetailField
                label="Phí vận chuyển"
                value={formatVND(o.shippingFee ?? 0)}
              />
              {discountAmount > 0 && (
                <AdminDetailField
                  label="Giảm giá"
                  value={
                    <span className="text-emerald-600">
                      -{formatVND(discountAmount)}
                      {discountCode && <span className="text-xs ml-1">({discountCode})</span>}
                    </span>
                  }
                />
              )}
              <Separator />
              <AdminDetailField
                label={<span className="font-semibold">Tổng cộng</span>}
                value={
                  <span className="font-semibold text-lg">
                    {formatVND(o.totalAmount ?? o.total ?? 0)}
                  </span>
                }
              />
            </div>
          </AdminDetailSection>

          {/* Status Updater */}
          <AdminDetailSection title="Cập nhật trạng thái">
            <StatusUpdater orderId={id} currentStatus={o.status} />
          </AdminDetailSection>

          {/* Delivery Code */}
          <AdminDetailSection title="Mã vận đơn">
            <DeliveryCodeUpdater
              orderId={id}
              initialCode={existingDeliveryCode}
              currentStatus={o.status}
            />
            {existingDeliveryCode && (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Mã: {existingDeliveryCode}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(existingDeliveryCode, "mã vận chuyển")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="size-3" />
                </Button>
              </div>
            )}
          </AdminDetailSection>

          {/* Notes */}
          {notes && (
            <AdminDetailSection title="Ghi chú">
              <p className="text-sm text-muted-foreground">{notes}</p>
            </AdminDetailSection>
          )}
        </aside>
      </div>
    </div>
  );
}
