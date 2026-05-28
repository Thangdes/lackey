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

  
  useEffect(() => {
    const wasClosedNowOpen = !prevOpenRef.current && open;
    prevOpenRef.current = open;
    
    if (!open) {
      syncedRef.current = false;
      return;
    }
    
    
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 rounded-t-xl">
          <h4 className="text-sm sm:text-base font-semibold text-gray-900">Địa chỉ giao hàng</h4>
          <button onClick={onClose} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 sm:p-6">

          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 text-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">{CHECKOUT_TEXT.labels.fullName}</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">{CHECKOUT_TEXT.labels.phone}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" />
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

          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900" />
              <span className="text-gray-700">Đặt làm địa chỉ mặc định</span>
            </label>
          </div>

          {error && (
            <div className="mt-4 border border-red-300 bg-red-50 rounded-lg p-3 text-sm font-medium text-red-600">{error}</div>
          )}

          <div className="mt-5 sm:mt-6 flex items-center justify-end gap-2 sm:gap-3">
            <button onClick={onClose} className="border border-gray-300 bg-white rounded-lg px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Hủy</button>
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
              className="bg-gray-900 rounded-lg px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
