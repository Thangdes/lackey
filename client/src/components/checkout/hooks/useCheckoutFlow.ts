"use client";

import { useCallback } from "react";
import { showInfoToast, showSuccessToast } from "@/components/toast/AppToast";
import type { QueryClient } from "@tanstack/react-query";
import type { User } from "@/type/user";
import type { PaymentMethod as Method } from "@/type/checkout";
import type { BuyerState, AltState } from "../types/checkout.client";
import { validateCartServerSide as validateCartSrv } from "../validators";
import { cartKeys } from "@/constant/key/cart";
import { PAYMENT_QR } from "@/config/payment";
import type { OrderDetail } from "@/type/order";

export type UseCheckoutFlowParams = {
  
  validateForMethod: (p: {
    method: Method;
    buyer: BuyerState;
    alt: AltState;
    user: User | { email: string } | null;
    isCartLoading: boolean;
    itemsLength: number;
    canChooseDistrict: (c: string) => boolean;
  }) => string | null;
  buyer: BuyerState;
  alt: AltState;
  user: User | { email: string } | null;
  isCartLoading: boolean;
  itemsLength: number;
  canChooseDistrict: (c: string) => boolean;
  qc: QueryClient;
  setGlobalWarnings: (s: string[]) => void;
  setItemWarnings: (m: Record<string, string[]>) => void;
  priceWarnMessage: string;

  
  createSepayCheckoutMut: { mutateAsync: (p: { orderId: string; returnUrl: string }) => Promise<{ checkoutUrl: string; fields: Record<string, string> }> };
  setPendingVietQROrderId: (id: string) => void;
  vietQRAcknowledged: boolean;
  setBankTfTransferNote: (s: string) => void;
  setBankTfOpen: (b: boolean) => void;
  cart: { clear: () => void };
  setLastOrderCodeState: (code?: string) => void;
  setVietQRAcknowledged: (b: boolean) => void;
  setOrderSuccessOpen: (b: boolean) => void;
};

type CreatedOrderMinimal = Pick<OrderDetail, "id" | "orderCode" | "totalAmount"> & { code?: string };

export function useCheckoutFlow(params: UseCheckoutFlowParams) {
  const {
    validateForMethod,
    buyer,
    alt,
    user,
    isCartLoading,
    itemsLength,
    canChooseDistrict,
    qc,
    setGlobalWarnings,
    setItemWarnings,
    priceWarnMessage,
    createSepayCheckoutMut,
    setPendingVietQROrderId,

    setBankTfTransferNote,
    setBankTfOpen,
    cart,
    setLastOrderCodeState,
    setVietQRAcknowledged,
    setOrderSuccessOpen,
  } = params;

  const preSubmitChecks = useCallback(async (currentMethod: Method): Promise<{ ok: boolean; msg?: string }> => {
    const err = validateForMethod({
      method: currentMethod,
      buyer,
      alt,
      user,
      isCartLoading,
      itemsLength,
      canChooseDistrict,
    });
    if (err) return { ok: false, msg: err };
    const { blockedError, globalWarnings: gws, itemWarnings: iws } = await validateCartSrv(qc);
    if (blockedError) {
      try {
        qc.invalidateQueries({ queryKey: cartKeys.root() });
        qc.invalidateQueries({ queryKey: cartKeys.items() });
      } catch {}
      return { ok: false, msg: blockedError };
    }
    if ((gws?.length || Object.keys(iws || {}).length)) {
      setGlobalWarnings(gws || []);
      setItemWarnings(iws || {});
      const hasOnlyPriceWarn = Array.isArray(gws) && gws.length === 1 && gws[0] === priceWarnMessage;
      if (!hasOnlyPriceWarn) {
        showInfoToast({ title: "Giỏ hàng cập nhật", message: "Vui lòng xem lại tóm tắt đơn hàng trước khi thanh toán." });
      }
    } else {
      setGlobalWarnings([]);
      setItemWarnings({});
    }
    return { ok: true };
  }, [validateForMethod, buyer, alt, user, isCartLoading, itemsLength, canChooseDistrict, qc, setGlobalWarnings, setItemWarnings, priceWarnMessage]);

  const afterOrderCreated = useCallback(async (created: CreatedOrderMinimal, usedMethod: Method) => {
    const createdCode: string | null = created?.orderCode ?? created?.code ?? null;
    try { console.debug("[checkout] created order:", created); } catch {}
    try { if (usedMethod === "COD") localStorage.removeItem("cartItems"); } catch {}
    try { sessionStorage.setItem("lastPaymentMethod", usedMethod); } catch {}

    if (usedMethod === "VIETQR") {
      try { sessionStorage.setItem("lastPaymentMethod", "VIETQR"); } catch {}
      try { if (createdCode) sessionStorage.setItem("lastOrderCode", String(createdCode)); } catch {}

      showInfoToast({ title: "Đang chuyển hướng", message: "Đang chuyển hướng đến cổng thanh toán SePay..." });
      
      const res = await createSepayCheckoutMut.mutateAsync({ 
        orderId: created.id,
        returnUrl: window.location.origin
      });

      if (res && res.checkoutUrl && res.fields) {
        
        const form = document.createElement("form");
        form.action = res.checkoutUrl;
        form.method = "POST";
        form.style.display = "none";
        
        Object.entries(res.fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
        return; 
      }
      return;
    }

    if (usedMethod === "BANK_TRANSFER") {
      const note = `${PAYMENT_QR.transferNotePrefix}-${createdCode || created.id}`;
      setBankTfTransferNote(note);
      setPendingVietQROrderId(created.id);
      try { sessionStorage.setItem(`vietqr_ack:${created.id}`, "0"); } catch {}
      setBankTfOpen(true);
      showSuccessToast({ title: "Hướng dẫn chuyển khoản", message: "Đã tạo hướng dẫn. Vui lòng chuyển khoản để hoàn tất." });
      try { if (createdCode) sessionStorage.setItem("lastOrderCode", String(createdCode)); } catch {}
      try { sessionStorage.setItem("lastPaymentMethod", "BANK_TRANSFER"); } catch {}
      return;
    }

    showSuccessToast({ title: "Đặt hàng thành công", message: "Cảm ơn bạn đã mua hàng!" });
    try { sessionStorage.setItem("justCheckedOut", "1"); } catch {}
    try { document.cookie = "justCheckedOut=1; path=/; max-age=180"; } catch {}
    try { if (createdCode) sessionStorage.setItem("lastOrderCode", String(createdCode)); } catch {}
    try { sessionStorage.setItem("lastPaymentMethod", "COD"); } catch {}
    try { localStorage.removeItem("cartItems"); } catch {}
    cart.clear();
    try {
      const code = sessionStorage.getItem("lastOrderCode") || undefined;
      setLastOrderCodeState(code || undefined);
    } catch {}
    setVietQRAcknowledged(false);
    setOrderSuccessOpen(true);
  }, [createSepayCheckoutMut, setPendingVietQROrderId, setBankTfTransferNote, setBankTfOpen, cart, setLastOrderCodeState, setOrderSuccessOpen, setVietQRAcknowledged]);

  return { preSubmitChecks, afterOrderCreated };
}
