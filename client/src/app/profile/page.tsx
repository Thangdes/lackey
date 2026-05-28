"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Plus, UserCircle } from "lucide-react";
import { useAuthProfile } from "@/hook/useAuth";
import { PROFILE_TEXT as T } from "@/constant/profile";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import OrderTabContent from "./components/OrderTabContent";
import AccountForm from "./components/AccountForm";
import ProfileSidebar from "./components/ProfileSidebar";
import OrderFilters from "./components/OrderFilters";
import { useCustomerMe } from "@/hook/useCustomer";
import { useUpdateMe } from "@/hook/useUser";
import { customerService } from "@/service/customer.service";
import { AddressModal } from "@/components/checkout/modals/AddressModal";
import { shippingService } from "@/service/shipping.service";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
  const { data: me, isLoading: isAuthLoading } = useAuthProfile();
  const { data: customer, isLoading: isCustomerLoading } = useCustomerMe();
  const qc = useQueryClient();
  const updateMe = useUpdateMe();
  const initial = useMemo(() => {
    const defAddr = (customer?.addresses || [])?.find(a => a.isDefault) || (customer?.addresses || [])[0];
    const addrStr = defAddr ? (defAddr.fullAddress || `${defAddr.street}, ${defAddr.ward}, ${defAddr.district}, ${defAddr.city}`) : "";
    return {
      name: (customer?.fullName) || (me?.name ?? me?.username) || "",
      email: me?.email || "",
      phone: defAddr?.phoneNumber || customer?.phone || "",
      address: addrStr,
    };
  }, [customer?.fullName, customer?.phone, customer?.addresses, me?.email, me?.name, me?.username]);

  const [form, setForm] = useState(initial);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const defAddr = useMemo(() => {
    return (customer?.addresses || [])?.find(a => a.isDefault) || (customer?.addresses || [])[0];
  }, [customer?.addresses]);
  const [hcmDistrictOptions, setHcmDistrictOptions] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sectionFromUrl = ((): "account" | "orders" => {
    const s = (searchParams.get("section") || "").toLowerCase();
    return s === "orders" ? "orders" : "account";
  })();
  const [section, setSection] = useState<"account" | "orders">(sectionFromUrl);
  const orderTabs = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "preparing", label: "Chuẩn bị giao" },
    { key: "shipping", label: "Vận chuyển" },
    { key: "completed", label: "Hoàn thành" },
    { key: "canceled", label: "Đã hủy" },
  ] as const;
  type OrderTabKey = typeof orderTabs[number]["key"];
  const tabFromUrl = ((): OrderTabKey => {
    const t = (searchParams.get("tab") || "all").toLowerCase();
    const keys = orderTabs.map((x) => x.key);
    return (keys.includes(t as OrderTabKey) ? (t as OrderTabKey) : "all");
  })();
  const [activeOrderTab, setActiveOrderTab] = useState<OrderTabKey>(tabFromUrl);
  const [activeTabTotal, setActiveTabTotal] = useState<number>(0);
  const pageFromUrl = Number(searchParams.get("page") || 1) || 1;
  const limitFromUrl = Number(searchParams.get("limit") || 10) || 10;
  const [page, setPage] = useState<number>(pageFromUrl);
  const [limit, setLimit] = useState<number>(limitFromUrl);
  const searchFromUrl = (searchParams.get("q") || "").trim();
  const fromDateFromUrl = searchParams.get("fromDate") || "";
  const toDateFromUrl = searchParams.get("toDate") || "";
  const [q, setQ] = useState<string>(searchFromUrl);
  const [fromDate, setFromDate] = useState<string>(fromDateFromUrl);
  const [toDate, setToDate] = useState<string>(toDateFromUrl);

  useEffect(() => {
    setSection(sectionFromUrl);
    setActiveOrderTab(tabFromUrl);
    setPage(pageFromUrl);
    setLimit(limitFromUrl);
    setQ(searchFromUrl);
    setFromDate(fromDateFromUrl);
    setToDate(toDateFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTotalChange = useCallback((n: number) => {
    setActiveTabTotal(n);
  }, []);

  const updateUrl = (nextSection: "account" | "orders", nextTab: OrderTabKey, nextPage = page, nextLimit = limit, nextQ = q, nextFrom = fromDate, nextTo = toDate) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("section", nextSection);
    sp.set("tab", nextTab);
    sp.set("page", String(nextPage));
    sp.set("limit", String(nextLimit));
    if (nextQ) sp.set("q", nextQ); else sp.delete("q");
    if (nextFrom) sp.set("fromDate", nextFrom); else sp.delete("fromDate");
    if (nextTo) sp.set("toDate", nextTo); else sp.delete("toDate");
    router.replace(`${pathname}?${sp.toString()}`);
  };

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const dedupedAddresses = useMemo(() => {
    const addrs = customer?.addresses || [];
    const norm = (s: string) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const uniqMap = new Map<string, typeof addrs[number]>();
    for (const a of addrs) {
      const key = [a.recipientName, a.phoneNumber, a.street, a.ward, a.district, a.city]
        .map(norm)
        .join("|");
      if (!uniqMap.has(key)) uniqMap.set(key, a);
    }
    return Array.from(uniqMap.values());
  }, [customer?.addresses]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onCancel = () => setForm(initial);

  const onSave = async () => {
    try {
      setStatus("saving");
      await updateMe.mutateAsync({ fullName: form.name, phone: form.phone });
      await qc.invalidateQueries({ queryKey: ["customers", "me"] });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const info = await shippingService.getDistrictsInfo();
        if (!mounted) return;
        const opts = [...(info?.freeship || []), ...(info?.noFreeship || [])];
        setHcmDistrictOptions(opts);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  if (isAuthLoading || isCustomerLoading) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-20 md:px-6 lg:px-8 mt-24">
        <div className="h-6 w-40 bg-black/10 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-4 sm:py-6 md:py-8 xl:py-10 2xl:py-12">
      {}
      <nav className="mb-6" aria-label="Breadcrumb">
        <div className="inline-flex items-center gap-2 text-sm">
          <Link href="/" className="text-neutral-600 hover:text-black transition-colors">Trang chủ</Link>
          <span className="text-neutral-400">/</span>
          {section === "orders" ? (
            <>
              <span className="text-black font-medium">Tài khoản</span>
              <span className="text-neutral-400">/</span>
              <span className="text-black font-medium">{orderTabs.find(t => t.key === activeOrderTab)?.label || "Tất cả"}</span>
            </>
          ) : (
            <span className="text-black font-medium">Tài khoản</span>
          )}
        </div>
      </nav>

      {}
      <div className="mb-8 p-6 md:p-8 bg-white border border-neutral-200 rounded-2xl flex items-center gap-5">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
          <UserCircle className="w-6 h-6 md:w-8 md:h-8 text-neutral-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">{section === "orders" ? "Đơn mua" : T.title}</h1>
          <p className="text-neutral-500 text-sm md:text-base mt-1">{section === "orders" ? "Quản lý đơn hàng của bạn" : T.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileSidebar
          section={section}
          onSelect={(next) => { setSection(next); updateUrl(next, activeOrderTab); }}
        />

        <div className="md:col-span-2 bg-white p-6 md:p-8 border border-neutral-200 rounded-2xl">
          {section === "account" ? (
            <div className="space-y-8">
              <AccountForm
                form={form}
                meEmail={me?.email ?? null}
                status={status}
                onChange={onChange}
                onSave={onSave}
                onCancel={onCancel}
                addressReadOnlyValue={form.address}
                onEditAddress={() => setAddrModalOpen(true)}
              />

              <div className="border-t border-neutral-200 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-black">Sổ địa chỉ</h3>
                    <p className="text-sm text-neutral-500 mt-1">Quản lý các địa chỉ giao hàng đã lưu</p>
                  </div>
                  <button
                    onClick={() => setAddrModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-black px-4 py-2 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors shrink-0"
                  >
                    <Plus size={16} /> <span>Thêm địa chỉ</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {dedupedAddresses.length === 0 && (
                    <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-500 text-sm text-center">Chưa có địa chỉ nào. Nhấn &quot;Thêm địa chỉ&quot; để lưu địa chỉ mới.</div>
                  )}
                  {dedupedAddresses.map((a) => (
                    <div key={a.id} className="border border-neutral-200 rounded-xl p-4 sm:p-5 bg-white hover:border-neutral-300 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="font-medium text-sm sm:text-base text-black leading-snug">{a.fullAddress || `${a.street}, ${a.ward}, ${a.district}, ${a.city}`}</div>
                        {a.isDefault && <span className="shrink-0 px-2 py-0.5 bg-neutral-100 text-black border border-neutral-200 rounded text-xs font-medium">Mặc định</span>}
                      </div>
                      <div className="text-neutral-500 text-sm flex flex-wrap gap-4">
                        <span className="flex items-center gap-1.5">
                          <UserCircle className="w-4 h-4 text-neutral-400" /> {a.recipientName}
                        </span>
                        <span className="flex items-center gap-1.5">
                           📞 {a.phoneNumber}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AddressModal
                open={addrModalOpen}
                districtOptions={hcmDistrictOptions}
                initial={defAddr ? {
                  fullName: defAddr.recipientName,
                  phone: defAddr.phoneNumber,
                  city: defAddr.city,
                  district: defAddr.district,
                  ward: defAddr.ward,
                  street: defAddr.street,
                } : undefined}
                onClose={() => setAddrModalOpen(false)}
                saving={savingAddr}
                onSave={async (p) => {
                  if (!customer?.id) return;
                  try {
                    setSavingAddr(true);
                    if (defAddr?.id) {
                      await customerService.updateAddress(customer.id, defAddr.id, {
                        recipientName: p.fullName,
                        phoneNumber: p.phone,
                        street: p.street,
                        ward: p.ward,
                        district: p.district,
                        city: p.city,
                        isDefault: p.isDefault,
                      });
                    } else {
                      await customerService.addAddress(customer.id, {
                        recipientName: p.fullName,
                        phoneNumber: p.phone,
                        street: p.street,
                        ward: p.ward,
                        district: p.district,
                        city: p.city,
                        isDefault: p.isDefault,
                      });
                    }
                    await qc.invalidateQueries({ queryKey: ["customers", "me"] });
                    setAddrModalOpen(false);
                  } catch {} finally {
                    setSavingAddr(false);
                  }
                }}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6 pb-4 border-b border-neutral-200">
                <h2 className="text-xl font-bold text-black">Đơn mua</h2>
                <p className="text-sm text-neutral-500 mt-1">Quản lý đơn hàng của bạn theo trạng thái</p>
              </div>
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="no-scrollbar overflow-x-auto pb-2">
                      <div className="inline-flex items-center gap-6 border-b border-neutral-200 min-w-full">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="h-8 w-20 mb-2 bg-neutral-200 animate-pulse rounded-md" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 bg-neutral-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  </div>
                }
              >
                <div role="tablist" aria-label="Trạng thái đơn hàng" className="no-scrollbar overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8 pb-2 mb-2">
                  <div className="inline-flex items-center gap-6 border-b border-neutral-200 min-w-full">
                    {orderTabs.map((t) => (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={activeOrderTab === t.key}
                        className={`relative py-3 text-sm font-medium whitespace-nowrap transition-all ${activeOrderTab === t.key ? "text-black border-b-2 border-black -mb-[1px]" : "text-neutral-500 hover:text-black"}`}
                        onClick={() => { setActiveOrderTab(t.key); setPage(1); updateUrl("orders", t.key, 1, limit); }}
                      >
                        <span className="flex items-center gap-2">
                          {t.label}
                          {activeOrderTab === t.key && activeTabTotal > 0 && (
                            <span className="inline-flex items-center justify-center bg-black text-white px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full min-w-[20px]">
                              {activeTabTotal}
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <OrderFilters
                  q={q}
                  fromDate={fromDate}
                  toDate={toDate}
                  onQChange={(v) => setQ(v)}
                  onFromDateChange={(v) => setFromDate(v)}
                  onToDateChange={(v) => setToDate(v)}
                  onFilter={() => { setPage(1); updateUrl("orders", activeOrderTab, 1, limit, q, fromDate, toDate); }}
                  onClear={() => { setQ(""); setFromDate(""); setToDate(""); setPage(1); updateUrl("orders", activeOrderTab, 1, limit, "", "", ""); }}
                />
                <OrderTabContent
                  activeTab={activeOrderTab}
                  page={page}
                  limit={limit}
                  q={q}
                  fromDate={fromDate}
                  toDate={toDate}
                  onPageChange={(p) => { setPage(p); updateUrl("orders", activeOrderTab, p, limit); }}
                  onLimitChange={(l) => { setLimit(l); setPage(1); updateUrl("orders", activeOrderTab, 1, l); }}
                  onTotalChange={handleTotalChange}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
