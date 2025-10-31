"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiFacebook, SiInstagram } from "react-icons/si";
import {
    FOOTER_SECTIONS,
    PAYMENT_SECTION_TITLE,
    COPYRIGHT_TEXT,
    LEGAL_LINKS,
} from "@/constant/footer";
import MarketplaceStrip from "./MarketplaceStrip";
import { useCategoryList } from "@/hook/useCategory";
import { useSupplierList } from "@/hook/useSupplier";
import { ROUTES, buildProductsByCategory } from "@/constant/route";

const Footer = () => {
    const toSlug = (s: string) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
    const { data: categoryData } = useCategoryList();
    const { data: supplierData } = useSupplierList();

    const FEATURED_BRANDS: { label: string; href: string }[] = useMemo(() => {
        const suppliers = Array.isArray(supplierData) ? supplierData : [];
        return suppliers.slice(0, 12).map((s) => ({
            label: s.name,
            href: `${ROUTES.products}?supplier=${encodeURIComponent(toSlug(s.name))}`,
        }));
    }, [supplierData]);
    const SHIPPING_LOGOS: { src: string; alt: string }[] = [
        { src: "/logo/shipping/be.png", alt: "be Delivery" },
        { src: "/logo/shipping/ghn.png", alt: "GHN" },
        { src: "/logo/shipping/grap.png", alt: "Grab" },
        { src: "/logo/shipping/j&t.png", alt: "J&T Express" },
        { src: "/logo/shipping/viettelpost.png", alt: "Viettel Post" },
        { src: "/logo/shipping/vnpost.png", alt: "VNPost" },
    ];
    const FEATURED_CATEGORIES: { label: string; href: string }[] = useMemo(() => {
        const categories = Array.isArray(categoryData) ? categoryData : [];
        return categories.slice(0, 12).map((c) => ({
            label: c.name,
            href: buildProductsByCategory(c.id),
        }));
    }, [categoryData]);
    const PAYMENT_LOGOS: { src: string; alt: string }[] = [
        { src: "/logo/payment/visa.svg", alt: "Visa" },
        { src: "/logo/payment/mastercard.svg", alt: "Mastercard" },
        { src: "/logo/payment/jcb.svg", alt: "JCB" },
        { src: "/logo/payment/vnpay.svg", alt: "VNPAY" },
        { src: "/logo/payment/momo.svg", alt: "MoMo" },
        { src: "/logo/payment/zalopay.svg", alt: "ZaloPay" },
        { src: "/logo/payment/atm.svg", alt: "ATM nội địa" },
        { src: "/logo/payment/cash.svg", alt: "Tiền mặt" },
    ];
    return (
        <>
        <MarketplaceStrip />
        <footer
          className="text-neutral-900 w-full flex flex-col"
          style={{
            backgroundColor: '#ffffff',
          }}
        >
            <div className="grid grid-cols-1 border-t-2 border-neutral-200">
                <div className="border-b-2 border-neutral-200 px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
                    <div className="md:hidden space-y-2">
                        {FOOTER_SECTIONS.filter((s) => !(((s as unknown as { hidden?: boolean })?.hidden) === true)).slice(0, 4).map((section) => (
                            <details key={section.title} className="rounded-lg border border-neutral-200 bg-transparent open:bg-black/5">
                                <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between">
                                    <span className="text-base font-semibold text-neutral-900">{section.title}</span>
                                    <span aria-hidden className="ml-3 text-neutral-500">▾</span>
                                </summary>
                                <div className="px-4 pb-3 space-y-2 text-sm">
                                    {section.links.filter((l) => !(((l as unknown as { hidden?: boolean })?.hidden) === true)).map((l) => (
                                        <Link key={l.label} href={l.href} className="block pointer-events-auto text-neutral-700 hover:text-[var(--brand-secondary)] hover:underline underline-offset-4 decoration-2 transition-colors">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>

                    <div className={`hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 2xl:gap-12`}>
                        {FOOTER_SECTIONS.filter((s) => !(((s as unknown as { hidden?: boolean })?.hidden) === true)).slice(0, 4).map((section) => (
                            <div key={section.title}>
                                <h3 className="text-base lg:text-lg xl:text-xl font-semibold mb-3 text-neutral-900">{section.title}</h3>
                                <div className="space-y-2 text-sm xl:text-base">
                                    {section.links.filter((l) => !(((l as unknown as { hidden?: boolean })?.hidden) === true)).map((l) => (
                                        <Link key={l.label} href={l.href} className="block pointer-events-auto text-neutral-700 hover:text-[var(--brand-secondary)] hover:underline underline-offset-4 decoration-2 transition-colors">
                                            {l.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="">
                <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 bg-[var(--color-athens-gray-50)] shadow-sm border border-white/20 backdrop-blur-sm">
                    <div className="md:py-7">
                        <h3 className="text-base lg:text-lg xl:text-xl font-semibold mb-4 text-[var(--color-cod-gray-900)]">{PAYMENT_SECTION_TITLE}</h3>
                        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible no-scrollbar items-center justify-start gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                            {PAYMENT_LOGOS.map((logo) => (
                                <div
                                    key={logo.alt}
                                    className="group inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                                    role="img"
                                    aria-label={logo.alt}
                                    title={logo.alt}
                                >
                                    <Image
                                        src={logo.src}
                                        alt={logo.alt}
                                        width={96}
                                        height={36}
                                        loading="lazy"
                                        className={[
                                            "object-contain w-auto transition-opacity opacity-100 hover:opacity-95",
                                            logo.alt === "VNPAY" ? "h-6 md:h-7 xl:h-8" : "h-7 md:h-8 xl:h-9",
                                        ].join(" ")}
                                    />
                                </div>
                            ))}
                            
                        </div>  
                        <div className="mt-6 border-t border-neutral-200 pt-6">
                            <h4 className="text-sm font-semibold text-[var(--color-cod-gray-900)] mb-3">Đối tác vận chuyển</h4>
                            <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible no-scrollbar items-center justify-start gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                                {(["GHN","Viettel Post","VNPost","Grab","J&T Express","be Delivery"] as const)
                                    .map(name => SHIPPING_LOGOS.find(l => l.alt === name))
                                    .filter((l): l is { src: string; alt: string } => Boolean(l))
                                    .map((logo) => (
                                        <div
                                            key={logo.alt}
                                            className="group inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cod-gray-900)]/20"
                                            role="img"
                                            aria-label={logo.alt}
                                            title={logo.alt}
                                        >
                                            <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={32}
                                                height={32}
                                                loading="lazy"
                                                decoding="async"
                                                fetchPriority="low"
                                                unoptimized
                                                className="object-contain w-auto transition-opacity opacity-100 hover:opacity-95"
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b-2 border-neutral-200 px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 xl:py-10 2xl:py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-10 2xl:gap-12">
                        <div>
                            <h3 className="text-base lg:text-lg xl:text-xl font-semibold mb-3 text-neutral-900">Thương hiệu nổi bật</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm xl:text-base">
                                {FEATURED_BRANDS.map((b) => (
                                    <Link key={b.label} href={b.href} className="text-neutral-700 hover:text-[var(--brand-secondary)] hover:underline underline-offset-4 decoration-2 transition-colors">
                                        {b.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base lg:text-lg xl:text-xl font-semibold mb-3 text-neutral-900">Danh mục sản phẩm</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm xl:text-base">
                                {FEATURED_CATEGORIES.map((c) => (
                                    <Link key={c.label} href={c.href} className="text-neutral-700 hover:text-[var(--brand-secondary)] hover:underline underline-offset-4 decoration-2 transition-colors">
                                        {c.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 border-t border-neutral-200">
                    <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm xl:text-base">
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-2 text-neutral-600">
                                {LEGAL_LINKS.map((l, idx) => (
                                    <React.Fragment key={l.label}>
                                        <Link href={l.href} className="hover:text-[var(--brand-secondary)] hover:underline underline-offset-4 decoration-1 transition-colors">
                                            {l.label}
                                        </Link>
                                        {idx < LEGAL_LINKS.length - 1 && <span className="opacity-30">•</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="text-center md:text-left text-neutral-700 text-xs sm:text-sm">
                                {COPYRIGHT_TEXT}
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end justify-center gap-2 text-neutral-600">
                            <div className="flex items-center gap-2 md:gap-3">
                                <Link
                                  href="#"
                                  aria-label="Facebook"
                                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/5 hover:text-[var(--brand-secondary)] transition-colors"
                                >
                                    <SiFacebook className="h-4 w-4" aria-hidden="true" />
                                    <span className="hidden sm:inline">Facebook</span>
                                </Link>
                                <Link
                                  href="#"
                                  aria-label="Instagram"
                                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/5 hover:text-[var(--brand-secondary)] transition-colors"
                                >
                                    <SiInstagram className="h-4 w-4" aria-hidden="true" />
                                    <span className="hidden sm:inline">Instagram</span>
                                </Link>
                            </div>
                            <span className="text-neutral-500 text-xs sm:text-sm whitespace-nowrap">LắcKey</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}


export default Footer