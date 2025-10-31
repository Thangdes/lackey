"use client";

import Link from "next/link";
import { ROUTES } from "@/constant/route";

type Props = {
  globalWarnings?: string[];
  itemWarnings?: Record<string, string[]>;
  showBackLink?: boolean;
};

export function WarningList({ globalWarnings, itemWarnings, showBackLink = true }: Props) {
  const hasGlobal = !!(globalWarnings && globalWarnings.length);
  const hasItem = !!(itemWarnings && Object.keys(itemWarnings).length);
  if (!hasGlobal && !hasItem) return null;

  const firstWarnSku = itemWarnings && Object.keys(itemWarnings)[0];
  const href = firstWarnSku ? `${ROUTES.cart}?highlight=${encodeURIComponent(firstWarnSku)}` : ROUTES.cart;

  return (
    <>
      {hasGlobal && (
        <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800">
          <ul className="list-disc pl-4 space-y-1">
            {globalWarnings!.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {showBackLink && (hasGlobal || hasItem) && (
        <div className="mt-2 text-[11px]">
          <Link href={href} className="underline text-amber-800 hover:text-amber-700">Quay lại giỏ hàng để chỉnh sửa</Link>
        </div>
      )}
    </>
  );
}
