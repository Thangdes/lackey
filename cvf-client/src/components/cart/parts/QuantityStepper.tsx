"use client";

import React from "react";
import { Button } from "../../ui/button";
import { Minus, Plus } from "lucide-react";

export type QuantityStepperProps = {
  quantity: number;
  maxStock?: number | null;
  onDecrease: () => void;
  onIncrease: () => void;
  onCapReached?: () => void;
  qtyAriaLabel?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
  leftButtonClassName?: string;
  rightButtonClassName?: string;
  quantityWidthClassName?: string;
  increasing?: boolean;
  decreasing?: boolean;
  containerClassName?: string;
};

const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  maxStock,
  onDecrease,
  onIncrease,
  onCapReached,
  qtyAriaLabel,
  decreaseLabel,
  increaseLabel,
  leftButtonClassName = "h-10 w-10 rounded-r-none",
  rightButtonClassName = "h-10 w-10 rounded-l-none",
  quantityWidthClassName = "w-10",
  increasing = false,
  decreasing = false,
  containerClassName = "",
}) => {
  const cap = typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;
  const atCap = quantity >= cap;
  
  return (
    <div className={`flex items-center gap-1.5 ${containerClassName || ""}`}>
      <Button
        type="button"
        aria-label={decreaseLabel}
        onClick={onDecrease}
        className={`${leftButtonClassName} ${decreasing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {decreasing ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          <Minus size={16} />
        )}
      </Button>
      <span
        className={`${quantityWidthClassName} text-center select-none`}
        aria-label={qtyAriaLabel}
      >{quantity}</span>
      <Button
        type="button"
        aria-label={increaseLabel}
        onClick={() => { if (atCap) { onCapReached?.(); } else { onIncrease(); } }}
        aria-disabled={atCap || increasing}
        title={atCap ? "Đã đạt số lượng tối đa" : increaseLabel}
        className={`${rightButtonClassName} ${increasing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {increasing ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : (
          <Plus size={16} />
        )}
      </Button>
    </div>
  );
};

export default QuantityStepper;

