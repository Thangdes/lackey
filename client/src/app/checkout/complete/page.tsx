"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { cartService } from "@/service/cart.service";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/constant/key/cart";
import { useSepayStatus } from "@/hook/useSepay";

export default function CheckoutCompletePage() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const [ready, setReady] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  const shouldPollSepay = Boolean(orderCode && String(lastMethod || "").toUpperCase() === "VIETQR");
  const { data: sepayStatus } = useSepayStatus(orderCode || undefined, shouldPollSepay);

  useEffect(() => {
    let allowed = false;
    let lastCode: string | null = null;
    let lastMethod: string | null = null;
    try {
      const flag = sessionStorage.getItem("justCheckedOut");
      lastCode = sessionStorage.getItem("lastOrderCode");
      lastMethod = sessionStorage.getItem("lastPaymentMethod");
      allowed = flag === "1" || !!lastCode;
      sessionStorage.removeItem("justCheckedOut");
    } catch {}
    if (!allowed) {
      setInvalid(true);
      setReady(true);
      return;
    }
    setOrderCode(lastCode);
    setLastMethod(lastMethod);
    try { localStorage.removeItem("cartItems"); } catch {}
    try { document.cookie = "justCheckedOut=; path=/; max-age=0"; } catch {}
    (async () => {
      try {
        // Only clear server cart immediately for COD.
        if (lastMethod === "COD") {
          await cartService.clear();
          try { qc.setQueryData(cartKeys.root(), { items: [] }); } catch {}
        }
        try {
          qc.invalidateQueries({ queryKey: cartKeys.root() });
          qc.invalidateQueries({ queryKey: cartKeys.items() });
        } catch {}
      } catch {}
    })();
    setReady(true);
  }, [router, qc]);

  if (!ready) return null;

  if (invalid) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-20 md:px-6 lg:px-8 mt-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Trang này chỉ hiển thị sau khi đặt hàng thành công</h1>
          <p className="mt-2 text-black/70">Vui lòng quay về trang chủ hoặc giỏ hàng để tiếp tục mua sắm.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90">Về trang chủ</Link>
            <Link href="/cart" className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-black/5">Về giỏ hàng</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-20 md:px-6 lg:px-8 mt-24">
      <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-8 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Đơn hàng đã được ghi nhận</h1>
        <p className="mt-2 text-black/70">Đơn hàng đã được tạo thành công. Nếu bạn chuyển khoản, hệ thống sẽ tự xác nhận sau khi SePay nhận được giao dịch.</p>
        {orderCode ? (
          <p className="mt-1 text-sm text-black/60">Mã đơn hàng: <span className="font-medium">{orderCode}</span></p>
        ) : null}

        {shouldPollSepay ? (
          <div className="mt-3 text-sm">
            {String(sepayStatus?.paymentStatus || "").toUpperCase() === "SUCCESS" ? (
              <div className="text-emerald-700">Thanh toán đã xác nhận</div>
            ) : (
              <div className="text-amber-700">Đang chờ xác nhận thanh toán...</div>
            )}
          </div>
        ) : null}
        {!user ? (
          <p className="mt-2 text-sm text-black/60">Đơn hàng sẽ được cập nhật qua email. Bạn có thể đăng ký bằng email của mình để xem đơn hàng trên website.</p>
        ) : (
          <p className="mt-2 text-sm text-black/60">Bạn sẽ nhận thông báo cập nhật qua email và có thể xem chi tiết tại trang Đơn hàng.</p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/orders" className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90">Xem đơn hàng của tôi</Link>
          <Link href="/" className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-black/5">Về trang chủ</Link>
          <Link href="/cart" className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-black/5">Về giỏ hàng</Link>
        </div>
      </div>
    </div>
  );
}
