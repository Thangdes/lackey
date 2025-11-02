"use client";
import React from "react";
import { LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export type RevenuePoint = { date: string; revenue: number };

type Props = {
  data: RevenuePoint[];
  height?: number;
  valueFormatter?: (v: number) => string;
};

export default function RevenueLineChart({ data, height = 220, valueFormatter }: Props) {
  const fmt = (v: number) => (typeof valueFormatter === 'function' ? valueFormatter(Number(v)) : String(v));
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" minTickGap={24} tickFormatter={(d)=> String(d).slice(5)} />
          <YAxis width={72} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(v)=> fmt(Number(v))} />
          <Tooltip
            wrapperStyle={{ pointerEvents: 'none' }}
            content={(props: { active?: boolean; payload?: Array<{ value?: number | string }>; label?: string | number }) => {
              if (!props?.active || !props.payload || props.payload.length === 0) return null;
              const val = Number(props.payload[0]?.value || 0);
              const label = props.label;
              return (
                <div className="rounded-md border bg-white px-2 py-1 text-xs shadow">
                  {String(label)} — {fmt(val)}
                </div>
              );
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#111" strokeWidth={2} dot={{ r: 2 }} isAnimationActive />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}
