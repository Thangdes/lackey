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
    <div className="bg-white border-4 border-black p-4 md:p-5 h-fit md:sticky md:top-24 self-start shadow-[8px_8px_0px_0px_#B5CCBC]">
      <h2 className="text-base md:text-lg font-bold uppercase tracking-wide mb-3 pb-2 border-b-4 border-black">Tài khoản</h2>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onSelect("account")}
          aria-current={section === "account" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-2 px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-left border-2 transition-all ${section === "account" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"}`}
        >
          <UserIcon size={16} className="shrink-0" />
          <span>Tài khoản của tôi</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("orders")}
          aria-current={section === "orders" ? "page" : undefined}
          className={`w-full inline-flex items-center gap-2 px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-left border-2 transition-all ${section === "orders" ? "bg-black text-white border-black" : "bg-white text-black border-black hover:bg-black hover:text-white"}`}
        >
          <ShoppingBag size={16} className="shrink-0" />
          <span>Đơn mua</span>
        </button>
      </div>
      <div className="mt-4 pt-3 border-t-2 border-black/20">
        <Link href="/" className="text-xs font-bold uppercase tracking-wide text-black hover:text-[var(--brand-secondary)] transition-colors">← Về trang chủ</Link>
      </div>
    </div>
  );
}
