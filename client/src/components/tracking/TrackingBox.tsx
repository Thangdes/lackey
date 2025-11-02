"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function TrackingBox(props: { orderId: string; defaultCarrier?: string; defaultTracking?: string }) {
  const { orderId, defaultCarrier, defaultTracking } = props;

  const [carrier, setCarrier] = useState<string>(defaultCarrier || "tramavandon-spx");
  const [trackingNumber, setTrackingNumber] = useState<string>(defaultTracking || "");

  useEffect(() => {
    const key = `order_tracking:${orderId}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const obj = JSON.parse(raw) as { carrier?: string; trackingNumber?: string };
        if (obj?.carrier) setCarrier(obj.carrier);
        if (obj?.trackingNumber) setTrackingNumber(obj.trackingNumber);
      }
    } catch {}
  }, [orderId]);

  useEffect(() => {
    const key = `order_tracking:${orderId}`;
    try {
      const obj = { carrier, trackingNumber, updatedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(obj));
    } catch {}
  }, [orderId, carrier, trackingNumber]);

  const buildExternalUrl = useCallback(() => {
    if (carrier === "tramavandon-spx") return `https://tramavandon.com/spx/?tracking_number=${encodeURIComponent(trackingNumber)}`;
    if (carrier === "spx-vn") return `https://spx.vn/m/tracking-detail/${encodeURIComponent(trackingNumber)}?verify=0&from=home`;
    if (carrier === "ghtk") return `https://i.ghtk.vn/services/tracking?code=${encodeURIComponent(trackingNumber)}`;
    if (carrier === "ghn") return `https://donhang.ghn.vn/?order_code=${encodeURIComponent(trackingNumber)}`;
    if (carrier === "vnpost") return `https://track.vnpost.vn/?code=${encodeURIComponent(trackingNumber)}`;
    return `https://www.google.com/search?q=${encodeURIComponent("tra cứu vận đơn " + trackingNumber)}`;
  }, [carrier, trackingNumber]);

  const handleCopy = useCallback(async () => {
    if (!trackingNumber) return toast.error("Nhập mã vận đơn");
    const url = buildExternalUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã copy liên kết tra cứu!");
    } catch {}
  }, [trackingNumber, buildExternalUrl]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
      <div className="text-sm font-medium">Theo dõi vận chuyển</div>
      <div className="text-[12px] text-black/60 -mt-1">Tự động lấy dữ liệu từ bên thứ ba và hiển thị hành trình.</div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60">Đơn vị</label>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tramavandon-spx">Trạm vận đơn (SPX)</SelectItem>
              <SelectItem value="spx-vn">Shopee Express (spx-vn)</SelectItem>
              <SelectItem value="ghn">GHN</SelectItem>
              <SelectItem value="ghtk">GHTK</SelectItem>
              <SelectItem value="vnpost">VNPost</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60">Mã vận đơn</label>
          <input className="h-8 rounded border px-2 py-1 text-xs w-full" value={trackingNumber} onChange={(e)=>setTrackingNumber(e.target.value)} placeholder="VD: SPXVNxxxxx" />
        </div>
        <div className="flex items-center md:justify-end">
          <Button type="button" size="sm" className="text-xs w-full md:w-auto" onClick={() => {
            if (!trackingNumber) return toast.error("Nhập mã vận đơn");
            const url = buildExternalUrl();
            window.open(url, "_blank", "noopener,noreferrer");
          }}>Mở trang tra cứu</Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" className="text-xs" onClick={handleCopy} disabled={!trackingNumber}>Copy link tra cứu</Button>
      </div>
    </div>
  );
}
