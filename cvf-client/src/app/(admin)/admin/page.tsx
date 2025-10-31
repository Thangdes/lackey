"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Calendar, CalendarRange, RotateCcw, Check, BarChart3, LineChart as LineChartIcon, Download, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { dashboardService } from "@/service/dashboard.service";
import type { DashboardStats, RevenuePoint, TopProduct } from "@/type/dashboard";
import { DASHBOARD_TEXT as T } from "@/constant/dashboard";
import { LineChart as RLineChart, BarChart as RBarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const d30 = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
  const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const startOfQuarter = (d: Date) => {
    const qStartMonth = Math.floor(d.getMonth() / 3) * 3;
    return new Date(d.getFullYear(), qStartMonth, 1);
  };
  const endOfQuarter = (d: Date) => {
    const qStartMonth = Math.floor(d.getMonth() / 3) * 3;
    return new Date(d.getFullYear(), qStartMonth + 3, 0);
  };

  const [startDate, setStartDate] = useState<string>(fmt(d30));
  const [endDate, setEndDate] = useState<string>(fmt(today));
  const [draftStart, setDraftStart] = useState<string>(fmt(d30));
  const [draftEnd, setDraftEnd] = useState<string>(fmt(today));

  const isInvalid = useMemo(() => draftStart > draftEnd, [draftStart, draftEnd]);
  const isDirty = useMemo(() => draftStart !== startDate || draftEnd !== endDate, [draftStart, draftEnd, startDate, endDate]);
  const activePreset = useMemo(() => {
    const t = fmt(today);
    const d7 = fmt(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000));
    const d30s = fmt(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000));
    const mS = fmt(startOfMonth(today));
    const mE = fmt(endOfMonth(today));
    const qS = fmt(startOfQuarter(today));
    const qE = fmt(endOfQuarter(today));
    if (draftStart === t && draftEnd === t) return "today";
    if (draftStart === d7 && draftEnd === t) return "7d";
    if (draftStart === d30s && draftEnd === t) return "30d";
    if (draftStart === mS && draftEnd === mE) return "month";
    if (draftStart === qS && draftEnd === qE) return "quarter";
    return undefined;
  }, [draftStart, draftEnd, today]);

  useEffect(() => {
    const urlStart = searchParams.get("start");
    const urlEnd = searchParams.get("end");
    let s = urlStart || (typeof window !== "undefined" ? localStorage.getItem("adminDashStart") || undefined : undefined);
    let e = urlEnd || (typeof window !== "undefined" ? localStorage.getItem("adminDashEnd") || undefined : undefined);
    if (!s || !e) {
      s = fmt(d30);
      e = fmt(today);
    }
    setStartDate(s);
    setEndDate(e);
    setDraftStart(s);
    setDraftEnd(e);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [agg, setAgg] = useState<"day" | "week" | "month">("day");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [smooth, setSmooth] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshMs, setRefreshMs] = useState<number>(30000);

  const applyRange = () => {
    setStartDate(draftStart);
    setEndDate(draftEnd);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminDashStart", draftStart);
      localStorage.setItem("adminDashEnd", draftEnd);
    }
    const qp = new URLSearchParams(searchParams.toString());
    qp.set("start", draftStart);
    qp.set("end", draftEnd);
    router.replace(`/admin?${qp.toString()}`);
  };

  const statsQ = useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats", startDate, endDate],
    queryFn: () => dashboardService.stats({ startDate, endDate }),
    placeholderData: { revenue: 0, totalOrders: 0, newCustomersCount: 0, averageOrderValue: 0 },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const revenueQ = useQuery<RevenuePoint[]>({
    queryKey: ["dashboard", "revenue-over-time", startDate, endDate, agg],
    queryFn: () => dashboardService.revenueOverTime({ startDate, endDate, groupBy: agg }),
    placeholderData: [],
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const topProductsQ = useQuery<TopProduct[]>({
    queryKey: ["dashboard", "top-products", startDate, endDate],
    queryFn: () => dashboardService.topProducts({ startDate, endDate }),
    placeholderData: [],
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });

  const stats = statsQ.data || { revenue: 0, totalOrders: 0, newCustomersCount: 0, averageOrderValue: 0 };
  const topProducts = Array.isArray(topProductsQ.data) ? topProductsQ.data : [];

  const displayData = useMemo(() => {
    const revenueOverTime = Array.isArray(revenueQ.data) ? revenueQ.data : [];
    const parseDate = (s: string) => new Date(s);
    const startOfWeek = (d: Date) => {
      const dd = new Date(d);
      const day = (dd.getDay() + 6) % 7; 
      dd.setDate(dd.getDate() - day);
      dd.setHours(0, 0, 0, 0);
      return dd;
    };
    const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
    const fmtDay = (d: Date) => d.toISOString().slice(0, 10);
    const fmtWeek = (d: Date) => fmtDay(startOfWeek(d));
    const fmtMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const labelDay = (d: Date) => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    const labelWeek = (d: Date) => `Tuần ${d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}`;
    const labelMonth = (d: Date) => d.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });

    const map = new Map<string, { date: string; label: string; revenue: number; _d: Date }>();
    for (const r of revenueOverTime) {
      const d = parseDate(r.date);
      let key: string;
      let label: string;
      if (agg === "week") {
        const w = startOfWeek(d);
        key = fmtWeek(d);
        label = labelWeek(w);
        map.set(key, { date: w.toISOString(), label, revenue: (map.get(key)?.revenue || 0) + r.revenue, _d: w });
      } else if (agg === "month") {
        const m = startOfMonth(d);
        key = fmtMonth(d);
        label = labelMonth(m);
        map.set(key, { date: m.toISOString(), label, revenue: (map.get(key)?.revenue || 0) + r.revenue, _d: m });
      } else {
        key = fmtDay(d);
        label = labelDay(d);
        map.set(key, { date: d.toISOString(), label, revenue: (map.get(key)?.revenue || 0) + r.revenue, _d: d });
      }
    }
    const arr = Array.from(map.values()).sort((a, b) => a._d.getTime() - b._d.getTime());
    if (chartType === "line" && smooth && arr.length > 2) {
      const win = 3;
      const sm = arr.map((_, i) => {
        const s = Math.max(0, i - Math.floor(win / 2));
        const e = Math.min(arr.length, s + win);
        const slice = arr.slice(s, e);
        const avg = slice.reduce((t, x) => t + x.revenue, 0) / slice.length;
        return { ...arr[i], revenue: Math.round(avg) };
      });
      return sm;
    }
    return arr;
  }, [revenueQ.data, agg, chartType, smooth]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      revenueQ.refetch();
      statsQ.refetch();
      topProductsQ.refetch();
    }, Math.max(5000, refreshMs));
    return () => clearInterval(id);
  }, [autoRefresh, refreshMs, startDate, endDate, revenueQ, statsQ, topProductsQ]);

  const nf = new Intl.NumberFormat("vi-VN");
  const cf = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{T.title}</h1>
          <p className="text-sm text-muted-foreground">{T.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground">{T.from}</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm"
            value={draftStart}
            onChange={(e) => setDraftStart(e.target.value)}
            max={draftEnd}
          />
          <label className="text-xs text-muted-foreground">{T.to}</label>
          <input
            type="date"
            className="rounded border px-2 py-1 text-sm"
            value={draftEnd}
            onChange={(e) => setDraftEnd(e.target.value)}
            min={draftStart}
            max={fmt(today)}
          />
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${activePreset === 'today' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => { const t=today; setDraftStart(fmt(t)); setDraftEnd(fmt(t)); }}
            ><Calendar className="size-3.5" /> {T.presets.today}</button>
            <button
              type="button"
              className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${activePreset === '7d' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => { const t=today; const s=new Date(t.getTime()-6*24*60*60*1000); setDraftStart(fmt(s)); setDraftEnd(fmt(t)); }}
            ><CalendarRange className="size-3.5" /> {T.presets.last7}</button>
            <button
              type="button"
              className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${activePreset === '30d' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => { const t=today; const s=new Date(t.getTime()-29*24*60*60*1000); setDraftStart(fmt(s)); setDraftEnd(fmt(t)); }}
            ><CalendarRange className="size-3.5" /> {T.presets.last30}</button>
            <button
              type="button"
              className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${activePreset === 'month' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => { const s=startOfMonth(today); const e=endOfMonth(today); setDraftStart(fmt(s)); setDraftEnd(fmt(e)); }}
            ><Calendar className="size-3.5" /> {T.presets.thisMonth}</button>
            <button
              type="button"
              className={`px-2 py-1 text-xs rounded border inline-flex items-center gap-1 ${activePreset === 'quarter' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => { const s=startOfQuarter(today); const e=endOfQuarter(today); setDraftStart(fmt(s)); setDraftEnd(fmt(e)); }}
            ><Calendar className="size-3.5" /> {T.presets.thisQuarter}</button>
          </div>
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded border inline-flex items-center gap-1 ${(!isDirty || isInvalid) ? 'opacity-50 cursor-not-allowed' : 'bg-black text-white'}`}
            onClick={applyRange}
            disabled={!isDirty || isInvalid}
            title={!isDirty ? T.validation.unchanged : isInvalid ? T.validation.invalidRange : T.apply}
          ><Check className="size-4" /> {T.apply}</button>
          <button
            type="button"
            className="px-3 py-1.5 text-sm rounded border inline-flex items-center gap-1"
            onClick={() => { const t=today; const s=new Date(t.getTime()-29*24*60*60*1000); setDraftStart(fmt(s)); setDraftEnd(fmt(t)); }}
            title="Đặt lại về 30 ngày gần nhất"
          ><RotateCcw className="size-4" /> {T.reset}</button>
          {isInvalid && (
            <span className="text-xs text-red-600">{T.validation.invalidRange}</span>
          )}
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsQ.isLoading ? (
          [1,2,3,4].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
              <div className="h-3 w-24 bg-black/10 rounded" />
              <div className="h-7 w-28 bg-black/10 rounded mt-3" />
            </div>
          ))
        ) : (
          <>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{T.cards.revenue}</p>
              <p className="mt-2 text-2xl font-semibold">{cf.format(stats.revenue)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{T.cards.totalOrders}</p>
              <p className="mt-2 text-2xl font-semibold">{nf.format(stats.totalOrders)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{T.cards.newCustomers}</p>
              <p className="mt-2 text-2xl font-semibold">{nf.format(stats.newCustomersCount)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">{T.cards.averageOrderValue}</p>
              <p className="mt-2 text-2xl font-semibold">{cf.format(stats.averageOrderValue)}</p>
            </div>
          </>
        )}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-medium flex items-center gap-2">
            <CalendarRange className="size-4" /> {T.sections.revenueOverTime}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Nhóm:</span>
              <button className={`px-2 py-0.5 rounded border text-xs ${agg==='day'?'bg-black text-white border-black':''}`} onClick={()=>setAgg('day')}>Ngày</button>
              <button className={`px-2 py-0.5 rounded border text-xs ${agg==='week'?'bg-black text-white border-black':''}`} onClick={()=>setAgg('week')}>Tuần</button>
              <button className={`px-2 py-0.5 rounded border text-xs ${agg==='month'?'bg-black text-white border-black':''}`} onClick={()=>setAgg('month')}>Tháng</button>
            </div>
            <div className="flex items-center gap-1">
              <button className={`px-2 py-1 rounded border text-xs inline-flex items-center gap-1 ${chartType==='bar'?'bg-black text-white border-black':''}`} onClick={()=>setChartType('bar')} title="Cột">
                <BarChart3 className="size-3.5" />
              </button>
              <button className={`px-2 py-1 rounded border text-xs inline-flex items-center gap-1 ${chartType==='line'?'bg-black text-white border-black':''}`} onClick={()=>setChartType('line')} title="Đường">
                <LineChartIcon className="size-3.5" />
              </button>
              <button className={`px-2 py-1 rounded border text-xs inline-flex items-center gap-1 ${smooth?'bg-black text-white border-black':''}`} onClick={()=>setSmooth(v=>!v)} title="Làm mượt">
                <Sparkles className="size-3.5" />
              </button>
              <button className="px-2 py-1 rounded border text-xs inline-flex items-center gap-1" onClick={() => {
                const rows = displayData.map(d => `${new Date(d.date).toISOString().slice(0,10)},${d.revenue}`);
                const csv = ['date,revenue', ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `revenue_${startDate}_to_${endDate}.csv`;
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }} title="Xuất CSV">
                <Download className="size-3.5" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="inline-flex items-center gap-1 select-none">
                <input type="checkbox" className="accent-black" checked={autoRefresh} onChange={(e)=>setAutoRefresh(e.target.checked)} />
                <span>Tự cập nhật</span>
              </label>
              <select
                className="border rounded px-1 py-0.5"
                value={String(refreshMs)}
                onChange={(e)=>setRefreshMs(Number(e.target.value))}
                title="Chu kỳ cập nhật"
                disabled={!autoRefresh}
              >
                <option value="5000">5s</option>
                <option value="15000">15s</option>
                <option value="30000">30s</option>
                <option value="60000">60s</option>
              </select>
            </div>
            <div className="text-xs text-muted-foreground">
            {revenueQ.isLoading ? (
              <span className="inline-block h-3 w-16 bg-black/10 rounded animate-pulse" />
            ) : revenueQ.error ? (
              <span className="text-red-600">{T.state.errorLoad}</span>
            ) : (
              <span>{T.state.done}</span>
            )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          {revenueQ.isLoading ? (
            <div className="grid grid-cols-12 gap-2 items-end h-48">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full bg-black/10 rounded animate-pulse" style={{ height: `${10 + (i % 8) * 10}%` }} />
                  <div className="h-6 w-10 bg-black/5 rounded" />
                </div>
              ))}
            </div>
          ) : displayData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Không có dữ liệu trong khoảng thời gian đã chọn</div>
          ) : (
            <div className="relative overflow-hidden">
              {chartType === 'bar' ? (
                <div className="w-full h-48 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <RBarChart data={displayData} margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={48} tickFormatter={(v)=> nf.format(Number(v))} />
                      <Tooltip wrapperStyle={{ pointerEvents: 'none' }} formatter={(v)=> cf.format(Number(v))} labelFormatter={(l)=> String(l)} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} />
                    </RBarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="w-full h-48 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={displayData} margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} width={48} tickFormatter={(v)=> nf.format(Number(v))} />
                      <Tooltip wrapperStyle={{ pointerEvents: 'none' }} formatter={(v)=> cf.format(Number(v))} labelFormatter={(l)=> String(l)} />
                      <Line type={smooth ? 'monotone' : 'linear'} dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 2 }} isAnimationActive />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-base font-medium">{T.sections.topProducts}</h2>
        <div className="mt-4 divide-y">
          {topProductsQ.isLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
                <div className="size-12 rounded bg-black/10" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-40 bg-black/10 rounded" />
                  <div className="h-3 w-24 bg-black/10 rounded mt-2" />
                </div>
                <div className="h-3 w-10 bg-black/10 rounded" />
              </div>
            ))
          )}
          {topProductsQ.error && <div className="p-3 text-sm text-red-600">{T.state.errorLoad}</div>}
          {!topProductsQ.isLoading && !topProductsQ.error && topProducts.map((p) => (
            <div key={p.productName} className="flex items-center gap-4 py-3">
              <div className="relative h-12 w-12 overflow-hidden rounded border">
                <Image
                  src={p.thumbnailUrl}
                  alt={p.productName}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.productName}</p>
                <p className="text-sm text-muted-foreground">Số lượng bán: {nf.format(p.totalQuantity)}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((p.totalQuantity / topProducts[0]?.totalQuantity || 1) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
