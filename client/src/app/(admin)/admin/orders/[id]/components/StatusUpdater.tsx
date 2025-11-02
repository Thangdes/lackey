"use client";
import React, { useCallback, useState } from "react";
import { ADMIN_UPDATABLE_STATUSES, statusDescription, statusLabel } from "@/constant/order-status";
import { useUpdateOrderStatus } from "@/hook/useOrder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export type StatusUpdaterProps = {
  orderId: string;
  currentStatus: string;
};

export default function StatusUpdater({ orderId, currentStatus }: StatusUpdaterProps) {
  const [value, setValue] = useState<string>(currentStatus);
  const updateStatus = useUpdateOrderStatus(orderId);

  const handleChange = useCallback((v: string) => {
    setValue(v);
  }, []);

  const handleSave = useCallback(() => {
    updateStatus.mutate({ status: value });
  }, [updateStatus, value]);

  return (
    <div className="flex gap-2 items-center">
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="min-w-[220px]" title={statusDescription(value || currentStatus)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_UPDATABLE_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" size="sm" className="text-xs" disabled={updateStatus.isPending || value === currentStatus} onClick={handleSave}>
        {updateStatus.isPending ? "Đang lưu..." : "Lưu"}
      </Button>
    </div>
  );
}
