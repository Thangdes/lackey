"use client";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-screen-md px-4 py-24 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.03] text-black/70">
        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a 8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"></path>
        </svg>
      </div>
      <h2 className="mt-3 text-lg font-semibold">Đang xác thực giỏ hàng…</h2>
      <p className="mt-1 text-black/60 text-sm">Vui lòng chờ trong giây lát.</p>
    </div>
  );
}
