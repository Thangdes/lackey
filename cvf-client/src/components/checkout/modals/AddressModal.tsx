"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { X } from "lucide-react";
import { GHNAddressSelector } from "../forms/GHNAddressSelector";
import { CHECKOUT_TEXT } from "@/constant/checkout";

export type AddressModalProps = {
  open: boolean;
  initial?: {
    fullName?: string;
    phone?: string;
    city?: string;
    district?: string;
    ward?: string;
    street?: string;
  };
  districtOptions?: string[];
  onClose: () => void;
  onSave: (payload: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
    isDefault: boolean;
  }) => Promise<void> | void;
  saving?: boolean;
};

export const AddressModal: React.FC<AddressModalProps> = ({ open, initial, onClose, onSave, saving }) => {
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [city, setCity] = useState(initial?.city || "Tp. Hồ Chí Minh");
  const [district, setDistrict] = useState(initial?.district || "");
  const [ward, setWard] = useState(initial?.ward || "");
  const [street, setStreet] = useState(initial?.street || "");
  const [isDefault, setIsDefault] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const prevOpenRef = useRef(open);
  const syncedRef = useRef(false);

  // Only sync initial values when modal first opens, not on every prop change while open
  useEffect(() => {
    const wasClosedNowOpen = !prevOpenRef.current && open;
    prevOpenRef.current = open;
    
    if (!open) {
      syncedRef.current = false;
      return;
    }
    
    // Only sync when modal transitions from closed to open
    if (wasClosedNowOpen && !syncedRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ADDRESS_MODAL] Syncing initial values on modal open:', initial);
      }
      
      setFullName(initial?.fullName || "");
      setPhone(initial?.phone || "");
      setCity(initial?.city || "Tp. Hồ Chí Minh");
      setDistrict(initial?.district || "");
      setWard(initial?.ward || "");
      setStreet(initial?.street || "");
      syncedRef.current = true;
    }
  }, [open, initial]);

  const validate = useMemo(() => {
    if (!fullName) return "Vui lòng nhập họ tên";
    if (!phone) return "Vui lòng nhập số điện thoại";
    if (!city) return "Vui lòng chọn Tỉnh/Thành phố";
    if (!district) return "Vui lòng chọn Quận/Huyện";
    if (!ward) return "Vui lòng chọn Phường/Xã";
    if (!street) return "Vui lòng nhập Địa chỉ (số nhà, tên đường)";
    return null;
  }, [fullName, phone, city, district, ward, street]);

  useEffect(() => { setError(null); }, [fullName, phone, city, district, ward, street]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-lg rounded-xl sm:rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base sm:text-lg font-semibold truncate">Địa chỉ giao hàng</h4>
          <button onClick={onClose} className="shrink-0 rounded-full p-2 text-black/60 hover:bg-black/5" aria-label="Đóng">
            <X size={18} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 text-sm">
          <div>
            <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.fullName}</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.phone}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" />
          </div>

          <GHNAddressSelector
            city={city}
            district={district}
            ward={ward}
            street={street}
            onCityChange={(cityName) => setCity(cityName)}
            onDistrictChange={(districtName) => setDistrict(districtName)}
            onWardChange={(wardName) => setWard(wardName)}
            onStreetChange={(e) => setStreet(e.target.value)}
            className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2"
          />
        </div>

        <div className="mt-2 sm:mt-3">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4" />
            Đặt làm địa chỉ mặc định
          </label>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-3 sm:mt-4 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-black/15 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:bg-black/5">Hủy</button>
          <button
            onClick={async () => {
              const err = validate;
              if (err) { 
                setError(err); 
                if (process.env.NODE_ENV === 'development') {
                  console.log('[ADDRESS_MODAL] Validation error:', err);
                }
                return; 
              }
              
              if (process.env.NODE_ENV === 'development') {
                console.log('[ADDRESS_MODAL] Saving address:', {
                  fullName,
                  phone,
                  city,
                  district,
                  ward,
                  street,
                });
              }
              
              await onSave({ fullName, phone, city, district, ward, street, isDefault });
            }}
            disabled={!!validate || saving}
            className="rounded-full bg-black px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "Lưu địa chỉ"}
          </button>
        </div>
      </div>
    </div>
  );
};
