"use client";

import Link from "next/link";
import { User as UserIcon, ShoppingBag } from "lucide-react";

export default function ProfileSidebar({
  section,
  onSelect,
}: {
  section: "account" | "orders";
  onSelect: (next: "account" | "orders") => void;
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-5 h-fit md:sticky md:top-24 self-start">
      <h2 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 px-2">Tài khoản</h2>
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => onSelect("account")}
          aria-current={section === "account" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${section === "account" ? "bg-neutral-100 text-black" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"}`}
        >
          <UserIcon size={18} className={section === "account" ? "text-black" : "text-neutral-400"} />
          <span>Tài khoản của tôi</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("orders")}
          aria-current={section === "orders" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${section === "orders" ? "bg-neutral-100 text-black" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"}`}
        >
          <ShoppingBag size={18} className={section === "orders" ? "text-black" : "text-neutral-400"} />
          <span>Đơn mua</span>
        </button>
      </div>
      <div className="mt-6 pt-4 border-t border-neutral-100 px-2">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-black transition-colors">
          <span aria-hidden="true">&larr;</span> Về trang chủ
        </Link>
      </div>
    </div>
  );
}
