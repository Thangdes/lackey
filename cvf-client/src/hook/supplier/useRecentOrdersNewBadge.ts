"use client";
import { useEffect, useState } from "react";
import { supplierDashboardService } from "@/service/supplier-dashboard.service";

export function useRecentOrdersNewBadge(pollMs: number = 30000) {
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const rec = await supplierDashboardService.recentOrders();
        const newest = (Array.isArray(rec) ? rec : [])
          .map((o) => new Date(o.createdAt).getTime())
          .sort((a, b) => b - a)[0];
        if (newest) {
          try {
            const lastSeen = localStorage.getItem("supplier:lastOrderAt");
            if (lastSeen && newest > Number(lastSeen)) setHasNew(true);
          } catch {}
        }
      } finally {
        if (!alive) return;
        timer = setTimeout(poll, Math.max(5000, pollMs));
      }
    };
    poll();
    return () => { alive = false; if (timer) clearTimeout(timer); };
  }, [pollMs]);

  return hasNew;
}
