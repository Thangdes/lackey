"use client";

import React from "react";

const SubscribeForm: React.FC = () => {
  return (
    <form className="mt-3 flex gap-2">
      <input
        type="email"
        inputMode="email"
        required
        placeholder="Enter your email to get updates"
        className="flex-1 border-2 border-black rounded px-3 py-2 text-sm placeholder-neutral-400 outline-none focus:ring-2 focus:ring-black/10"
        aria-label="Email address"
      />
      <button
        type="button"
        className="border-2 border-black bg-black text-white px-4 py-2 rounded text-sm hover:bg-white hover:text-black transition-colors cursor-pointer"
      >
        Subscribe
      </button>
    </form>
  );
};

export default SubscribeForm;
