"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
      <nav className="mb-6" aria-label="Breadcrumb">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black">
          <Link href="/" className="text-sm font-bold uppercase tracking-wide hover:text-[var(--brand-secondary)] transition-colors">Trang chủ</Link>
          <span className="text-black font-bold">/</span>
          {section === "orders" ? (
            <>
              <span className="text-sm font-bold uppercase tracking-wide text-black">Tài khoản</span>
              <span className="text-black font-bold">/</span>
              <span className="text-sm font-bold uppercase tracking-wide text-black">{orderTabs.find(t => t.key === activeOrderTab)?.label || "Tất cả"}</span>
            </>
          ) : (
            <span className="text-sm font-bold uppercase tracking-wide text-black">Tài khoản</span>
          )}
        </div>
      </nav>
      <div className="mb-8 bg-[#fff100] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#B5CCBC] flex items-center gap-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-black flex items-center justify-center border-2 border-black shrink-0">
          <UserCircle className="w-6 h-6 md:w-8 md:h-8 text-[#fff100]" />
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-retro)] text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider uppercase text-black">{section === "orders" ? "Đơn mua" : T.title}</h1>
          <p className="text-black font-medium text-sm md:text-base mt-1">{section === "orders" ? "Quản lý đơn hàng của bạn" : T.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        <ProfileSidebar
          section={section}
          onSelect={(next) => { setSection(next); updateUrl(next, activeOrderTab); }}
        />

        <div className="md:col-span-2 bg-white border-4 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_#B5CCBC]">
          {section === "account" ? (
            <div className="space-y-6">
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

              <div className="border-4 border-black p-4 bg-neutral-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b-4 border-black">
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-wide">Sổ địa chỉ</h3>
                    <p className="text-xs text-black/70 mt-1">Quản lý các địa chỉ giao hàng đã lưu</p>
                  </div>
                  <button
                    onClick={() => setAddrModalOpen(true)}
                    className="inline-flex items-center gap-2 border-2 border-black bg-black text-white px-3 py-2 text-xs font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-all shrink-0"
                  >
                    <Plus size={14} /> <span>Thêm địa chỉ</span>
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  {dedupedAddresses.length === 0 && (
                    <div className="p-3 bg-white border-2 border-neutral-300 text-neutral-600">Chưa có địa chỉ nào. Nhấn &quot;Thêm địa chỉ&quot; để lưu địa chỉ mới.</div>
                  )}
                  {dedupedAddresses.map((a) => (
                    <div key={a.id} className="border-2 border-black p-3 bg-white">
                      <div className="font-bold text-sm line-clamp-2">{a.fullAddress || `${a.street}, ${a.ward}, ${a.district}, ${a.city}`}</div>
                      <div className="text-neutral-700 text-xs mt-1.5 flex flex-wrap gap-2">
                        <span>👤 {a.recipientName}</span>
                        <span>📞 {a.phoneNumber}</span>
                        {a.isDefault && <span className="px-2 py-0.5 bg-[#fff100] border border-black text-xs font-bold">MẶC ĐỊNH</span>}
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
              <div className="mb-4 pb-3 border-b-4 border-black">
                <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide">Đơn mua</h2>
                <p className="text-xs sm:text-sm text-black/70 mt-1">Quản lý đơn hàng của bạn theo trạng thái</p>
              </div>
              <Suspense
                fallback={
                  <div className="space-y-4">
                    <div className="no-scrollbar overflow-x-auto pb-2">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 border-b-2 border-black/10 min-w-full">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="h-10 w-20 sm:w-28 rounded-t-lg bg-gray-200 animate-pulse" />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 sm:h-28 rounded-xl bg-gray-200 animate-pulse" />
                      ))}
                    </div>
                  </div>
                }
              >
                <div role="tablist" aria-label="Trạng thái đơn hàng" className="no-scrollbar overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 pb-2">
                  <div className="inline-flex items-center gap-2 border-b-4 border-black min-w-full">
                    {orderTabs.map((t) => (
                      <button
                        key={t.key}
                        role="tab"
                        aria-selected={activeOrderTab === t.key}
                        className={`relative px-3 py-2.5 text-xs font-bold uppercase whitespace-nowrap transition-all border-2 ${activeOrderTab === t.key ? "bg-black text-white border-black -mb-[2px]" : "bg-white text-black border-black hover:bg-black hover:text-white"}`}
                        onClick={() => { setActiveOrderTab(t.key); setPage(1); updateUrl("orders", t.key, 1, limit); }}
                      >
                        <span className="relative z-10">{t.label}</span>
                        {activeOrderTab === t.key && (
                          <span className="ml-2 inline-flex items-center bg-[#fff100] text-black px-2 py-0.5 text-[10px] font-bold border border-black relative z-10">
                            {activeTabTotal}
                          </span>
                        )}
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
                  onTotalChange={(n) => setActiveTabTotal(n)}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
