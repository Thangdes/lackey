"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ManualTracking(props: { defaultCarrier?: string; defaultTracking?: string }) {
  const { defaultCarrier, defaultTracking } = props;

  const [carrier, setCarrier] = useState<string>(defaultCarrier || "tramavandon-spx");
  const [trackingNumber, setTrackingNumber] = useState<string>(defaultTracking || "");

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
    const text = `Mã vận đơn: ${trackingNumber}\nĐơn vị: ${carrier}\nTra cứu: ${url}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Đã copy thông tin tra cứu!");
    } catch {}
  }, [trackingNumber, carrier, buildExternalUrl]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 space-y-3">
      <div className="text-sm font-medium">Theo dõi vận chuyển</div>
      <div className="text-[12px] text-black/60 -mt-1">Tự động lấy dữ liệu từ bên thứ ba và hiển thị hành trình.</div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/60 w-20">Đơn vị</span>
          <Select value={carrier} onValueChange={setCarrier}>
            <SelectTrigger className="h-8">
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-black/60 w-20">Mã vận đơn</span>
          <input className="h-8 rounded border px-2 py-1 text-xs flex-1" value={trackingNumber} onChange={(e)=>setTrackingNumber(e.target.value)} placeholder="VD: SPXVNxxxxx" />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" className="text-xs" onClick={() => {
            if (!trackingNumber) return toast.error("Nhập mã vận đơn");
            const url = buildExternalUrl();
            window.open(url, "_blank", "noopener,noreferrer");
          }}>Mở trang tra cứu</Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" className="text-xs" onClick={handleCopy} disabled={!trackingNumber}>Copy hành trình</Button>
      </div>
    </div>
  );
}
