"use client";

import React from "react";
import type { CustomerAddress } from "@/type/customer";

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

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Phí vận chuyển được tính tự động theo địa chỉ giao hàng.
      </div>
      
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Phí vận chuyển</span>
          <span className="text-sm font-semibold text-gray-900">{formatVND(shippingFee)}</span>
        </div>
        
        {currentAddress && (currentAddress.city || currentAddress.district || currentAddress.ward || currentAddress.street) && (
          <div className="text-xs text-gray-600">
            {[currentAddress.street, currentAddress.ward, currentAddress.district, currentAddress.city]
              .filter(Boolean)
              .join(", ") || "Chưa nhập địa chỉ"}
          </div>
        )}
        
        {customerId && savedAddresses.length > 0 && (
          <div className="mt-3">
            <select
              value={selectedAddressId || ""}
              onChange={handleSelect}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          </div>
        )}
        
        <button
          type="button"
          onClick={onOpenAddressModal}
          className="mt-3 text-xs text-gray-600 hover:text-gray-900 underline"
        >
          Đổi địa chỉ
        </button>
      </div>
    </div>
  );
}
