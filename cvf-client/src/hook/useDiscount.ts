"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { discountService } from "@/service/discount.service";

export function useDiscount(subtotal: number) {
  const [options, setOptions] = useState<Array<{ code: string; description?: string | null }>>([]);
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const list = await discountService.activeList();
        if (!ignore) setOptions(list.map(d => ({ code: d.code, description: d.description ?? null })));
      } catch (e: unknown) {
        if (!ignore) {
          setOptions([]);
          try {
            const msg = e instanceof Error ? e.message : "Không thể tải danh sách mã giảm giá";
            toast.error(translateDiscountError(msg));
          } catch {}
        }
      }
    })();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!appliedCode) return;
      try {
        const res = await discountService.validate(appliedCode, subtotal);
        if (!ignore) setDiscountAmount(Number(res.discountAmount) || 0);
      } catch {
        if (!ignore) {
          setAppliedCode(null);
          setDiscountAmount(0);
          try { toast.info("Mã giảm giá không còn áp dụng cho tổng phụ hiện tại."); } catch {}
        }
      }
    })();
    return () => { ignore = true; };
  }, [subtotal, appliedCode]);

  async function onSelect(code: string) {
    setSelectedCode(code);
    if (!code) {
      setAppliedCode(null);
      setDiscountAmount(0);
      return;
    }
    setApplyingDiscount(true);
    try {
      const res = await discountService.validate(code, subtotal);
      setAppliedCode(res.code);
      setDiscountAmount(Number(res.discountAmount) || 0);
      toast.success("Áp dụng mã giảm giá thành công");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Mã giảm giá không hợp lệ";
      toast.error(translateDiscountError(msg));
      setAppliedCode(null);
      setDiscountAmount(0);
    } finally {
      setApplyingDiscount(false);
    }
  }

  function onClearDiscount() {
    setSelectedCode("");
    setAppliedCode(null);
    setDiscountAmount(0);
  }

  return {
    options,
    selectedCode,
    appliedCode,
    discountAmount,
    applyingDiscount,
    onSelect,
    onClearDiscount,
  } as const;
}

function translateDiscountError(msg: string): string {
  const lower = msg.toLowerCase();
  const minSubtotalMatch = lower.match(/subtotal.*at least\s*(\d+)/);
  if (minSubtotalMatch) {
    const amount = minSubtotalMatch[1];
    return `Tổng phụ đơn hàng phải tối thiểu ${Number(amount).toLocaleString("vi-VN")} để sử dụng mã này.`;
  }
  if (lower.includes("expired") || lower.includes("end date") || lower.includes("out of date")) {
    return "Mã giảm giá đã hết hạn.";
  }
  if (lower.includes("not started") || lower.includes("start date")) {
    return "Mã giảm giá chưa bắt đầu hiệu lực.";
  }
  if (lower.includes("inactive") || lower.includes("disabled")) {
    return "Mã giảm giá hiện không hoạt động.";
  }
  if (lower.includes("invalid code") || lower.includes("invalid") || lower.includes("not found")) {
    return "Mã giảm giá không hợp lệ.";
  }
  if (lower.includes("usage limit") || lower.includes("limit exceeded") || lower.includes("already used")) {
    return "Mã giảm giá đã vượt quá số lần sử dụng.";
  }
  if (!msg || msg.trim() === "") return "Có lỗi xảy ra khi áp dụng mã giảm giá.";
  return msg;
}
