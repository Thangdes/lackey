"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/type/checkout";
import type { CustomerAddress } from "@/type/customer";
import { authService } from "@/service/auth.service";
import { customerService } from "@/service/customer.service";
import type { User } from "@/type/user";

export type UseAddressInitResult = {
  customerId: string | null;
  savedAddresses: CustomerAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
  addressModalOpen: boolean;
  openAddressModal: () => void;
  closeAddressModal: () => void;
  refreshAddresses: () => Promise<void>;
};

/**
 * Initialize address-related state: load default stored address, fetch profile and customer addresses,
 * select preferred address, and apply to form via provided callbacks.
 */
export function useAddressInit(
  applyAddress: (addr: Address) => void,
  setNameEmailPhone: (name?: string, email?: string, phone?: string) => void,
): UseAddressInitResult {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const openAddressModal = () => setAddressModalOpen(true);
  const closeAddressModal = () => setAddressModalOpen(false);

  const dedupeAddresses = (addrs: CustomerAddress[]): CustomerAddress[] => {
    const norm = (s: string) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const uniqMap = new Map<string, CustomerAddress>();
    for (const a of addrs || []) {
      const key = [a.recipientName, a.phoneNumber, a.street, a.ward, a.district, a.city]
        .map(norm)
        .join("|");
      if (!uniqMap.has(key)) uniqMap.set(key, a);
    }
    return Array.from(uniqMap.values());
  };

  const refreshAddresses = async () => {
    if (!customerId) return;
    const addrs = await customerService.listAddresses(customerId).catch(() => []);
    const deduped = dedupeAddresses(addrs as CustomerAddress[]);
    setSavedAddresses(deduped);
    const preferred = Array.isArray(deduped) ? deduped.find((a) => a.isDefault) || deduped[0] : null;
    if (preferred) setSelectedAddressId(preferred.id || null);
  };

  useEffect(() => {
    let aborted = false;
    const apply = (addr: Address | null | undefined) => {
      if (!addr) return;
      applyAddress({
        recipient_name: String(addr.recipient_name || ""),
        phone_number: String(addr.phone_number || ""),
        city: String(addr.city || "Tp. Hồ Chí Minh"),
        district: String(addr.district || ""),
        ward: String(addr.ward || ""),
        street: String(addr.street || ""),
      });
    };
    (async () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("defaultAddress") : null;
        if (raw && !aborted) apply(JSON.parse(raw) as Address);
      } catch {}

      try {
        const prof = (await authService.profile().catch(() => null)) as (User & { customer?: { id?: string } | null }) | null;
        if (aborted) return;
        const cid: string | null = prof?.customer?.id || null;
        if (cid) {
          setCustomerId(cid);
          try {
            const me = await customerService.getMe().catch(() => null);
            const resolvedName = me?.fullName || prof?.name || prof?.username || "";
            const resolvedEmail = me?.email || prof?.email || "";
            const resolvedPhone = me?.phone || "";
            if (resolvedName || resolvedEmail || resolvedPhone) {
              setNameEmailPhone(
                resolvedName || undefined,
                resolvedEmail || undefined,
                resolvedPhone || undefined,
              );
            }
          } catch {}
          try {
            const addrs = (await customerService.listAddresses(cid).catch(() => [])) as CustomerAddress[];
            const deduped = dedupeAddresses(addrs || []);
            setSavedAddresses(deduped);
            const preferred = Array.isArray(deduped) ? deduped.find((a) => a.isDefault) || deduped[0] : null;
            if (preferred) {
              setSelectedAddressId(preferred.id || null);
              apply({
                recipient_name: preferred.recipientName,
                phone_number: preferred.phoneNumber,
                street: preferred.street,
                ward: preferred.ward,
                district: preferred.district,
                city: preferred.city,
              });
              try {
                localStorage.setItem(
                  "defaultAddress",
                  JSON.stringify({
                    recipient_name: preferred.recipientName,
                    phone_number: preferred.phoneNumber,
                    street: preferred.street,
                    ward: preferred.ward,
                    district: preferred.district,
                    city: preferred.city,
                  }),
                );
              } catch {}
            } else {
              setAddressModalOpen(true);
            }
          } catch {}
        } else {
          const hasLocal = (() => {
            try {
              return !!localStorage.getItem("defaultAddress");
            } catch {
              return false;
            }
          })();
          if (!hasLocal) setAddressModalOpen(true);
        }
      } catch {}
    })();
    return () => {
      aborted = true;
    };
  }, [applyAddress, setNameEmailPhone]);

  return {
    customerId,
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    addressModalOpen,
    openAddressModal,
    closeAddressModal,
    refreshAddresses,
  };
}
