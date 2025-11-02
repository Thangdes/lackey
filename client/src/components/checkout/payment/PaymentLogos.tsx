"use client";

/* eslint-disable @next/next/no-img-element */
import type { PaymentMethod as Method } from "@/type/checkout";

export const shortLabel: Record<Method, string> = {
  COD: "COD",
  VIETQR: "QR",
  BANK_TRANSFER: "Bank",
  CARD: "Card",
  MOMO: "MoMo",
  ZALOPAY: "Zalo",
};

export const MethodLogo: React.FC<{ m: Method; className?: string }> = ({ m, className }) => {
  const cls = `h-6 md:h-6 lg:h-8 ${className || ""}`;
  if (m === "COD") return (<img src="/logo/payment/cash.svg" alt="Tiền mặt" className={cls} />);
  if (m === "VIETQR") return (<img src="/logo/payment/vnpay.svg" alt="VietQR" className={cls} />);
  if (m === "BANK_TRANSFER") return (<img src="/logo/payment/atm.svg" alt="Chuyển khoản" className={cls} />);
  if (m === "MOMO") return (<img src="/logo/payment/momo.svg" alt="MoMo" className={cls} />);
  if (m === "ZALOPAY") return (<img src="/logo/payment/zalopay.svg" alt="ZaloPay" className={cls} />);
  if (m === "CARD") return (
    <div className="flex items-center gap-2">
      <img src="/logo/payment/visa.svg" alt="Visa" className={cls} />
      <img src="/logo/payment/mastercard.svg" alt="Mastercard" className={cls} />
      <img src="/logo/payment/jcb.svg" alt="JCB" className={cls} />
    </div>
  );
  return null;
};

export function getOrderedEntries(meta: Partial<Record<Method, { enabled?: boolean }>>): Method[] {
  return (['COD','VIETQR','BANK_TRANSFER'] as Method[]).filter((m) => !!meta[m]?.enabled);
}

export const bankManualLogos: Array<{ src: string; label: string }> = [
  { src: "/logo/bank/acb-icon.png", label: "ACB" },
  { src: "/logo/bank/bidv-icon.png", label: "BIDV" },
  { src: "/logo/bank/kienlongbank-icon.png", label: "Kienlongbank" },
  { src: "/logo/bank/mbbank-icon.png", label: "MBBank" },
  { src: "/logo/bank/msb-icon.png", label: "MSB" },
  { src: "/logo/bank/ocb-icon.png", label: "OCB" },
  { src: "/logo/bank/tpbank-icon.png", label: "TPBank" },
  { src: "/logo/bank/vpbank-icon.png", label: "VPBank" },
];
