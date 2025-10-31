import { useEffect, useRef, useState } from "react";
import { productService } from "@/service/product.service";

export type QuickSearchItem = {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number;
  category?: { name?: string | null } | null;
  supplier?: { name?: string | null } | null;
  minEffectivePrice?: number | null;
  inStock?: boolean;
};

export function useProductSearch(term: string, limit = 6) {
  const [results, setResults] = useState<QuickSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounced = useDebounce(term.trim(), 250);

  useEffect(() => {
    const q = debounced;
    if (!q) {
      setResults([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    productService
      .searchQuick(q, limit)
      .then((res) => {
        if (cancelled) return;
        const items = (res?.data ?? []) as QuickSearchItem[];
        setResults(items);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Không thể tải kết quả");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, limit]);

  return { results, loading, error };
}

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setDebouncedValue(value);
      return;
    }
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, Math.max(0, delay));
    return () => {
      window.clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
