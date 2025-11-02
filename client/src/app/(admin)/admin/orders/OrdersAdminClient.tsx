"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useOrderList } from "@/hook/useOrder";
import type { OrderSummary } from "@/type/order";
import { useAuthProfile } from "@/hook/useAuth";
import type { Paginated } from "@/type/common";
import { Button } from "@/components/ui/button";
import { ORDER_TEXT } from "@/constant/orders";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import OrdersToolbar from "@/components/admin/orders/OrdersToolbar";
import OrdersTable from "@/components/admin/orders/OrdersTable";

const PAGE_SIZE = 10;

 

export default function OrdersAdminClient({ initial }: { initial?: Paginated<OrderSummary> }) {
  const { data: me, isLoading: authLoading } = useAuthProfile();
  const [page, setPage] = useState(1);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryCode, setDeliveryCode] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [customerType, setCustomerType] = useState<"guest" | "registered" | undefined>(undefined);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  

  const { data, isLoading, error } = useOrderList({ page, limit: PAGE_SIZE, status, code, email, deliveryCode, customerType }, initial);
  const orders = useMemo(() => data?.items || [], [data?.items]);
  const total = data?.total || 0;
  const pageSize = data?.pageSize || PAGE_SIZE;
  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  const canGoNext = useMemo(() => {
    if (!total || total <= pageSize) {
      return orders.length === pageSize;
    }
    return (page < pageCount);
  }, [total, pageSize, orders.length, page, pageCount]);

  const isAdmin = !!me && String(me.role || "").toUpperCase() === "ADMIN";

  

  const handleCodeChange = useCallback((v: string) => {
    setPage(1);
    setCode(v);
  }, []);
  const handleEmailChange = useCallback((v: string) => {
    setPage(1);
    setEmail(v);
  }, []);
  const handleDeliveryCodeChange = useCallback((v: string) => {
    setPage(1);
    setDeliveryCode(v);
  }, []);

  const handleStatusChange = useCallback((v?: string) => {
    setPage(1);
    setStatus(v);
  }, []);

  const handleCustomerTypeChange = useCallback((v?: "guest" | "registered") => {
    setPage(1);
    setCustomerType(v);
  }, []);

  const handleToggleAll = useCallback((on: boolean) => {
    setSelected(prev => {
      const next = { ...prev };
      orders.forEach((o) => { next[o.id] = on; });
      return next;
    });
  }, [orders]);

  const handleToggleOne = useCallback((id: string, on: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: on }));
  }, []);

  useEffect(() => {
    if (error) {
      const raw = (error as unknown as { message?: string })?.message || String(error);
      toast.error("Không thể tải danh sách đơn hàng", { description: raw });
    }
  }, [error]);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  return (
    authLoading ? (
      <div>Đang kiểm tra quyền truy cập...</div>
    ) : !isAdmin ? (
      <div>403 - Bạn không có quyền truy cập trang quản trị.</div>
    ) : (
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold inline-flex items-center gap-2">
              <ShoppingCart className="size-6 text-muted-foreground" aria-hidden />
              {ORDER_TEXT.listTitle} (Admin)
            </h1>
            <p className="text-sm text-muted-foreground">Quản lý đơn hàng, cập nhật trạng thái và mã vận chuyển</p>
          </div>
        </div>

        <OrdersToolbar
          code={code}
          email={email}
          deliveryCode={deliveryCode}
          status={status}
          customerType={customerType}
          onCodeChange={handleCodeChange}
          onEmailChange={handleEmailChange}
          onDeliveryCodeChange={handleDeliveryCodeChange}
          onStatusChange={handleStatusChange}
          onCustomerTypeChange={handleCustomerTypeChange}
        />

        
        {isLoading && <div>Đang tải...</div>}
        {error && <div className="text-red-600">Không thể tải danh sách đơn hàng.</div>}

        {!isLoading && !error && (
          <OrdersTable orders={orders} selected={selected} onToggleAll={handleToggleAll} onToggleOne={handleToggleOne} />
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-black/60">Tổng: {total} {total && total > pageSize ? `(Trang ${page}/${pageCount})` : ""}</div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" disabled={page <= 1} onClick={handlePrevPage} className="inline-flex items-center gap-2">
              <ChevronLeft className="size-4" aria-hidden />
              Trước
            </Button>
            <div className="text-sm">Trang {page}{total && total > pageSize ? ` / ${pageCount}` : ""}</div>
            <Button type="button" variant="outline" disabled={!canGoNext} onClick={handleNextPage} className="inline-flex items-center gap-2">
              Sau
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    )
  );
}

