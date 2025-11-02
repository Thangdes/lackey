"use client";

import React from "react";

export type SubtotalProps = {
  price?: number;
  quantity: number;
  formatVND: (n?: number) => string;
  label?: string;
  compact?: boolean;
  lineTotal?: number;
};

const Subtotal: React.FC<SubtotalProps> = ({ price, quantity, lineTotal, formatVND, label = "Tạm tính", compact = false }) => {
  const total = typeof lineTotal === 'number' ? lineTotal : (typeof price === 'number' ? (price || 0) * Math.max(0, quantity || 0) : undefined);
  if (typeof total !== 'number') return null;
  return (
    <div className={`${compact ? 'text-xs' : 'text-sm'} text-black/80`} aria-live="polite">
      {label}: <span className="font-bold text-[#AE1C2C]">{formatVND(total)}</span>
    </div>
  );
};

export default Subtotal;
