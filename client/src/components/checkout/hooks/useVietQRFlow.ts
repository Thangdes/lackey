"use client";

import { useCallback, useEffect, useState } from "react";
import { showSuccessToast, showInfoToast } from "@/components/toast/AppToast";
import { orderService } from "@/service/order.service";

export type VietQRBank = {
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
};

export type VietQRLinkResp = {
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  qrCodeImageUrl?: string;
  url?: string;
};

export function useVietQRFlow() {
  const [vietQRUrl, setVietQRUrl] = useState<string>("");
  const [vietQRTransferNote, setVietQRTransferNote] = useState<string>("");
  const [vietQRBank, setVietQRBank] = useState<VietQRBank>({});
  const [pendingVietQROrderId, setPendingVietQROrderId] = useState<string | null>(null);
  const [showVietQR, setShowVietQR] = useState(false);
  const [vietQRAcknowledged, setVietQRAcknowledged] = useState(false);

  const ackKeyFor = useCallback((orderId: string | null) => (orderId ? `vietqr_ack:${orderId}` : null), []);

  useEffect(() => {
    const key = ackKeyFor(pendingVietQROrderId);
    if (!key) {
      setVietQRAcknowledged(false);
      return;
    }
    try {
      const saved = sessionStorage.getItem(key);
      setVietQRAcknowledged(saved === "1");
    } catch {
      setVietQRAcknowledged(false);
    }
  }, [pendingVietQROrderId, ackKeyFor]);

  const setPendingVietQROrderIdScoped = useCallback((orderId: string | null) => {
    setPendingVietQROrderId(orderId);
    const key = ackKeyFor(orderId);
    if (!key) {
      setVietQRAcknowledged(false);
      return;
    }
    try {
      const saved = sessionStorage.getItem(key);
      setVietQRAcknowledged(saved === "1");
    } catch {
      setVietQRAcknowledged(false);
    }
  }, [ackKeyFor]);

  const setFromLinkResponse = useCallback((linkResp: unknown, _amount: number, note: string) => {
    const lr = (linkResp || {}) as Partial<VietQRLinkResp> & Record<string, unknown>;
    const finalQrUrl = lr.qrCodeImageUrl || lr.url || "";
    setVietQRUrl(finalQrUrl || "");
    setVietQRTransferNote(note);
    setVietQRBank({
      bankCode: lr.bankCode,
      bankName: lr.bankName,
      accountNumber: lr.accountNumber,
      accountName: lr.accountName,
    });
    setShowVietQR(true);
  }, []);

  const copyTransferNote = useCallback(() => {
    try {
      navigator.clipboard.writeText(vietQRTransferNote);
      showSuccessToast({ title: "Đã sao chép", message: "Nội dung đã được sao chép." });
    } catch {}
  }, [vietQRTransferNote]);

  const acknowledge = useCallback(() => {
    try {
      const key = ackKeyFor(pendingVietQROrderId);
      if (key) sessionStorage.setItem(key, "1");
    } catch {}
    setVietQRAcknowledged(true);
    showSuccessToast({ title: "Đã đánh dấu đã chuyển khoản", message: "Bạn có thể bấm Đặt hàng để hoàn tất." });
  }, [pendingVietQROrderId, ackKeyFor]);

  const cancelPending = useCallback(async () => {
    const orderId = pendingVietQROrderId;
    setShowVietQR(false);
    setVietQRAcknowledged(false);
    try {
      const key = ackKeyFor(orderId);
      if (key) sessionStorage.setItem(key, "0");
    } catch {}
    setPendingVietQROrderId(null);
    if (orderId) {
      try {
        let code: string | undefined = undefined;
        try {
          const c = sessionStorage.getItem("lastOrderCode");
          if (c) code = c;
        } catch {}
        await orderService.cancel(orderId, code);
        showInfoToast({ title: "Đã hủy đơn hàng đang chờ", message: "Giỏ hàng của bạn vẫn được giữ lại." });
      } catch {}
    }
  }, [pendingVietQROrderId, ackKeyFor]);

  return {
    vietQRUrl,
    vietQRTransferNote,
    vietQRBank,
    pendingVietQROrderId,
    setPendingVietQROrderId: setPendingVietQROrderIdScoped,
    showVietQR,
    setShowVietQR,
    vietQRAcknowledged,
    setVietQRAcknowledged,
    setFromLinkResponse,
    copyTransferNote,
    acknowledge,
    cancelPending,
  };
}
