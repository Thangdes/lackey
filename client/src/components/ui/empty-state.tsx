"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

type EmptyStateProps = {
  title?: string;
  description?: string;
  className?: string;
  action?: { href: string; label: string } | null;
};

export function EmptyState({
  title = "Chưa có nội dung",
  description = "Nội dung sẽ được cập nhật trong thời gian tới.",
  className,
  action = null,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white/60 p-8 text-center", className)}>
      <div className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <span aria-hidden>∅</span>
      </div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-neutral-600">{description}</p>
      {action && (
        <Link href={action.href} className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-50">
          {action.label}
        </Link>
      )}
    </div>
  );
}
