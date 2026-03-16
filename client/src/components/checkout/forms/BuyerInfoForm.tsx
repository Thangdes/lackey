"use client";
import { CHECKOUT_TEXT } from "@/constant/checkout";
import type { BuyerInfoFormProps } from "@/type/checkout";
import { ContactFields } from "./ContactFields";
import { NotesField } from "./NotesField";
import { AltAddressFields } from "./AltAddressFields";

export function BuyerInfoForm({ user, values, onChange, canChooseDistrict, districtOptions }: BuyerInfoFormProps & { districtOptions?: string[] }) {
  const {
    fullName,
    email,
    phone,
    notes,
    shipToDifferent,
    altFullName,
    altPhone,
    altCity,
    altDistrict,
    altWard,
    altStreet,
  } = values;

  const {
    onFullNameChange,
    onEmailChange,
    onPhoneChange,
    onNotesChange,
    onShipToDifferentChange,
    onAltFullNameChange,
    onAltPhoneChange,
    onAltCityChange,
    onAltDistrictChange,
    onAltWardChange,
    onAltStreetChange,
  } = onChange;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <ContactFields
          user={user}
          fullName={fullName}
          email={email}
          phone={phone}
          onFullNameChange={onFullNameChange}
          onEmailChange={onEmailChange}
          onPhoneChange={onPhoneChange}
        />
        <NotesField notes={notes} onNotesChange={onNotesChange} />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input 
            type="checkbox" 
            checked={shipToDifferent} 
            onChange={onShipToDifferentChange}
            className="rounded border-gray-300"
          />
          {CHECKOUT_TEXT.shipToDifferent}
        </label>
      </div>

      {shipToDifferent && (
        <AltAddressFields
          altFullName={altFullName}
          altPhone={altPhone}
          altCity={altCity}
          altDistrict={altDistrict}
          altWard={altWard}
          altStreet={altStreet}
          canChooseDistrict={canChooseDistrict}
          districtOptions={districtOptions}
          onAltFullNameChange={onAltFullNameChange}
          onAltPhoneChange={onAltPhoneChange}
          onAltCityChange={onAltCityChange}
          onAltDistrictChange={onAltDistrictChange}
          onAltWardChange={onAltWardChange}
          onAltStreetChange={onAltStreetChange}
        />
      )}
    </div>
  );
}
