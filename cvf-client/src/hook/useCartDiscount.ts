"use client";

import { useState, useCallback } from "react";
import { useSmartCart } from "@/hook/useCart";
import { useDiscount } from "@/hook/useDiscount";
import { toast } from "sonner";

export type CartDiscountState = {
  options: Array<{ code: string; description?: string | null }>;
  selectedCode: string;
  appliedCode: string | null;
  discountAmount: number;
  applyingDiscount: boolean;
  onSelect: (code: string) => Promise<void>;
  onClear: () => Promise<void>;
};

export function useCartDiscount(subtotal?: number): CartDiscountState {
  const cart = useSmartCart();
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const { options } = useDiscount(subtotal || 0);
  
  const appliedCode = cart.appliedDiscount?.code || null;
  const discountAmount = Number(cart.totals?.discount || 0);
  
  const selectedCode = appliedCode || "";

  const onSelect = useCallback(async (code: string) => {
    if (!code) return;
    setApplyingDiscount(true);
    try {
      await cart.applyDiscountAsync?.(code);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Không thể áp dụng mã giảm giá";
      toast.error(msg);
      console.error("[CART_DISCOUNT] Error applying discount:", error);
    } finally {
      setApplyingDiscount(false);
    }
  }, [cart]);

  const onClear = useCallback(async () => {
    setApplyingDiscount(true);
    try {
      await cart.removeDiscountAsync?.();
      toast.success("Đã xóa mã giảm giá");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Không thể xóa mã giảm giá";
      toast.error(msg);
      console.error("[CART_DISCOUNT] Error removing discount:", error);
    } finally {
      setApplyingDiscount(false);
    }
  }, [cart]);

  return {
    options,
    selectedCode,
    appliedCode,
    discountAmount,
    applyingDiscount,
    onSelect,
    onClear,
  } as const;
}
