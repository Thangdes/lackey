"use client";

import React from "react";
import type { CustomerAddress } from "@/type/customer";

export type SavedAddressesSelectorProps = {
  addresses: CustomerAddress[];
  selectedId: string | null;
  onSelect: (address: CustomerAddress | null) => void;
};

export function SavedAddressesSelector({ addresses, selectedId, onSelect }: SavedAddressesSelectorProps) {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const id = e.target.value || null;
    const sel = addresses.find((a) => String(a.id) === id) || null;
    onSelect(sel);
  };

  const selected = addresses.find((a) => String(a.id) === String(selectedId || "")) || null;

  return (
    <div className="mt-3">
      <label className="mb-1 block text-xs text-black/60">Chọn địa chỉ đã lưu</label>
      <select
        value={selectedId || ""}
        onChange={handleChange}
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        {addresses.map((a) => {
          const base = a.fullAddress || `${a.street}, ${a.ward}, ${a.district}, ${a.city}`;
          const label = a.isDefault ? `${base} (Mặc định)` : base;
          return (
            <option key={a.id} value={String(a.id)}>
              {label}
            </option>
          );
        })}
      </select>
      {selected?.isDefault ? (
        <div className="mt-2">
          <span className="inline-block rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-semibold">Mặc định</span>
        </div>
      ) : null}
    </div>
  );
}
