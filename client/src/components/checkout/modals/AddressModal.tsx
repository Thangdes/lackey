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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-lg border-4 border-black bg-white shadow-[12px_12px_0px_0px_#B5CCBC]">
        <div className="bg-gradient-to-r from-[#AE1C2C] to-[#C92A3A] border-b-4 border-black px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">Địa chỉ giao hàng</h4>
          <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all" aria-label="Đóng">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 text-sm">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black">{CHECKOUT_TEXT.labels.fullName}</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border-2 border-black bg-white px-3 py-2.5 focus:outline-none focus:border-[#AE1C2C] focus:shadow-[4px_4px_0px_0px_rgba(174,28,44,0.2)] transition-all" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-black">{CHECKOUT_TEXT.labels.phone}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-black bg-white px-3 py-2.5 focus:outline-none focus:border-[#AE1C2C] focus:shadow-[4px_4px_0px_0px_rgba(174,28,44,0.2)] transition-all" />
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

          <div className="mt-4 p-3 bg-[#FFF8E7] border-2 border-black">
            <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 border-2 border-black" />
              <span className="font-bold">Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 border-2 border-[#AE1C2C] bg-red-50 p-3 text-sm font-medium text-[#AE1C2C]">{error}</div>
          )}

          <div className="mt-5 sm:mt-6 flex items-center justify-end gap-2 sm:gap-3">
            <button onClick={onClose} className="border-2 border-black bg-white px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-all">Hủy</button>
            <button
              onClick={async () => {
                const err = validate;
                if (err) { 
                  setError(err); 
                  return; 
                }
                
                await onSave({ fullName, phone, city, district, ward, street, isDefault });
              }}
              disabled={!!validate || saving}
              className="border-2 border-black bg-black px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide text-white hover:bg-[#AE1C2C] hover:border-[#AE1C2C] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {saving ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
