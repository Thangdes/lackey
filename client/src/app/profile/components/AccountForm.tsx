"use client";

import { User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import { PROFILE_TEXT as T } from "@/constant/profile";

export type AccountFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function AccountForm({
  form,
  meEmail,
  status,
  onChange,
  onSave,
  onCancel,
  addressReadOnlyValue,
  onEditAddress,
}: {
  form: AccountFormValues;
  meEmail?: string | null;
  status: "idle" | "saving" | "success" | "error";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  addressReadOnlyValue?: string;
  onEditAddress?: () => void;
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <label className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 mb-1.5" htmlFor="name">
          <UserIcon size={14} className="text-neutral-400" />
          {T.fields.name}
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 mb-1.5" htmlFor="email">
          <Mail size={14} className="text-neutral-400" />
          {T.fields.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={meEmail || form.email}
          placeholder={meEmail || form.email}
          disabled
          readOnly
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
          aria-readonly
        />
        <p className="mt-1.5 text-xs text-neutral-400">Email được lấy từ tài khoản và không thể chỉnh sửa tại đây.</p>
      </div>

      <div>
        <label className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 mb-1.5" htmlFor="phone">
          <Phone size={14} className="text-neutral-400" />
          {T.fields.phone}
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
          placeholder="0901234567"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 mb-1.5" htmlFor="address">
          <MapPin size={14} className="text-neutral-400" />
          {T.fields.address}
          {addressReadOnlyValue !== undefined && (
            <button
              type="button"
              onClick={onEditAddress}
              className="ml-2 inline-flex items-center rounded-md border border-neutral-200 bg-white px-2 py-0.5 text-[10px] sm:text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              Thay đổi
            </button>
          )}
        </label>
        {addressReadOnlyValue !== undefined ? (
          <input
            id="address"
            name="address"
            value={addressReadOnlyValue}
            readOnly
            disabled
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500"
          />
        ) : (
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/30 transition-all bg-white"
            placeholder="Số nhà, đường, phường, quận, TP"
          />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={onSave}
          disabled={status === "saving"}
          className={`px-5 py-2.5 text-sm font-medium rounded-xl border transition-colors ${status === "saving" ? "opacity-60 cursor-not-allowed bg-black text-white" : "bg-black text-white hover:bg-neutral-800 border-black"}`}
        >
          {status === "saving" ? "Đang lưu…" : T.actions.save}
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 text-sm font-medium rounded-xl border border-neutral-200 bg-white text-black hover:bg-neutral-50 transition-colors">{T.actions.cancel}</button>
      </div>

      {status === "success" && (
        <p className="mt-3 text-sm font-medium text-green-600">{T.messages.updated}</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{T.messages.failed}</p>
      )}
    </div>
  );
}
