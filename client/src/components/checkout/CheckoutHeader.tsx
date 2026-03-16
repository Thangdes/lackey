"use client";

import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";

export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 group"
            aria-label="LắcKey"
          >
            <Image
              src="/logo/logo.jpg"
              alt="LắcKey"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105"
              priority
            />
            <span className="font-[family-name:var(--font-retro)] text-2xl text-neutral-900 whitespace-nowrap tracking-wide">
              LắcKey
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
