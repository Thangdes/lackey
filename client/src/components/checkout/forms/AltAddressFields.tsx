"use client";
import type React from "react";
import { CHECKOUT_TEXT } from "@/constant/checkout";
import { GHNAddressSelector } from "./GHNAddressSelector";

export type AltAddressFieldsProps = {
  altFullName: string;
  altPhone: string;
  altCity: string;
  altDistrict: string;
  altWard: string;
  altStreet: string;
  canChooseDistrict?: (city: string) => boolean;
  districtOptions?: string[]; 
  onAltFullNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAltPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAltCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAltDistrictChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onAltWardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAltStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AltAddressFields(props: AltAddressFieldsProps) {
  const { 
    altFullName, 
    altPhone, 
    altCity, 
    altDistrict, 
    altWard, 
    altStreet, 
    onAltFullNameChange, 
    onAltPhoneChange, 
    onAltCityChange, 
    onAltDistrictChange, 
    onAltWardChange, 
    onAltStreetChange 
  } = props;
  
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.fullName}</label>
        <input 
          value={altFullName} 
          onChange={onAltFullNameChange} 
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" 
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-black/70">{CHECKOUT_TEXT.labels.phone}</label>
        <input 
          value={altPhone} 
          onChange={onAltPhoneChange} 
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" 
        />
      </div>
      
      <GHNAddressSelector
        city={altCity}
        district={altDistrict}
        ward={altWard}
        street={altStreet}
        onCityChange={(cityName) => onAltCityChange({ target: { value: cityName } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
        onDistrictChange={(districtName) => onAltDistrictChange({ target: { value: districtName } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
        onWardChange={(wardName) => onAltWardChange({ target: { value: wardName } } as unknown as React.ChangeEvent<HTMLInputElement>)}
        onStreetChange={onAltStreetChange}
        className="sm:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2"
      />
    </div>
  );
}
