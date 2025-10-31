"use client";

import React from "react";
import Image from "next/image";
import { Truck } from "lucide-react";

const TrustBadges: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 text-neutral-600">
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/momo.svg" alt="MoMo" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/vnpay.svg" alt="VNPay" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/zalopay.svg" alt="COD" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/visa.svg" alt="Visa" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/mastercard.svg" alt="Mastercard" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/jcb.svg" alt="COD" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs">
        <Image src="/logo/payment/cash.svg" alt="COD" width={24} height={24} /> 
      </span>
      <span className="inline-flex items-center gap-1 text-xs mt-0.5">
        <Truck className="h-6 w-6" /> Miễn phí giao hàng khi đủ điều kiện
      </span>
    </div>
  );
};

export default TrustBadges;
