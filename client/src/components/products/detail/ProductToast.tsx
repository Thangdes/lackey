"use client";

import React from "react";

type ProductToastProps = {
  message: string | null;
};

const ProductToast: React.FC<ProductToastProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-none border-3 border-[#5A5E63] bg-[#fafafa] px-5 py-3 text-sm font-medium text-[#2f4f4f] shadow-[4px_4px_0px_0px_rgba(90,94,99,0.3)] animate-in slide-in-from-top-5 duration-300 uppercase tracking-wide"
    >
      {message}
    </div>
  );
};

export default ProductToast;
