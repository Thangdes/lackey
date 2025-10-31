"use client";

import React from "react";
import type { CustomerAddress } from "@/type/customer";
import { Truck } from "lucide-react";

export type ShippingFeeCardProps = {
  shippingFee: number;
  formatVND: (v: number) => string;
  customerId: string | null;
  savedAddresses: CustomerAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (address: CustomerAddress | null) => void;
  onOpenAddressModal: () => void;
  currentAddress?: {
    city?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
};

export function ShippingFeeCard({
  shippingFee,
  formatVND,
  customerId,
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onOpenAddressModal,
  currentAddress,
}: ShippingFeeCardProps) {
  const handleSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const id = e.target.value || null;
    const sel = savedAddresses.find((a) => String(a.id) === id) || null;
    onSelectAddress(sel);
  };

  const selected = savedAddresses.find((a) => String(a.id) === String(selectedAddressId || "")) || null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold inline-flex items-center gap-2">
            <Truck size={16} aria-hidden className="text-black/80" /> Phí vận chuyển
          </h3>
          <p className="text-xs text-black/60">Phí vận chuyển được tính tự động theo địa chỉ giao hàng.</p>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <div className="rounded-lg border border-black/10 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium">Phí vận chuyển hiện tại</div>
            <div className="font-semibold text-red-600">{formatVND(shippingFee)}</div>
          </div>
          {currentAddress && (currentAddress.city || currentAddress.district || currentAddress.ward || currentAddress.street) && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-xs text-black/60 mb-1">Địa chỉ giao hàng:</div>
              <div className="text-xs text-black/80 leading-relaxed">
                {[currentAddress.street, currentAddress.ward, currentAddress.district, currentAddress.city]
                  .filter(Boolean)
                  .join(", ") || "Chưa nhập địa chỉ"}
              </div>
            </div>
          )}
          {customerId && savedAddresses.length > 0 && (
            <div className="mt-3">
              <label className="mb-1 block text-xs text-black/60">Chọn địa chỉ đã lưu</label>
              <select
                value={selectedAddressId || ""}
                onChange={handleSelect}
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                {savedAddresses.map((a) => {
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
          )}
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenAddressModal}
              className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-medium hover:bg-black/5"
            >
              Đổi địa chỉ
            </button>
            <a href="/profile?section=account" className="text-xs text-black/60 hover:underline">
              Quản lý sổ địa chỉ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
