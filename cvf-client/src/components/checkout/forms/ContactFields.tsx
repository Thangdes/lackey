"use client";
import type React from "react";
import { CHECKOUT_TEXT } from "@/constant/checkout";

export type ContactFieldsProps = {
  user: unknown;
  fullName: string;
  email: string;
  phone: string;
  onFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ContactFields({ user, fullName, email, phone, onFullNameChange, onEmailChange, onPhoneChange }: ContactFieldsProps) {
  const loggedIn = !!user;
  
  const displayEmail = (() => {
    if (loggedIn) {
      try {
        const u = user as unknown as { email?: unknown } | null;
        return (typeof u?.email === 'string' && u.email) ? u.email : email || "";
      } catch { return email || ""; }
    }
    return email || "";
  })();

  return (
    <>
      {!loggedIn && (
        <>
          <div>
            <div className="">
              <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.fullName}</label>
              <input value={fullName} onChange={onFullNameChange} className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
            </div>
            <div className="w-full mt-1">
              <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.email} (tùy chọn)</label>
              <input
                type="email"
                value={displayEmail}
                onChange={onEmailChange}
                placeholder="Nhập email của bạn"
                className={`w-full rounded-lg border border-black/15 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.phone}</label>
            <input value={phone} onChange={onPhoneChange} className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
        </>
      )}
    </>
  );
}
