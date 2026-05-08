"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProvinces, useDistricts, useWards } from "@/hook/useGHNLocation";
import { CHECKOUT_TEXT } from "@/constant/checkout";

export type GHNAddressSelectorProps = {
  city: string;
  district: string;
  ward: string;
  street: string;
  
  onCityChange: (cityName: string) => void;
  onDistrictChange: (districtName: string) => void;
  onWardChange: (wardName: string) => void;
  onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  className?: string;
  disabled?: boolean;
};

export function GHNAddressSelector({
  city,
  district,
  ward,
  street,
  onCityChange,
  onDistrictChange,
  onWardChange,
  onStreetChange,
  className = "",
  disabled = false,
}: GHNAddressSelectorProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);

  const { data: provincesResponse, isLoading: provincesLoading } = useProvinces();
  const { data: districtsResponse, isLoading: districtsLoading } = useDistricts(selectedProvinceId);
  const { data: wardsResponse, isLoading: wardsLoading } = useWards(selectedDistrictId);

  const provinces = useMemo(() => provincesResponse?.data || [], [provincesResponse?.data]);
  const districts = useMemo(() => districtsResponse?.data || [], [districtsResponse?.data]);
  const wards = useMemo(() => wardsResponse?.data || [], [wardsResponse?.data]);

  useEffect(() => {
    if (!city || !provinces.length) {
      setSelectedProvinceId(null);
      return;
    }

    const province = provinces.find(p => p.ProvinceName === city);
    if (province && province.ProvinceID !== selectedProvinceId) {
      setSelectedProvinceId(province.ProvinceID);
    }
  }, [city, provinces, selectedProvinceId]);

  useEffect(() => {
    if (!district || !districts.length) {
      setSelectedDistrictId(null);
      return;
    }

    const districtObj = districts.find(d => d.DistrictName === district);
    if (districtObj && districtObj.DistrictID !== selectedDistrictId) {
      setSelectedDistrictId(districtObj.DistrictID);
    }
  }, [district, districts, selectedDistrictId]);

  const handleCityChange = (cityName: string) => {
    onCityChange(cityName);
    onDistrictChange("");
    onWardChange("");
  };

  const handleDistrictChange = (districtName: string) => {
    onDistrictChange(districtName);
    onWardChange("");
  };

  const handleWardChange = (wardName: string) => {
    onWardChange(wardName);
  };

  return (
    <div className={className}>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">{CHECKOUT_TEXT.labels.city}</label>
        <Select 
          value={city} 
          onValueChange={handleCityChange}
          disabled={disabled || provincesLoading}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all">
            <SelectValue placeholder={provincesLoading ? "Đang tải..." : CHECKOUT_TEXT.labels.city} />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 rounded-lg shadow-lg">
            {provinces.map((province) => (
              <SelectItem key={province.ProvinceID} value={province.ProvinceName} className="hover:bg-gray-50 focus:bg-gray-50">
                {province.ProvinceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {CHECKOUT_TEXT.labels.district} <span className="text-red-500">*</span>
        </label>
        <Select 
          value={district} 
          onValueChange={handleDistrictChange}
          disabled={disabled || !selectedProvinceId || districtsLoading}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:opacity-50">
            <SelectValue placeholder={
              !selectedProvinceId 
                ? "Chọn tỉnh/thành phố trước" 
                : districtsLoading 
                ? "Đang tải..." 
                : CHECKOUT_TEXT.placeholders.chooseDistrict
            } />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 rounded-lg shadow-lg">
            {districts.map((districtObj) => (
              <SelectItem key={districtObj.DistrictID} value={districtObj.DistrictName} className="hover:bg-gray-50 focus:bg-gray-50">
                {districtObj.DistrictName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {CHECKOUT_TEXT.labels.ward} <span className="text-red-500">*</span>
        </label>
        <Select 
          value={ward} 
          onValueChange={handleWardChange}
          disabled={disabled || !selectedDistrictId || wardsLoading}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:opacity-50">
            <SelectValue placeholder={
              !selectedDistrictId 
                ? "Chọn quận/huyện trước" 
                : wardsLoading 
                ? "Đang tải..." 
                : "Chọn phường/xã"
            } />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 rounded-lg shadow-lg">
            {wards.map((wardObj) => (
              <SelectItem key={wardObj.WardCode} value={wardObj.WardName} className="hover:bg-gray-50 focus:bg-gray-50">
                {wardObj.WardName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {CHECKOUT_TEXT.labels.street} <span className="text-red-500">*</span>
        </label>
        <input 
          value={street} 
          onChange={onStreetChange} 
          placeholder={CHECKOUT_TEXT.placeholders.street}
          disabled={disabled}
          className="w-full border border-gray-300 rounded-lg bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
        />
      </div>
    </div>
  );
}
