"use client";
import { User } from "lucide-react";
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
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15 bg-black/[0.03]">
          <User size={14} />
        </span>
        {CHECKOUT_TEXT.sectionPaymentInfoTitle}
      </h2>
      <p className="mt-1 text-sm text-black/60">{CHECKOUT_TEXT.sectionPaymentInfoDesc}</p>

      <div className="mt-4 grid grid-cols-1 gap-4">
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

      <div className="mt-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shipToDifferent} onChange={onShipToDifferentChange} />
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
