"use client";
import type React from "react";
import { GHNAddressSelector } from "./GHNAddressSelector";

export type AddressFieldsProps = {
  city: string;
  district: string;
  ward: string;
  street: string;
  canChooseDistrict?: (city: string) => boolean;
  districtOptions?: string[]; 
  onCityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onWardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStreetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AddressFields({ 
  city, 
  district, 
  ward, 
  street, 
  onCityChange, 
  onDistrictChange, 
  onWardChange, 
  onStreetChange 
}: AddressFieldsProps) {
  return (
    <GHNAddressSelector
      city={city}
      district={district}
      ward={ward}
      street={street}
      onCityChange={(cityName) => onCityChange({ target: { value: cityName } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
      onDistrictChange={(districtName) => onDistrictChange({ target: { value: districtName } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
      onWardChange={(wardName) => onWardChange({ target: { value: wardName } } as unknown as React.ChangeEvent<HTMLInputElement>)}
      onStreetChange={onStreetChange}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    />
  );
}
