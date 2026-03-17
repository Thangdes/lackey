"use client";

import { useCallback } from "react";
import { showErrorToast } from "@/components/toast/AppToast";
import type { PaymentMethod as Method } from "@/type/checkout";
import type { User } from "@/type/user";
import type { BuyerState, AltState } from "../types/checkout.client";
import type { OrderDetail, CheckoutPayload } from "@/type/order";
import { buildPayload } from "../utils/payload";
import { customerService } from "@/service/customer.service";
import { orderService } from "@/service/order.service";

export type UseCheckoutSubmitParams = {
  method: Method;
  buyer: BuyerState;
  alt: AltState;
  user: User | { email: string } | null;
  appliedCode: string | null;
  shippingFee: number;
  setSubmitLocked: (b: boolean) => void;
  setPreSubmitLoading: (b: boolean) => void;
  preSubmitChecks: (m: Method) => Promise<{ ok: boolean; msg?: string }>;
  afterOrderCreated: (created: OrderDetail, usedMethod: Method) => Promise<void>;
  checkoutMut: { mutateAsync: (payload: CheckoutPayload) => Promise<OrderDetail> };
  pendingVietQROrderId?: string | null;
  onVietQRSubmit?: () => Promise<void> | void;
};

export function useCheckoutSubmit(params: UseCheckoutSubmitParams) {
  const { method, buyer, alt, user, appliedCode, shippingFee, setSubmitLocked, setPreSubmitLoading, preSubmitChecks, afterOrderCreated, checkoutMut, pendingVietQROrderId, onVietQRSubmit } = params;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLocked(true);
    setTimeout(() => setSubmitLocked(false), 1500);
    const pre = await preSubmitChecks(method);
    if (!pre.ok) {
      if (pre.msg) showErrorToast({ title: "Không thể đặt hàng", message: pre.msg });
      return;
    }
    setPreSubmitLoading(true);
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(1500);

    if (method === "VIETQR" && pendingVietQROrderId) {
      try {
        await orderService.markPlaced(pendingVietQROrderId);
        await onVietQRSubmit?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không thể hoàn tất VietQR";
        showErrorToast({ title: "Lỗi VietQR", message });
      }
      setPreSubmitLoading(false);
      return;
    }
    let effBuyer = buyer;
    try {
      if (user && ( !buyer.fullName?.trim() || !buyer.phone?.trim() )) {
        const me = await customerService.getMe().catch(() => null);
        if (me) {
          effBuyer = {
            ...buyer,
            fullName: buyer.fullName?.trim() ? buyer.fullName : (me.fullName || buyer.fullName || ""),
            phone: buyer.phone?.trim() ? buyer.phone : (me.phone || buyer.phone || ""),
            email: buyer.email?.trim() ? buyer.email : (me.email || buyer.email || ""),
          } as typeof buyer;
        }
      }
    } catch {}
    const payload: CheckoutPayload = buildPayload(method, effBuyer, alt, appliedCode, shippingFee);
    
    try {
      const created: OrderDetail = await checkoutMut.mutateAsync(payload);
      await afterOrderCreated(created, method);
    } catch (error: unknown) {
      let message = error instanceof Error ? error.message : "Đặt hàng thất bại";
      if (typeof message === 'string') {
        if (message.includes('Full new address information is required')) {
          message = 'Vui lòng điền đầy đủ địa chỉ giao hàng (Họ tên, SĐT, Địa chỉ, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố).';
        } else if (message.includes('Email is required')) {
          message = 'Vui lòng nhập Email hoặc đăng nhập tài khoản.';
        }
      }
      showErrorToast({ title: "Đặt hàng thất bại", message });
    } finally {
      setPreSubmitLoading(false);
    }
  }, [method, buyer, alt, user, appliedCode, shippingFee, setSubmitLocked, setPreSubmitLoading, preSubmitChecks, afterOrderCreated, checkoutMut, pendingVietQROrderId, onVietQRSubmit]);

  return handleSubmit;
}
