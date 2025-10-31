"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useProvinces, useDistricts, useWards } from '@/hook/useGHNLocation';

interface AddressSelectorProps {
  onAddressChange?: (address: {
    province?: { id: number; name: string };
    district?: { id: number; name: string };
    ward?: { code: string; name: string };
  }) => void;
  initialValues?: {
    provinceId?: number;
    districtId?: number;
    wardCode?: string;
  };
  disabled?: boolean;
}

export function AddressSelector({ onAddressChange, initialValues, disabled = false }: AddressSelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(initialValues?.provinceId || null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(initialValues?.districtId || null);
  const [selectedWardCode, setSelectedWardCode] = useState<string | null>(initialValues?.wardCode || null);

  const { data: provincesData, isLoading: provincesLoading } = useProvinces();
  const { data: districtsData, isLoading: districtsLoading } = useDistricts(selectedProvinceId);
  const { data: wardsData, isLoading: wardsLoading } = useWards(selectedDistrictId);

  const provinces = useMemo(() => provincesData?.data || [], [provincesData?.data]);
  const districts = useMemo(() => districtsData?.data || [], [districtsData?.data]);
  const wards = useMemo(() => wardsData?.data || [], [wardsData?.data]);

  useEffect(() => {
    if (selectedProvinceId && !initialValues?.provinceId) {
      setSelectedDistrictId(null);
      setSelectedWardCode(null);
    }
  }, [selectedProvinceId, initialValues?.provinceId]);

  useEffect(() => {
    if (selectedDistrictId && !initialValues?.districtId) {
      setSelectedWardCode(null);
    }
  }, [selectedDistrictId, initialValues?.districtId]);

  useEffect(() => {
    const selectedProvince = provinces.find(p => p.ProvinceID === selectedProvinceId);
    const selectedDistrict = districts.find(d => d.DistrictID === selectedDistrictId);
    const selectedWard = wards.find(w => w.WardCode === selectedWardCode);

    onAddressChange?.({
      province: selectedProvince ? { id: selectedProvince.ProvinceID, name: selectedProvince.ProvinceName } : undefined,
      district: selectedDistrict ? { id: selectedDistrict.DistrictID, name: selectedDistrict.DistrictName } : undefined,
      ward: selectedWard ? { code: selectedWard.WardCode, name: selectedWard.WardName } : undefined,
    });
  }, [selectedProvinceId, selectedDistrictId, selectedWardCode, provinces, districts, wards, onAddressChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tỉnh/Thành phố
        </label>
        <select
          value={selectedProvinceId || ''}
          onChange={(e) => setSelectedProvinceId(e.target.value ? Number(e.target.value) : null)}
          disabled={disabled || provincesLoading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map((province) => (
            <option key={province.ProvinceID} value={province.ProvinceID}>
              {province.ProvinceName}
            </option>
          ))}
        </select>
        {provincesLoading && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách tỉnh/thành...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận/Huyện
        </label>
        <select
          value={selectedDistrictId || ''}
          onChange={(e) => setSelectedDistrictId(e.target.value ? Number(e.target.value) : null)}
          disabled={disabled || !selectedProvinceId || districtsLoading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map((district) => (
            <option key={district.DistrictID} value={district.DistrictID}>
              {district.DistrictName}
            </option>
          ))}
        </select>
        {districtsLoading && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách quận/huyện...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường/Xã
        </label>
        <select
          value={selectedWardCode || ''}
          onChange={(e) => setSelectedWardCode(e.target.value || null)}
          disabled={disabled || !selectedDistrictId || wardsLoading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Chọn Phường/Xã --</option>
          {wards.map((ward) => (
            <option key={ward.WardCode} value={ward.WardCode}>
              {ward.WardName}
            </option>
          ))}
        </select>
        {wardsLoading && <p className="text-xs text-gray-500 mt-1">Đang tải danh sách phường/xã...</p>}
      </div>
    </div>
  );
}
