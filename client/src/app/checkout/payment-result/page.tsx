"use client";

import { useEffect, Suspense, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSmartCart } from "@/hook/useCart";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { sepayService } from "@/service/sepay.service";
import { orderService } from "@/service/order.service";
import { cartService } from "@/service/cart.service";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/constant/key/cart";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useSmartCart();
  const qc = useQueryClient();
  
  const result = searchParams?.get("result");
  const orderCode = searchParams?.get("orderCode");
  const orderId = searchParams?.get("orderId");
  
  const clearedRef = useRef(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (result === "success" && !clearedRef.current) {
      clearedRef.current = true;
      try { localStorage.removeItem("cartItems"); } catch {}
      cart.clear();
      if (orderCode) {
        try { sessionStorage.setItem("lastOrderCode", orderCode); } catch {}
      }
    }
  }, [result, orderCode, cart]);

  const handleRepay = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await sepayService.createCheckout({
        orderId,
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
      }
    } catch {
      showErrorToast({ title: "Lỗi", message: "Không thể kết nối với cổng thanh toán SePay. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const handleCancelAndReorder = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const order = await orderService.getById(orderId);
      if (order && order.orderItems) {
        const cartItemsPayload = order.orderItems.map(item => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity || 1
        }));
        await cartService.bulkSet(cartItemsPayload);
      }
      await orderService.cancel(orderId, orderCode || undefined);
      await qc.invalidateQueries({ queryKey: cartKeys.root() });
      router.push("/checkout");
      showSuccessToast({ title: "Đã phục hồi giỏ hàng", message: "Bạn có thể tiến hành đặt hàng lại." });
    } catch {
      showErrorToast({ title: "Lỗi", message: "Không thể phục hồi giỏ hàng." });
    } finally {
      setLoading(false);
    }
  }, [orderId, orderCode, qc, router]);

  if (result === "success") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-8">
          Đơn hàng {orderCode} của bạn đã được thanh toán. Cảm ơn bạn đã mua sắm.
        </p>
        <Link 
          href={`/profile?section=orders`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition w-full"
        >
          Xem đơn hàng
        </Link>
      </div>
    );
  }

  if (result === "cancel") {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã hủy thanh toán</h1>
        <p className="text-gray-600 mb-8">
          Bạn đã hủy quá trình thanh toán cho đơn hàng {orderCode}.
        </p>
        <div className="flex flex-col gap-3">
          {orderId && (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={handleRepay}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Thanh toán lại
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCancelAndReorder}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Hủy đơn & Mua lại
              </button>
            </>
          )}
          <Link 
            href="/"
            className="inline-block border border-transparent text-gray-500 px-6 py-2 rounded-lg text-sm hover:text-gray-700 transition mt-2"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
      <p className="text-gray-600 mb-8">
        Đã có lỗi xảy ra trong quá trình thanh toán đơn hàng {orderCode || orderId}. Vui lòng thử lại.
      </p>
      <div className="flex flex-col gap-3">
        {orderId && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={handleRepay}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Thanh toán lại
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCancelAndReorder}
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Hủy đơn & Mua lại
            </button>
          </>
        )}
        <Link 
          href="/"
          className="inline-block border border-transparent text-gray-500 px-6 py-2 rounded-lg text-sm hover:text-gray-700 transition mt-2"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>}>
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
