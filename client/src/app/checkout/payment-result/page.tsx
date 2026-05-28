"use client";

import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSmartCart } from "@/hook/useCart";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function PaymentResultContent() {

  const searchParams = useSearchParams();
  const cart = useSmartCart();
  
  const result = searchParams?.get("result");
  const orderCode = searchParams?.get("orderCode");
  const clearedRef = useRef(false);

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
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
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
        <div className="flex gap-4 justify-center">
          <Link 
            href={`/checkout`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Thử lại
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
        Đã có lỗi xảy ra trong quá trình thanh toán đơn hàng {orderCode}. Vui lòng thử lại sau.
      </p>
      <Link 
        href={`/checkout`}
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Thử lại
      </Link>
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
