"use client";

import React from "react";

export type StockMessageProps = {
  maxStock?: number | null;
  quantity: number;
};

const StockMessage: React.FC<StockMessageProps> = ({ maxStock, quantity }) => {
  const m = typeof maxStock === "number" ? maxStock : undefined;
  if (m == null) return null;
  if (m <= 0) return <div className="mt-1 text-xs font-medium text-red-700">Tạm hết hàng</div>;
  if (quantity > m) return (
    <div className="mt-1 text-xs font-medium text-amber-700">Chỉ còn {m} sản phẩm. Vui lòng điều chỉnh số lượng.</div>
  );
  if (m <= 5) return <div className="mt-1 text-xs text-amber-700">Sắp hết • còn {m}</div>;
  return <div className="mt-1 text-xs text-emerald-700">Còn hàng</div>;
};

export default StockMessage;
