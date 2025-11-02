"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useUpdateDeliveryCode, useUpdateOrderStatus } from "@/hook/useOrder";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type DeliveryCodeUpdaterProps = {
  orderId: string;
  initialCode?: string;
  currentStatus?: string;
};

export default function DeliveryCodeUpdater({ orderId, initialCode, currentStatus }: DeliveryCodeUpdaterProps) {
  const [value, setValue] = useState<string>(initialCode || "");
  const [open, setOpen] = useState(false);
  const updateCode = useUpdateDeliveryCode(orderId);
  const updateStatus = useUpdateOrderStatus(orderId);
  const statusUpper = String(currentStatus || "").toUpperCase();

  useEffect(() => {
    if (typeof initialCode === "string" && !value) setValue(initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const performUpdate = useCallback(async () => {
    try {
      // Ensure allowed status before updating delivery code
      const allowed = statusUpper === "CONFIRMED" || statusUpper === "PREPARING_SHIPMENT";
      if (!allowed) {
        try {
          await updateStatus.mutateAsync({ status: "CONFIRMED" });
        } catch {
          // If cannot set to CONFIRMED, try PREPARING_SHIPMENT as fallback
          await updateStatus.mutateAsync({ status: "PREPARING_SHIPMENT" });
        }
      }

      const code = String(value || "").trim();
      if (!code) return;
      const updated = await updateCode.mutateAsync(code);
      const nextStatus = String((updated as unknown as { status?: string })?.status || "").toUpperCase();
      // FE only: thông báo đã bàn giao vận chuyển khi backend trả về SHIPPED
      if (nextStatus === "SHIPPED") {
        toast.success("Đã cập nhật mã vận chuyển • Trạng thái: Đã bàn giao vận chuyển");
      } else {
        toast.success("Đã cập nhật mã vận chuyển");
      }
      setOpen(false);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err ?? "");
      let msg = "Cập nhật mã vận chuyển thất bại";
      const lower = raw.toLowerCase();
      if (lower.includes("unique constraint") || lower.includes("delivery_code") || lower.includes("p2002")) {
        msg = "Mã vận chuyển đã tồn tại. Vui lòng dùng mã khác.";
      } else if (lower.includes("must be in confirmed") || lower.includes("preparing_shipment")) {
        msg = "Chỉ có thể nhập mã khi đơn ở trạng thái Đã xác nhận/Chuẩn bị giao.";
      } else if (raw) {
        msg = raw;
      }
      toast.error(msg);
    }
  }, [updateCode, updateStatus, value, statusUpper]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-center">
        <input className="rounded border px-2 py-1 text-xs" placeholder="Nhập mã vận chuyển" value={value} onChange={handleChange} />
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button type="button" size="sm" variant="outline" className="text-xs" disabled={updateCode.isPending || !value}>
              {updateCode.isPending ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận cập nhật mã vận chuyển</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này sẽ lưu mã vận chuyển vào hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={performUpdate}>Xác nhận</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="text-[11px] text-black/60">Nhấn &quot;Cập nhật&quot; sẽ lưu mã vận chuyển. Hệ thống sẽ chuyển trạng thái sang &quot;Chuẩn bị giao&quot; nếu cần.</div>
      {/* {initialCode ? (
        <div className="text-[11px] text-black/50">Mã hiện tại: {initialCode}</div>
      ) : null} */}
    </div>
  );
}
