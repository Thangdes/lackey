"use client";

import React from "react";
import { Truck, Headphones, RefreshCcw, Shield } from "lucide-react";
import Link from "next/link";

export type ValueProp = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export type ValuePropsSectionProps = {
  title?: string;
  items?: ValueProp[];
  /** Use brand accent for icon bubble */
  useBrandAccent?: boolean;
  /** Wrap with gradient strip and borders similar to Header/Footer */
  gradientStrip?: boolean;
  gradientCss?: string;
};

const defaultItems: ValueProp[] = [
  {
    icon: <Truck className="h-6 w-6" aria-hidden />,
    title: "Giao hàng hỏa tốc",
    description: "Nhanh 1–3 ngày toàn quốc, đóng gói an toàn",
    ctaHref: "/about/shipping",
    ctaLabel: "Tìm hiểu thêm",
  },
  {
    icon: <Headphones className="h-6 w-6" aria-hidden />,
    title: "CSKH tận tâm 24/7",
    description: "Zalo/Facebook/Hotline luôn sẵn sàng",
    ctaHref: "/support",
    ctaLabel: "Liên hệ",
  },
  {
    icon: <RefreshCcw className="h-6 w-6" aria-hidden />,
    title: "Đổi trả dễ dàng",
    description: "7 ngày đổi trả nếu lỗi từ nhà sản xuất",
    ctaHref: "/return",
    ctaLabel: "Chính sách",
  },
  {
    icon: <Shield className="h-6 w-6" aria-hidden />,
    title: "Chất lượng đảm bảo",
    description: "Nguồn gốc rõ ràng, an toàn cho sức khỏe",
    ctaHref: "/about/quality",
    ctaLabel: "Cam kết",
  },
];

const ValueProps: React.FC<ValuePropsSectionProps> = ({ title = "Vì sao chọn chúng tôi", items, useBrandAccent = true, gradientStrip = false, gradientCss }) => {
  const list = items && items.length ? items : defaultItems;
  return (
    <section aria-label="Value propositions" className={gradientStrip ? "py-0" : "py-8 md:py-12"}>
      <div
        className={gradientStrip ? "border-y-2" : ""}
        style={gradientStrip ? {
          background: gradientCss || "linear-gradient(90deg, var(--color-plantation-950), var(--color-plantation-800), var(--color-plantation-950))",
          borderColor: "rgba(255,255,255,0.2)",
        } : undefined}
      >
        <div className={`px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 ${gradientStrip ? "py-8 md:py-12" : ""}`}>
          <div className="mb-6 md:mb-8">
            <h2
              className={gradientStrip ? "text-white" : "text-[var(--color-cod-gray-900)]"}
              style={{
                fontSize: "var(--font-size-h6, 1.125rem)",
                fontWeight: "var(--font-weight-semibold, 600)",
                letterSpacing: "var(--tracking-tight, -0.01em)",
              }}
            >
              {title}
            </h2>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {list.map((vp, idx) => (
            <div
              key={idx}
              className={[
                "rounded-xl p-4 md:p-5 transition-all",
                gradientStrip
                  ? "border-2 border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10 text-white"
                  : "border border-surface bg-surface hover:shadow-md",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-full",
                  gradientStrip
                    ? (useBrandAccent
                        ? "bg-white/15 text-white"
                        : "bg-white/10 text-white")
                    : (useBrandAccent
                        ? "bg-[var(--color-cod-gray-900)] text-white"
                        : "bg-black/5 text-[var(--color-cod-gray-900)]"),
                ].join(" ")}>
                  {vp.icon}
                </span>
                <div>
                  <h3 className={[
                    "text-sm md:text-base font-semibold",
                    gradientStrip ? "text-white" : "text-[var(--color-cod-gray-900)]",
                  ].join(" ")}>{vp.title}</h3>
                  {vp.description ? (
                    <p className={[
                      "mt-1 text-sm",
                      gradientStrip ? "text-white/80" : "text-neutral-700",
                    ].join(" ")}>{vp.description}</p>
                  ) : null}
                  {vp.ctaHref && vp.ctaLabel ? (
                    <div className="mt-2">
                      <Link
                        href={vp.ctaHref}
                        className={[
                          "inline-flex items-center text-sm font-medium underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                          gradientStrip
                            ? "text-white hover:text-[var(--color-seagull-300)] hover:underline focus-visible:ring-white/50 focus-visible:ring-offset-white/10"
                            : "text-[var(--color-cod-gray-900)] hover:underline focus-visible:ring-black/20 focus-visible:ring-offset-white",
                        ].join(" ")}
                        aria-label={`${vp.ctaLabel} – ${vp.title}`}
                      >
                        {vp.ctaLabel}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProps;

