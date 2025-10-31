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
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-1" htmlFor="name">
          <UserIcon size={12} className="sm:w-3.5 sm:h-3.5 text-black/60" />
          {T.fields.name}
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          className="w-full rounded-md sm:rounded-lg border border-black/15 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-1" htmlFor="email">
          <Mail size={12} className="sm:w-3.5 sm:h-3.5 text-black/60" />
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
          className="w-full rounded-md sm:rounded-lg border border-black/15 bg-neutral-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black/70"
          aria-readonly
        />
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-black/50">Email được lấy từ tài khoản và không thể chỉnh sửa tại đây.</p>
      </div>

      <div>
        <label className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-1" htmlFor="phone">
          <Phone size={12} className="sm:w-3.5 sm:h-3.5 text-black/60" />
          {T.fields.phone}
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
          className="w-full rounded-md sm:rounded-lg border border-black/15 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="0901234567"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1" htmlFor="address">
          <MapPin size={12} className="sm:w-3.5 sm:h-3.5 text-black/60" />
          {T.fields.address}
          {addressReadOnlyValue !== undefined && (
            <button
              type="button"
              onClick={onEditAddress}
              className="ml-1 inline-flex items-center rounded-full border border-black/15 bg-white px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-black hover:bg-black/5"
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
            className="w-full rounded-md sm:rounded-lg border border-black/15 bg-neutral-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-black/70"
          />
        ) : (
          <input
            id="address"
            name="address"
            value={form.address}
            onChange={onChange}
            className="w-full rounded-md sm:rounded-lg border border-black/15 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
            placeholder="Số nhà, đường, phường, quận, TP"
          />
        )}
      </div>

      <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
        <button
          onClick={onSave}
          disabled={status === "saving"}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full border ${status === "saving" ? "opacity-60 cursor-not-allowed" : "bg-black text-white hover:bg-black/90"}`}
        >
          {status === "saving" ? "Đang lưu…" : T.actions.save}
        </button>
        <button onClick={onCancel} className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full border border-black/15 bg-white hover:bg-black/5">{T.actions.cancel}</button>
      </div>

      {status === "success" && (
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-green-600">{T.messages.updated}</p>
      )}
      {status === "error" && (
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-red-600">{T.messages.failed}</p>
      )}
    </div>
  );
}
