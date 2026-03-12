"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { shippingService } from "@/service/shipping.service";
import { toast } from "sonner";

export default function GhnTrackingPanel(props: { orderId: string; deliveryCode?: string | null }) {
  const { orderId, deliveryCode } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<unknown>(null);

  const hasCode = Boolean(String(deliveryCode || "").trim());

  const pretty = useMemo(() => {
    if (!data) return "";
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  const fetchTracking = async () => {
    if (!hasCode) return toast.error("Đơn chưa có mã vận đơn");
    setLoading(true);
    try {
      const res = await shippingService.getGhnTracking(orderId);
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "");
      toast.error(msg || "Không thể lấy tracking GHN");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(null);
  }, [orderId, deliveryCode]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">GHN Tracking</div>
        <Button type="button" size="sm" className="text-xs" variant="outline" onClick={fetchTracking} disabled={loading || !hasCode}>
          {loading ? "Đang tải..." : "Lấy tracking"}
        </Button>
      </div>
      {!hasCode ? (
        <div className="text-xs text-black/60">Chưa có mã vận đơn GHN.</div>
      ) : null}
      {pretty ? (
        <pre className="max-h-[360px] overflow-auto rounded-lg bg-black/[0.03] p-3 text-[11px] leading-relaxed">{pretty}</pre>
      ) : (
        <div className="text-xs text-black/60">Nhấn &quot;Lấy tracking&quot; để xem dữ liệu.</div>
      )}
    </div>
  );
}
