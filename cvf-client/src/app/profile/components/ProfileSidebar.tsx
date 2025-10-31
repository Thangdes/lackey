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
    <div className="rounded-xl sm:rounded-2xl border border-black/10 bg-white p-3 sm:p-4 md:p-5 h-fit md:sticky md:top-24 self-start">
      <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Tài khoản</h2>
      <div className="space-y-1.5 sm:space-y-2">
        <button
          type="button"
          onClick={() => onSelect("account")}
          aria-current={section === "account" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-1.5 sm:gap-2 rounded-md sm:rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-left ${section === "account" ? "bg-black/5" : "hover:bg-black/5"}`}
        >
          <UserIcon size={14} className="sm:w-4 sm:h-4" />
          <span>Tài khoản của tôi</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("orders")}
          aria-current={section === "orders" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-1.5 sm:gap-2 rounded-md sm:rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-left ${section === "orders" ? "bg-black/5" : "hover:bg-black/5"}`}
        >
          <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
          <span>Đơn mua</span>
        </button>
      </div>
      <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-black/50">
        <Link href="/" className="hover:underline">Về trang chủ</Link>
      </div>
    </div>
  );
}
