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
      className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-md bg-black text-white px-4 py-2 text-sm shadow-lg"
    >
      {message}
    </div>
  );
};

export default ProductToast;
