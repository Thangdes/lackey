"use client";
import React from "react";

type Step = {
  label: string;
  active?: boolean;
  done?: boolean;
};

type Props = {
  steps?: Step[];
};

export default function StepsHeader({ steps = [] }: Props) {
  if (!steps.length) return null;
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-black/60">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <span className={s.active ? "font-semibold text-black" : s.done ? "text-emerald-700" : undefined}>{s.label}</span>
          {i < steps.length - 1 && <span>→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
