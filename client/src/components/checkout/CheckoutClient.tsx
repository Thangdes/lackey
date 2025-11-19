"use client";

import { useCallback, useEffect, useMemo, useReducer, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { CHECKOUT_TEXT } from "@/constant/checkout";
import { useAuth } from "@/components/auth/AuthProvider";
import type { PaymentMethod as Method } from "@/type/checkout";
import { formatVND } from "@/utils/currency";
import { useSmartCart } from "@/hook/useCart";
import { cartKeys } from "@/constant/key/cart";
import { useCheckout } from "@/hook/useOrder";
import { shippingService } from "@/service/shipping.service";
import type { SmartCartItem } from "@/type/cart";
import { BuyerInfoForm } from "./forms/BuyerInfoForm";
import { AlertTriangle } from "lucide-react";
import { toLocalCartItem } from "../../utils/checkout";
import { useCreatePaymentLink } from "@/hook/usePayment";
import CheckoutLoading from "./parts/CheckoutLoading";
import type { Address } from "@/type/checkout";
import { DiscountBox } from "./summary/DiscountBox";
import { OrderSummary } from "./summary/OrderSummary";
import { PaymentMethods } from "./payment/PaymentMethods";
import { BankTransferModal } from "./payment/modals/BankTransferModal";
import { useCartDiscount } from "@/hook/useCartDiscount";
import { AddressModal } from "./modals/AddressModal";
import { ShippingFeeCard } from "./parts/ShippingFeeCard";
import { OrderSuccessModal } from "./parts/OrderSuccessModal";
import { SubmitBar } from "./parts/SubmitBar";
import { customerService } from "@/service/customer.service";
import type { CustomerAddress } from "@/type/customer";
import type { User } from "@/type/user";
import { VietQRPanel } from "./payment/VietQRPanel";
import { useUiLoading } from "./hooks/useUiLoading";
import { canChooseDistrict } from "./utils/address";
import { useAddressInit } from "./hooks/useAddressInit";
import { useShippingFee } from "./hooks/useShippingFee";
import { extractCartItemWeight } from "../../utils/weightExtractor";
import { useVietQRFlow } from "./hooks/useVietQRFlow";
import { buyerReducer as buyerReducerFn, altReducer as altReducerFn } from "./reducers/checkout.reducers";
import { useCheckoutValidation } from "./hooks/useCheckoutValidation";
import { useCheckoutFlow } from "./hooks/useCheckoutFlow";
import { useCheckoutSubmit } from "./hooks/useCheckoutSubmit";
import { buildPayload, persistDefaultAddress } from "./utils/payload";
import { copyText } from "./utils/clipboard";

export default function CheckoutClient() {
  const router = useRouter();
  const { user } = useAuth();
  const cart = useSmartCart();
  const items = cart.items as SmartCartItem[];
  const isCartLoading = cart.isLoading;
  const qc = useQueryClient();
  const checkoutMut = useCheckout();
  const [globalWarnings, setGlobalWarnings] = useState<string[]>([]);
  const [itemWarnings, setItemWarnings] = useState<Record<string, string[]>>({});

  const [buyer, dispatchBuyer] = useReducer(buyerReducerFn, {
    fullName: "",
    email: "",
    phone: "",
    city: "Tp. Hồ Chí Minh",
    district: "",
    ward: "",
    street: "",
    notes: "",
    shipToDifferent: false,
  });
  const [alt, dispatchAlt] = useReducer(altReducerFn, {
    altFullName: "",
    altPhone: "",
    altCity: "Tp. Hồ Chí Minh",
    altDistrict: "",
    altWard: "",
    altStreet: "",
  });

  const [method, setMethod] = useState<Method>("COD");
  const createPaymentLinkMut = useCreatePaymentLink();

  const {
    vietQRUrl,
    vietQRTransferNote,
    vietQRBank,
    pendingVietQROrderId,
    setPendingVietQROrderId,
    showVietQR,
    vietQRAcknowledged,
    setVietQRAcknowledged,
    setFromLinkResponse,
    copyTransferNote,
    cancelPending,
  } = useVietQRFlow();
  const [bankTfOpen, setBankTfOpen] = useState(false);
  const [bankTfTransferNote, setBankTfTransferNote] = useState<string>("");
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [pendingNavHref, setPendingNavHref] = useState<string | null>(null);
  const [pendingNavBack, setPendingNavBack] = useState(false);
  const [exitContext, setExitContext] = useState<"vietqr" | "dirty" | null>(null);
  const [hcmDistrictOptions, setHcmDistrictOptions] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const PRICE_WARN = "Một số sản phẩm có giá chưa khả dụng.";
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [lastOrderCodeState, setLastOrderCodeState] = useState<string | undefined>(undefined);
  const [successCountdown, setSuccessCountdown] = useState(10);
  const [noAutoDismiss, setNoAutoDismiss] = useState(false);
  const [pendingRedirectHome, setPendingRedirectHome] = useState(false);
  const allowExitRef = useRef(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const handlingPopRef = useRef(false);
  const applyAddressToBuyer = useCallback((addr: Address) => {
    dispatchBuyer({ key: "fullName", value: String(addr.recipient_name || "") });
    dispatchBuyer({ key: "phone", value: String((addr.phone_number || buyer.phone || "")) });
    dispatchBuyer({ key: "city", value: String(addr.city || "Tp. Hồ Chí Minh") });
    dispatchBuyer({ key: "district", value: String(addr.district || "") });
    dispatchBuyer({ key: "ward", value: String(addr.ward || "") });
    dispatchBuyer({ key: "street", value: String(addr.street || "") });
  }, [buyer.phone]);
  const setNameEmailPhone = useCallback((name?: string, email?: string, phone?: string) => {
    if (typeof name !== "undefined" && !buyer.fullName) {
      dispatchBuyer({ key: "fullName", value: String(name) });
    }
    if (typeof email !== "undefined") {
      dispatchBuyer({ key: "email", value: String(email) });
    }
    if (typeof phone !== "undefined" && !buyer.phone) {
      dispatchBuyer({ key: "phone", value: String(phone) });
    }
  }, [buyer.fullName, buyer.phone]);

  const {
    customerId: customerIdState,
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    addressModalOpen,
    openAddressModal,
    closeAddressModal,
    refreshAddresses,
  } = useAddressInit(applyAddressToBuyer, setNameEmailPhone);

  const backendSubtotal = cart.totals?.subtotal ?? 0;
  const subtotal = useMemo(() => backendSubtotal || items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0), [backendSubtotal, items]);

  const totalWeight = useMemo(() => {
    const calculatedWeight = items.reduce((total, item) => {
      const weightResult = extractCartItemWeight({
        sku: item.sku,
        variantName: item.variantName,
        productName: item.productName
      });

      const itemWeight = weightResult.weight;
      return total + (item.quantity * itemWeight);
    }, 0);

    return calculatedWeight;
  }, [items]);

  const shippingFee = useShippingFee({
    city: buyer.city,
    district: buyer.district,
    ward: buyer.ward,
    altCity: alt.altCity,
    altDistrict: alt.altDistrict,
    altWard: alt.altWard,
    shipToDifferent: buyer.shipToDifferent,
    totalWeight,
    subtotal,
  });
  const [submitLocked, setSubmitLocked] = useState(false);
  const [preSubmitLoading, setPreSubmitLoading] = useState(false);
  const { validateForMethod } = useCheckoutValidation();
  const filteredGlobalWarnings = useMemo(() => (globalWarnings || []).filter((w) => w !== PRICE_WARN), [globalWarnings]);
  const filteredItemWarnings = useMemo(() => {
    const src = itemWarnings || {};
    const cleaned: Record<string, string[]> = {};
    const priceMsg = "Giá sản phẩm chưa khả dụng. Vui lòng kiểm tra lại.";
    for (const [sku, warns] of Object.entries(src)) {
      const others = (warns || []).filter((w) => w !== priceMsg);
      if (others.length > 0) cleaned[sku] = others;
    }
    return cleaned;
  }, [itemWarnings]);

  useEffect(() => {
    try {
      const pref = localStorage.getItem("success_no_autodismiss");
      if (pref === "1") setNoAutoDismiss(true);
    } catch { }
    if (!orderSuccessOpen) return;
    setSuccessCountdown(10);
    if (noAutoDismiss) return;
    const iv = setInterval(() => {
      setSuccessCountdown((c) => {
        if (c <= 1) {
          try { setOrderSuccessOpen(false); } catch { }
          try { sessionStorage.removeItem("lastOrderCode"); } catch { }
          setLastOrderCodeState(undefined);
          setPendingRedirectHome(true);
          clearInterval(iv);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [orderSuccessOpen, noAutoDismiss]);

  const pendingNetwork = checkoutMut.isPending || createPaymentLinkMut.isPending;
  const uiLoading = useUiLoading(pendingNetwork, 300);

  useEffect(() => {
    if (!pendingRedirectHome) return;
    try { router.push("/"); } finally {
      setPendingRedirectHome(false);
    }
  }, [pendingRedirectHome, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (items.length === 0) {
          await qc.invalidateQueries({ queryKey: cartKeys.root() });
          await qc.refetchQueries({ queryKey: cartKeys.root() });
        }
      } finally {
        if (!cancelled) setClientReady(true);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { options, selectedCode, appliedCode, discountAmount, applyingDiscount, onSelect, onClear } = useCartDiscount();
  const effectiveShippingFee = useMemo(() => shippingFee, [shippingFee]);
  const total = useMemo(() => Math.max(0, (cart.totals?.totalAfterDiscount ?? (subtotal - (discountAmount || 0))) + effectiveShippingFee), [cart.totals?.totalAfterDiscount, subtotal, effectiveShippingFee, discountAmount]);

  const formDirty = useMemo(() => {
    const hasBuyer = [buyer.fullName, buyer.email, buyer.phone, buyer.district, buyer.ward, buyer.street, buyer.notes]
      .some((v) => (v || "").trim().length > 0);
    const hasAlt = buyer.shipToDifferent && [alt.altFullName, alt.altPhone, alt.altDistrict, alt.altWard, alt.altStreet]
      .some((v) => (v || "").trim().length > 0);
    return hasBuyer || hasAlt;
  }, [buyer.fullName, buyer.email, buyer.phone, buyer.district, buyer.ward, buyer.street, buyer.notes, buyer.shipToDifferent, alt.altFullName, alt.altPhone, alt.altDistrict, alt.altWard, alt.altStreet]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const info = await shippingService.getDistrictsInfo();
        if (!mounted) return;
        const opts = [...(info?.freeship || []), ...(info?.noFreeship || [])];
        setHcmDistrictOptions(opts);
      } catch { }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const guardActive = !orderSuccessOpen && (!!pendingVietQROrderId || !!formDirty);
    if (!guardActive) return;
    try {
      history.pushState({ __exit_guard: true }, '', location.href);
      history.pushState({ __exit_guard: true }, '', location.href);
    } catch { }
    return () => {
    };
  }, [pendingVietQROrderId, formDirty, orderSuccessOpen]);

  const { preSubmitChecks, afterOrderCreated } = useCheckoutFlow({
    validateForMethod,
    buyer,
    alt,
    user,
    isCartLoading,
    itemsLength: items.length,
    canChooseDistrict,
    qc,
    setGlobalWarnings,
    setItemWarnings,
    priceWarnMessage: PRICE_WARN,
    createPaymentLinkMut,
    setFromLinkResponse,
    setPendingVietQROrderId,
    vietQRAcknowledged,
    setBankTfTransferNote,
    setBankTfOpen,
    cart,
    setLastOrderCodeState,
    setVietQRAcknowledged,
    setOrderSuccessOpen,
  });

  const onFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "fullName", value: e.target.value }), []);
  const onPhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "phone", value: e.target.value }), []);
  const onEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "email", value: e.target.value }), []);
  const onCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatchBuyer({ key: "city", value: e.target.value }), []);
  const onDistrictChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => dispatchBuyer({ key: "district", value: e.target.value }), []);
  const onWardChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "ward", value: e.target.value }), []);
  const onStreetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "street", value: e.target.value }), []);
  const onNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => dispatchBuyer({ key: "notes", value: e.target.value }), []);
  const onShipToDifferentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchBuyer({ key: "shipToDifferent", value: e.target.checked }), []);
  const onAltFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchAlt({ key: "altFullName", value: e.target.value }), []);
  const onAltPhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchAlt({ key: "altPhone", value: e.target.value }), []);
  const onAltCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => dispatchAlt({ key: "altCity", value: e.target.value }), []);
  const onAltDistrictChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => dispatchAlt({ key: "altDistrict", value: e.target.value }), []);
  const onAltWardChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchAlt({ key: "altWard", value: e.target.value }), []);
  const onAltStreetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatchAlt({ key: "altStreet", value: e.target.value }), []);
  const onSelectMethod = useCallback(async (m: Method) => {
    if (submitLocked || checkoutMut.isPending || createPaymentLinkMut.isPending) return;
    setMethod(m);
    if (m !== "VIETQR") return;
    const pre = await preSubmitChecks("VIETQR");
    if (!pre.ok) {
      if (pre.msg) showErrorToast({ title: "Không thể tạo VietQR", message: pre.msg });
      return;
    }
    const payload = buildPayload("VIETQR", buyer, alt, appliedCode, shippingFee);
    try { persistDefaultAddress(payload); } catch { }
    try {
      const created = await checkoutMut.mutateAsync(payload);
      await afterOrderCreated(created, "VIETQR");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể khởi tạo VietQR";
      showErrorToast({ title: "Lỗi VietQR", message });
    }
  }, [buyer, alt, appliedCode, shippingFee, preSubmitChecks, checkoutMut, createPaymentLinkMut.isPending, afterOrderCreated, submitLocked, setMethod]);

  const effectiveUser: (User & { customer?: { id?: string } }) | { email: string } | null =
    user || (customerIdState ? { email: "authed@placeholder" } : null);

  const handleAddressModalClose = useCallback(() => closeAddressModal(), [closeAddressModal]);
  const handleSelectSavedAddress = useCallback((sel: CustomerAddress | null) => {
    const id = sel ? String(sel.id) : null;
    setSelectedAddressId(id);
    if (sel) {
      dispatchBuyer({ key: "fullName", value: String(sel.recipientName || "") });
      dispatchBuyer({ key: "phone", value: String((sel.phoneNumber || buyer.phone || "")) });
      dispatchBuyer({ key: "city", value: String(sel.city || "Tp. Hồ Chí Minh") });
      dispatchBuyer({ key: "district", value: String(sel.district || "") });
      dispatchBuyer({ key: "ward", value: String(sel.ward || "") });
      dispatchBuyer({ key: "street", value: String(sel.street || "") });
      try {
        localStorage.setItem(
          "defaultAddress",
          JSON.stringify({
            recipient_name: sel.recipientName,
            phone_number: sel.phoneNumber,
            street: sel.street,
            ward: sel.ward,
            district: sel.district,
            city: sel.city,
          }),
        );
      } catch { }
    }
  }, [setSelectedAddressId, buyer.phone]);

  const handleAddressSave = useCallback(async (p: { fullName: string; phone: string; city: string; district: string; ward: string; street: string; isDefault: boolean; }) => {
    try {
      setSavingAddress(true);
      if (customerIdState) {
        const norm = (s: string) => (s || "").trim().toLowerCase();
        const existing = savedAddresses.find(
          (a) =>
            norm(a.recipientName) === norm(p.fullName) &&
            norm(a.phoneNumber) === norm(p.phone) &&
            norm(a.street) === norm(p.street) &&
            norm(a.ward) === norm(p.ward) &&
            norm(a.district) === norm(p.district) &&
            norm(a.city) === norm(p.city),
        );
        if (existing) {
          if (typeof p.isDefault === "boolean" && p.isDefault !== !!existing.isDefault) {
            try {
              await customerService.updateAddress(customerIdState, String(existing.id), { isDefault: p.isDefault });
            } catch { }
          }
        } else {
          await customerService.addAddress(customerIdState, {
            recipientName: p.fullName,
            phoneNumber: p.phone,
            street: p.street,
            ward: p.ward,
            district: p.district,
            city: p.city,
            isDefault: p.isDefault,
          });
        }
        try {
          await refreshAddresses();
        } catch { }
      }
      dispatchBuyer({ key: "fullName", value: p.fullName });
      // Do not clear phone if new saved address payload misses phone
      dispatchBuyer({ key: "phone", value: p.phone || buyer.phone });
      dispatchBuyer({ key: "city", value: p.city });
      dispatchBuyer({ key: "district", value: p.district });
      dispatchBuyer({ key: "ward", value: p.ward });
      dispatchBuyer({ key: "street", value: p.street });
      try {
        localStorage.setItem(
          "defaultAddress",
          JSON.stringify({
            recipient_name: p.fullName,
            phone_number: p.phone,
            street: p.street,
            ward: p.ward,
            district: p.district,
            city: p.city,
          }),
        );
      } catch { }
      closeAddressModal();
      showSuccessToast({ title: "Đã lưu địa chỉ", message: "Địa chỉ giao hàng đã được lưu." });
    } catch {
      showErrorToast({ title: "Lưu địa chỉ thất bại", message: "Vui lòng thử lại." });
    } finally {
      setSavingAddress(false);
    }
  }, [customerIdState, savedAddresses, closeAddressModal, refreshAddresses, buyer.phone]);

  const handleCopyVietQRNote = copyTransferNote;
  const handleCancelVietQR = cancelPending;

  const handleBankClose = useCallback(async () => {
    try {
      setBankTfOpen(false);
    } catch { }
  }, []);

  const handleCopyBankNote = useCallback(async () => {
    const ok = await copyText(bankTfTransferNote);
    if (ok) showSuccessToast({ title: "Đã sao chép", message: "Nội dung đã được sao chép." });
  }, [bankTfTransferNote]);

  const handleCopyBankAccount = useCallback(async () => {
    const text = `${vietQRBank.accountName || ""} | ${vietQRBank.accountNumber || ""}`;
    const ok = await copyText(text);
    if (ok) showSuccessToast({ title: "Đã sao chép", message: "Số tài khoản đã được sao chép." });
  }, [vietQRBank.accountNumber, vietQRBank.accountName]);



  const handleVietQRSubmit = useCallback(async () => {
    try {
      localStorage.removeItem("cartItems");
    } catch { }
    cart.clear();
    try {
      const key = pendingVietQROrderId ? `vietqr_ack:${pendingVietQROrderId}` : null;
      if (key) sessionStorage.setItem(key, "0");
    } catch { }
    setVietQRAcknowledged(false);
    setOrderSuccessOpen(true);
    showSuccessToast({ title: "Đặt hàng thành công", message: "Cảm ơn bạn đã thanh toán qua VietQR!" });
  }, [cart, pendingVietQROrderId, setVietQRAcknowledged]);

  const handleSubmit = useCheckoutSubmit({
    method,
    buyer,
    alt,
    user,
    appliedCode,
    shippingFee,
    setSubmitLocked,
    setPreSubmitLoading,
    preSubmitChecks,
    afterOrderCreated,
    checkoutMut,
    pendingVietQROrderId,
    onVietQRSubmit: handleVietQRSubmit,
  });

  const onToggleNoAutoDismiss = useCallback((checked: boolean) => {
    setNoAutoDismiss(checked);
    try {
      localStorage.setItem("success_no_autodismiss", checked ? "1" : "0");
    } catch { }
  }, []);
  const onViewOrder = useCallback(() => {
    try {
      router.push("/profile?section=orders&tab=all&page=1&limit=10");
    } catch { }
  }, [router]);
  const onCloseSuccessModal = useCallback(() => {
    setOrderSuccessOpen(false);
    try {
      sessionStorage.removeItem("lastOrderCode");
    } catch { }
    setLastOrderCodeState(undefined);
  }, []);
  const onGoHome = useCallback(() => router.push("/"), [router]);

  useEffect(() => {
    const onDocumentClick = (e: MouseEvent) => {
      if (allowExitRef.current) return;
      if (orderSuccessOpen) return;
      if (!pendingVietQROrderId && !formDirty) return;
      if (exitModalOpen) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-exit-modal-root]')) return;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';
      if (!href) return;
      if (href.startsWith('#')) return;
      if (anchor.getAttribute('target') === '_blank') return;
      if (anchor.getAttribute('download') !== null) return;
      e.preventDefault();
      e.stopPropagation();
      try { e.stopImmediatePropagation?.(); } catch { }
      setPendingNavHref(href);
      setPendingNavBack(false);
      setExitContext(pendingVietQROrderId ? 'vietqr' : 'dirty');
      setExitModalOpen(true);
    };
    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, [pendingVietQROrderId, formDirty, exitModalOpen, orderSuccessOpen]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (allowExitRef.current) return;
      if (orderSuccessOpen) return;
      if (!pendingVietQROrderId && !formDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pendingVietQROrderId, formDirty, orderSuccessOpen]);

  useEffect(() => {
    const onPopState = () => {
      if (allowExitRef.current) return;
      if (orderSuccessOpen) return;
      if (!pendingVietQROrderId && !formDirty) return;
      if (handlingPopRef.current) return;
      handlingPopRef.current = true;
      try { history.forward(); } catch { }
      setTimeout(() => {
        setPendingNavHref(null);
        setPendingNavBack(true);
        setExitContext(pendingVietQROrderId ? 'vietqr' : 'dirty');
        setExitModalOpen(true);
        handlingPopRef.current = false;
      }, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [pendingVietQROrderId, formDirty, orderSuccessOpen]);

  const onExitConfirm = useCallback(async () => {
    try {
      if (exitContext === 'vietqr') {
        await cancelPending();
      }
    } catch { }
    setExitModalOpen(false);
    setExitContext(null);
    allowExitRef.current = true;
    if (pendingNavBack) {
      router.back();
      return;
    }
    if (pendingNavHref) {
      router.push(pendingNavHref);
      setPendingNavHref(null);
    }
  }, [cancelPending, exitContext, pendingNavBack, pendingNavHref, router]);

  const onExitCancel = useCallback(() => {
    setExitModalOpen(false);
    setPendingNavHref(null);
    setPendingNavBack(false);
    setExitContext(null);
    allowExitRef.current = false;
  }, []);

  const submitDisabled = useMemo(() => {
    const base = submitLocked || checkoutMut.isPending || isCartLoading || items.length === 0;
    if (method === "VIETQR") {
      return base;
    }
    return base || createPaymentLinkMut.isPending;
  }, [submitLocked, checkoutMut.isPending, isCartLoading, items.length, method, createPaymentLinkMut.isPending]);
  const submitButtonText = (preSubmitLoading || checkoutMut.isPending || createPaymentLinkMut.isPending)
    ? "đặt hàng..."
    : CHECKOUT_TEXT.actions.placeOrder;

  if (!mounted || !clientReady) {
    return (<CheckoutLoading />);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT COLUMN - Forms (Mobile: top, Desktop: left) */}
            <div className="order-1 lg:order-1">
              <form onSubmit={handleSubmit} className="relative space-y-6">
                {uiLoading && !orderSuccessOpen && !showVietQR && !bankTfOpen && (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  </div>
                )}

                {/* Contact Section */}
                <div className="bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">CONTACT</h2>
                  <BuyerInfoForm
                    user={effectiveUser}
                    values={{
                      fullName: buyer.fullName,
                      email: buyer.email,
                      phone: buyer.phone,
                      city: buyer.city,
                      district: buyer.district,
                      ward: buyer.ward,
                      street: buyer.street,
                      notes: buyer.notes,
                      shipToDifferent: buyer.shipToDifferent,
                      altFullName: alt.altFullName,
                      altPhone: alt.altPhone,
                      altCity: alt.altCity,
                      altDistrict: alt.altDistrict,
                      altWard: alt.altWard,
                      altStreet: alt.altStreet,
                    }}
                    onChange={{
                      onFullNameChange,
                      onEmailChange,
                      onPhoneChange,
                      onCityChange,
                      onDistrictChange,
                      onWardChange,
                      onStreetChange,
                      onNotesChange,
                      onShipToDifferentChange,
                      onAltFullNameChange,
                      onAltPhoneChange,
                      onAltCityChange,
                      onAltDistrictChange,
                      onAltWardChange,
                      onAltStreetChange,
                    }}
                    canChooseDistrict={canChooseDistrict}
                    districtOptions={hcmDistrictOptions}
                  />
                </div>

                {exitModalOpen && (
                  <div
                    className="fixed inset-0 z-[100] bg-black/60"
                    onClick={(e) => { if (e.currentTarget === e.target) onExitCancel(); }}
                  >
                    <div className="flex min-h-[100dvh] items-center justify-center p-4">
                      <div className="w-full max-w-md overflow-hidden rounded-none border-3 border-black bg-[#f5f1e8] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-200" data-exit-modal-root>
                        <div className="flex items-center gap-4 border-b-3 border-black bg-[#fff100] px-5 py-4">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-none border-2 border-black bg-black text-[#fff100]">
                            <AlertTriangle size={24} strokeWidth={2.5} />
                          </span>
                          <div className="font-[family-name:var(--font-retro)] text-lg font-bold text-black uppercase tracking-wider">
                            {exitContext === 'vietqr' ? 'RỜI KHỎI THANH TOÁN?' : 'RỜI KHỎI TRANG?'}
                          </div>
                        </div>
                        <div className="px-6 py-6">
                          {exitContext === 'vietqr' ? (
                            <p className="text-base text-[#2d2d2d] leading-relaxed font-medium">
                              Bạn đang có một đơn hàng đang chờ (VietQR). Bạn có muốn hủy đơn hàng này trước khi rời trang?
                            </p>
                          ) : (
                            <p className="text-base text-[#2d2d2d] leading-relaxed font-medium">
                              Form của bạn có dữ liệu chưa lưu. Nếu rời trang, các thông tin đã nhập có thể bị mất. Bạn có chắc muốn rời trang?
                            </p>
                          )}

                          <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <button
                              type="button"
                              className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border-3 border-black bg-white px-5 py-3 text-sm font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                              onClick={onExitCancel}
                            >
                              Ở LẠI TRANG
                            </button>
                            <button
                              type="button"
                              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-none border-3 border-black px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] ${exitContext === 'vietqr' ? 'bg-[#ff4444] text-white' : 'bg-[#2d2d2d] text-[#fff100]'}`}
                              onClick={onExitConfirm}
                            >
                              {exitContext === 'vietqr' ? 'HỦY ĐƠN VÀ RỜI TRANG' : 'RỜI TRANG'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Fee */}
                <div className="bg-white border border-gray-200 p-6">
                  <ShippingFeeCard
                    shippingFee={shippingFee}
                    formatVND={formatVND}
                    customerId={customerIdState}
                    savedAddresses={savedAddresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={handleSelectSavedAddress}
                    onOpenAddressModal={openAddressModal}
                    currentAddress={{
                      city: buyer.shipToDifferent ? alt.altCity : buyer.city,
                      district: buyer.shipToDifferent ? alt.altDistrict : buyer.district,
                      ward: buyer.shipToDifferent ? alt.altWard : buyer.ward,
                      street: buyer.shipToDifferent ? alt.altStreet : buyer.street,
                    }}
                  />
                </div>

                <AddressModal
                  open={addressModalOpen}
                  districtOptions={hcmDistrictOptions}
                  initial={{
                    fullName: buyer.fullName,
                    phone: buyer.phone,
                    city: buyer.city,
                    district: buyer.district,
                    ward: buyer.ward,
                    street: buyer.street,
                  }}
                  onClose={handleAddressModalClose}
                  saving={savingAddress}
                  onSave={handleAddressSave}
                />

                {/* Payment Methods */}
                <div className="bg-white border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">PAYMENT</h2>
                  <PaymentMethods
                    method={method}
                    total={total}
                    onSelect={onSelectMethod}
                    formatVND={formatVND}
                    bankBrandCode={vietQRBank.bankCode?.toUpperCase()}
                    selectingDisabled={checkoutMut.isPending || createPaymentLinkMut.isPending}
                    pending={checkoutMut.isPending || createPaymentLinkMut.isPending}
                  />
                </div>

                {method === "VIETQR" && showVietQR && vietQRUrl && (
                  <div className="bg-white border border-gray-200 p-6">
                    <VietQRPanel
                      qrUrl={vietQRUrl}
                      transferNote={vietQRTransferNote}
                      bank={{
                        bankCode: vietQRBank.bankCode,
                        bankName: vietQRBank.bankName,
                        accountNumber: vietQRBank.accountNumber,
                        accountName: vietQRBank.accountName,
                      }}
                      onCopyNote={handleCopyVietQRNote}
                      onCancel={handleCancelVietQR}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <SubmitBar
                  total={total}
                  formatVND={formatVND}
                  disabled={submitDisabled}
                  buttonText={submitButtonText}
                  loading={preSubmitLoading || checkoutMut.isPending || createPaymentLinkMut.isPending}
                />
              </form>
            </div>

            {/* RIGHT COLUMN - Product Summary (Mobile: bottom, Desktop: right) */}
            <div className="order-2 lg:order-2">
              <div className="bg-white border border-gray-200 p-6 lg:sticky lg:top-8">
                {/* Order Items */}
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Đơn hàng của bạn</h2>

                <OrderSummary
                  items={toLocalCartItem(items)}
                  subtotal={subtotal}
                  shippingFee={effectiveShippingFee}
                  total={total}
                  formatVND={formatVND}
                  globalWarnings={filteredGlobalWarnings}
                  itemWarnings={filteredItemWarnings}
                  discountAmount={appliedCode ? discountAmount : 0}
                  discountCode={appliedCode || undefined}
                  plain
                  showThumbnails
                />

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <DiscountBox
                    options={options}
                    selectedCode={selectedCode}
                    appliedCode={appliedCode}
                    discountAmount={discountAmount}
                    applyingDiscount={applyingDiscount}
                    itemsLength={items.length}
                    onSelect={onSelect}
                    onClear={onClear}
                    formatVND={formatVND}
                    plain
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BankTransferModal
        open={bankTfOpen}
        total={total}
        transferNote={bankTfTransferNote}
        bankCode={vietQRBank.bankCode}
        bankName={vietQRBank.bankName}
        accountNumber={vietQRBank.accountNumber}
        accountName={vietQRBank.accountName}
        onClose={handleBankClose}
        onCopyNote={handleCopyBankNote}
        onCopyAccount={handleCopyBankAccount}
      />

      <OrderSuccessModal
        open={orderSuccessOpen}
        lastOrderCode={lastOrderCodeState}
        successCountdown={successCountdown}
        noAutoDismiss={noAutoDismiss}
        onToggleNoAutoDismiss={onToggleNoAutoDismiss}
        onViewOrder={onViewOrder}
        onClose={onCloseSuccessModal}
        onGoHome={onGoHome}
      />
    </>
  );
}
