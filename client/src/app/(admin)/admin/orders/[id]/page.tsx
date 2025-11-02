"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { statusClasses, statusLabel, statusDescription } from "@/constant/order-status";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, ArrowLeft, Printer, Package, User as UserIcon, MapPin, Truck, CreditCard, History as HistoryIcon, CircleDot } from "lucide-react";
import ManualTracking from "@/components/admin/orders/ManualTracking";

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
    const existing = typeof r.deliveryCode === "string" ? r.deliveryCode : "";
    return existing || undefined;
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
    return "bg-black/5 text-black/70 border-black/10";
  }, []);

  return (
    !id ? (
      <div className="">Không tìm thấy mã đơn.</div>
    ) : authLoading ? (
      <div className="">Đang kiểm tra quyền truy cập...</div>
    ) : !isAdmin ? (
      <div className="">403 - Bạn không có quyền truy cập trang quản trị.</div>
    ) : isLoading ? (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white">
              <div className="p-4 border-b border-black/10 font-medium">Sản phẩm</div>
              <div className="p-4 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-black/10 bg-white p-4 space-y-3 md:sticky md:top-20">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-32" />
            <Separator className="my-2" />
            <Skeleton className="h-9 w-full" />
            <Separator className="my-2" />
            <Skeleton className="h-9 w-full" />
            <Separator className="my-2" />
            <Skeleton className="h-20 w-full" />
            <Separator className="my-2" />
            <Skeleton className="h-24 w-full" />
          </aside>
        </div>
      </div>
    ) : error ? (
      <div className="">Không thể tải chi tiết đơn hàng.</div>
    ) : !o ? (
      <div className="">Không tìm thấy đơn hàng.</div>
    ) : (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 flex-wrap">
            <span>Admin: Đơn hàng {o.orderCode || o.code || id}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => handleCopy(o.orderCode || o.code || id)}>
                  <Copy className="mr-1" /> Copy
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mã đơn</TooltipContent>
            </Tooltip>
            {(() => {
              const raw = String(((o as unknown as { paymentMethod?: string; payment?: { method?: string }; method?: string })?.paymentMethod
                || (o as unknown as { payment?: { method?: string } })?.payment?.method
                || (o as unknown as { method?: string })?.method
                || '')).toUpperCase();
              const type = raw.includes('VIETQR') ? 'VietQR' : (raw.includes('COD') ? 'COD' : (raw || '-'));
              const cls = type === 'VietQR' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200';
              return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`} title="Loại đơn hàng">{type}</span>;
            })()}
          </h1>
          {o.createdAt && (
            <div className="mt-1 text-xs text-black/60">Tạo lúc: {formatDate(o.createdAt)}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="text-sm rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 inline-flex items-center gap-1"><ArrowLeft className="size-4" /> Quay lại</Link>
          <Link href={`/admin/orders/${id}/print`} className="text-sm rounded-full border border-black/15 px-3 py-1.5 hover:bg-black/5 inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer"><Printer className="size-4" /> In hóa đơn</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white">
            <div className="p-4 border-b border-black/10 font-medium flex items-center gap-2"><Package className="size-4" /> Sản phẩm</div>
            <div className="p-4">
              {items.length === 0 ? (
                <div className="text-sm text-black/60">Không có sản phẩm</div>
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
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="font-medium mb-2 flex items-center gap-2"><UserIcon className="size-4" /> Khách hàng</div>
              {(() => {
                const r = (o as unknown as LooseOrder) || {};
                const customer = r.customer || r.user || {};
                const profile = customer.profile || {};
                const name = customer.name || profile.fullName || profile.name || customer.fullName || "-";
                const phone = customer.phone || profile.phone || r.recipientPhone || r.phone || "";
                const email = customer.email || profile.email || r.email || "";
                const customerId = customer.id || customer._id;
                return (
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-black/60">Họ tên:</span> <span className="font-medium">{name || "-"}</span>
                      {customerId ? (
                        <Link href={`/admin/customers/${customerId}`} className="ml-2 inline-flex items-center text-[11px] rounded-full border px-2 py-0.5 hover:bg-black/5">Hồ sơ</Link>
                      ) : null}
                    </div>
                    {phone ? <div><span className="text-black/60">Điện thoại:</span> <span className="font-medium">{phone}</span></div> : null}
                    {email ? <div><span className="text-black/60">Email:</span> <span className="font-medium">{email}</span></div> : null}
                  </div>
                );
              })()}
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="font-medium mb-2 flex items-center gap-2"><MapPin className="size-4" /> Địa chỉ giao hàng</div>
              {(() => {
                const r = (o as unknown as LooseOrder) || {};
                const addr = r.shippingAddress || r.address || {};
                const recipient = r.recipientName || r.receiverName || r.name || "";
                const phone = r.recipientPhone || r.phone || "";
                const line1 = addr.line1 || addr.address1 || addr.street || r.shippingAddressText || "";
                const ward = addr.ward || addr.wardName || "";
                const district = addr.district || addr.districtName || "";
                const province = addr.province || addr.provinceName || "";
                const full = [line1, ward, district, province].filter(Boolean).join(", ");
                if (!recipient && !phone && !full) return <div className="text-sm text-black/60">Chưa có thông tin giao hàng</div>;
                return (
                  <div className="text-sm space-y-1">
                    {recipient ? <div><span className="text-black/60">Người nhận:</span> <span className="font-medium">{recipient}</span></div> : null}
                    {phone ? <div><span className="text-black/60">Điện thoại:</span> <span className="font-medium">{phone}</span></div> : null}
                    {full ? <div><span className="text-black/60">Địa chỉ:</span> <span className="font-medium">{full}</span></div> : null}
                  </div>
                );
              })()}
            </div>
          </div>

          <Separator className="my-2" />
          <div className="space-y-2">
            <ManualTracking defaultCarrier="tramavandon-spx" defaultTracking={existingDeliveryCode} />
        </div>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-4 space-y-3 md:sticky md:top-20">
          <div className="font-medium">Thông tin đơn</div>
          <div className="text-sm text-black/80 flex items-center gap-2">
            Trạng thái:
            <Badge variant="outline" className={statusClasses(o.status)} title={statusDescription(o.status)}>
              {statusLabel(o.status)}
            </Badge>
          </div>
          <div className="text-sm text-black/80">Tạm tính: <span className="font-semibold">{formatVND(o.subtotalAmount ?? o.subtotal ?? 0)}</span></div>
          <div className="text-sm text-black/80">Phí vận chuyển: <span className="font-semibold">{formatVND(o.shippingFee ?? 0)}</span></div>
          <div className="text-sm text-black/80">Tổng cộng: <span className="font-semibold">{formatVND(o.totalAmount ?? o.total ?? 0)}</span></div>
          {(() => {
            const r = (o as unknown as LooseOrder) || {};
            const discountAmount = Number(r.discountAmount || 0);
            const dc = r.discount || {};
            const discountCode = dc.code as string | undefined;
            if (!discountAmount && !discountCode) return null;
            return (
              <div className="text-sm text-black/80">
                {discountAmount ? (
                  <div>Giảm giá: <span className="font-semibold">-{formatVND(discountAmount)}</span></div>
                ) : null}
                {discountCode ? (
                  <div>Mã giảm giá: <span className="font-semibold">{discountCode}</span></div>
                ) : null}
              </div>
            );
          })()}
          {(() => {
            const notes = (o as unknown as { notes?: string | null })?.notes;
            if (!notes) return null;
            return (
              <div className="text-sm text-black/80">
                Ghi chú: <span className="font-medium break-words">{notes}</span>
              </div>
            );
          })()}

          <Separator className="my-2" />
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2"><CircleDot className="size-4" /> Cập nhật trạng thái</div>
            <StatusUpdater orderId={id} currentStatus={o.status} />
          </div>

          <Separator className="my-2" />
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2"><Truck className="size-4" /> Cập nhật mã vận chuyển</div>
            <DeliveryCodeUpdater orderId={id} initialCode={existingDeliveryCode} currentStatus={o.status} />
            {existingDeliveryCode ? (
              <div className="text-[11px] text-black/60 flex items-center gap-2">
                <span>Mã hiện tại: {existingDeliveryCode}</span>
                <Button type="button" size="sm" variant="ghost" className="h-6 px-2" onClick={() => handleCopy(existingDeliveryCode, "mã vận chuyển")}>
                  <Copy className="size-4 mr-1" /> Copy
                </Button>
              </div>
            ) : null}
          </div>

          

          {(() => {
            const r = (o as unknown as LooseOrder) || {};
            const method = r.paymentMethod || r.payment?.method || "";
            const status = r.paymentStatus || r.payment?.status || "";
            const paidAt = r.paidAt || r.payment?.paidAt || "";
            if (!method && !status && !paidAt) return null;
            return (
              <div className="space-y-1">
                <Separator className="my-2" />
                <div className="text-sm font-medium flex items-center gap-2"><CreditCard className="size-4" /> Thanh toán</div>
                {method ? <div className="text-sm"><span className="text-black/60">Phương thức:</span> <span className="font-medium">{String(method)}</span></div> : null}
                {status ? (
                  <div className="text-sm flex items-center gap-2">
                    <span className="text-black/60">Trạng thái:</span>
                    <Badge variant="outline" className={paymentBadgeClass(String(status))}>{String(status)}</Badge>
                  </div>
                ) : null}
                {paidAt ? <div className="text-sm"><span className="text-black/60">Thanh toán lúc:</span> <span className="font-medium">{formatDate(String(paidAt))}</span></div> : null}
              </div>
            );
          })()}

          {(() => {
            const r = (o as unknown as LooseOrder) || {};
            const history: Array<{ status?: string; note?: string; at?: string | number | Date }>|undefined = r.history || r.timeline;
            return (
              <div className="space-y-2">
                <Separator className="my-2" />
                <div className="text-sm font-medium flex items-center gap-2"><HistoryIcon className="size-4" /> Nhật ký</div>
                {Array.isArray(history) && history.length > 0 ? (
                  <ul className="space-y-1">
                    {history.map((h, idx) => (
                      <li key={idx} className="text-xs text-black/80 flex items-center gap-2">
                        <span className="whitespace-nowrap text-black/60">{h.at ? formatDate(String(h.at)) : "-"}</span>
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px]">{h.status || ""}</Badge>
                        {h.note ? <span className="truncate">{h.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-black/60">Tạo đơn: {o.createdAt ? formatDate(o.createdAt) : "-"}</div>
                )}
              </div>
            );
          })()}
        </aside>
      </div>
    </div>
    )
  );
}
