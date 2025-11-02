"use client";
import React, { useEffect, useState } from "react";
import { authService } from "@/service/auth.service";
import { supplierDashboardService } from "@/service/supplier-dashboard.service";
import type { User } from "@/type/user";

export default function SupplierProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [supProfile, me] = await Promise.all([
          supplierDashboardService.profile().catch(() => null),
          authService.profile().catch(() => null) as Promise<User | null>,
        ]);
        if (!cancelled) {
          if (supProfile) {
            setName(supProfile.name || "");
            setPhone(supProfile.phone || "");
            setAddress(supProfile.address || "");
            setNote(supProfile.description || "");
            setSupplierEmail(supProfile.email || "");
          } else {
            const maybe = me as unknown as {
              supplier?: { name?: string; phone?: string; address?: string; description?: string; email?: string };
              name?: string;
              phone?: string;
              address?: string;
              note?: string;
              email?: string;
            } | null;
            const sup = maybe?.supplier;
            if (sup) {
              setName(sup.name || "");
              setPhone(sup.phone || "");
              setAddress(sup.address || "");
              setNote(sup.description || "");
              setSupplierEmail(sup.email || "");
            } else {
              setName(maybe?.name || "");
              setPhone(maybe?.phone || "");
              setAddress(maybe?.address || "");
              setNote(maybe?.note || "");
              setSupplierEmail(String(maybe?.email || ""));
            }
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hồ sơ nhà cung cấp</h1>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-600">Đang tải…</div>
      ) : (
        <div className="max-w-2xl space-y-4">
          <div className="rounded-md border p-4 bg-neutral-50 text-sm text-neutral-700">
            Thông tin nhà cung cấp hiện chỉ hiển thị để tham khảo. Vui lòng liên hệ quản trị viên nếu bạn cần cập nhật.
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email (đăng ký)</label>
            <input className="w-full h-11 rounded-md border px-3 text-[16px] bg-neutral-100" value={supplierEmail} readOnly aria-readonly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên hiển thị</label>
            <input className="w-full h-11 rounded-md border px-3 text-[16px] bg-neutral-100" value={name} readOnly aria-readonly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input className="w-full h-11 rounded-md border px-3 text-[16px] bg-neutral-100" value={phone} readOnly aria-readonly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ</label>
            <input className="w-full h-11 rounded-md border px-3 text-[16px] bg-neutral-100" value={address} readOnly aria-readonly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ghi chú</label>
            <textarea className="w-full min-h-24 rounded-md border px-3 py-2 text-[16px] bg-neutral-100" value={note} readOnly aria-readonly />
          </div>
        </div>
      )}
    </div>
  );
}

