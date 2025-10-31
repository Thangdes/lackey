"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ADMIN_UPDATABLE_STATUSES, statusDescription, statusLabel } from "@/constant/order-status";
import { orderService } from "@/service/order.service";
import { useQueryClient } from "@tanstack/react-query";
import { orderKeys as keys } from "@/constant/key/order";

export type BulkActionsProps = {
  selectedIds: string[];
  value: string;
  onValueChange: (v: string) => void;
};

export default function BulkActions(props: BulkActionsProps) {
  const { selectedIds, value, onValueChange } = props;
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const canRun = useMemo(() => selectedIds.length > 0 && !!value, [selectedIds, value]);

  const handleStatusChange = useCallback((v: string) => {
    onValueChange(v);
  }, [onValueChange]);

  const handleApply = useCallback(async () => {
    if (!canRun) return;
    setLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => orderService.updateStatus(id, { status: value })));
      await qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "orders" && q.queryKey[1] === "list" });
      selectedIds.forEach((id) => qc.invalidateQueries({ queryKey: keys.byId(id) }));
    } finally {
      setLoading(false);
    }
  }, [canRun, qc, selectedIds, value]);

  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-black/70">Đã chọn: <span className="font-semibold">{selectedIds.length}</span></div>
      <Select value={value} onValueChange={handleStatusChange}>
        <SelectTrigger className="min-w-[220px]" title={statusDescription(value)}>
          <SelectValue placeholder="Chọn trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_UPDATABLE_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" variant="outline" disabled={!canRun || loading} onClick={handleApply} title={!canRun ? "Chọn ít nhất 1 đơn và trạng thái" : undefined}>
        {loading ? "Đang cập nhật..." : (selectedIds.length > 0 ? `Cập nhật ${selectedIds.length} đơn` : "Cập nhật")}
      </Button>
    </div>
  );
}
