"use client";

import React from "react";
import PromoStrip from "@/components/home/PromoStrip";
import { Gift } from "lucide-react";
import { usePromoStrip } from "@/hook/usePromo";

const PromoStripLoader: React.FC = () => {
  const { data: promo } = usePromoStrip();

  if (!promo || !promo.active) return null;

  return (
    <PromoStrip
      message={<span>{promo.message || (promo.code ? <>Ưu đãi với mã <strong>{promo.code}</strong></> : "Ưu đãi")}</span>}
      ctaHref={promo.ctaHref || "/products"}
      ctaLabel={promo.ctaLabel || "Mua ngay"}
      expiresAt={promo.expiresAt || undefined}
      variant={(() => {
        const v = promo.variant;
        return v === "brand" || v === "warning" || v === "success" || v === "neutral" ? v : "brand";
      })()}
      dismissible={promo.dismissible ?? false}
      icon={<Gift className="h-4 w-4" aria-hidden />}
      sticky
      compactOnScroll
      fullBleed={promo.fullBleed ?? false}
    />
  );
};

export default PromoStripLoader;
