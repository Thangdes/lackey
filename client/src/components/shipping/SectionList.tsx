"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function SectionList({ items, bulletClass }: { items: string[]; bulletClass: string }) {
  const [loading, setLoading] = useState(true);
  const data = useMemo(() => items ?? [], [items]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <ul className="mt-3 grid gap-2 text-neutral-700 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2">
            <span className={`mt-1 inline-block size-1.5 shrink-0 rounded-full ${bulletClass}`} aria-hidden />
            <Skeleton className="h-4 w-3/4" />
          </li>
        ))}
      </ul>
    );
  }

  if (!data.length) {
    return (
      <EmptyState
        title="Chưa có thông tin"
        description="Danh sách sẽ được cập nhật khi có dữ liệu."
      />
    );
  }

  return (
    <ul className="mt-3 grid gap-2 text-neutral-700 md:grid-cols-2">
      {data.map((i) => (
        <li key={i} className="flex items-center gap-2 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2">
          <span className={`mt-1 inline-block size-1.5 shrink-0 rounded-full ${bulletClass}`} aria-hidden />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
