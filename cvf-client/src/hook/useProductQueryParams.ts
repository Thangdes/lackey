"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductSort } from "@/type/product";
import { SORT_OPTIONS } from "@/constant/product";

const arraysEqual = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

export type UseProductQueryParamsState = {
  sort: ProductSort;
  setSort: (v: ProductSort) => void;
  q: string | undefined;
  setQ: (v: string | undefined) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategorySlugs: string[];
  setSelectedCategorySlugs: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOffers: string[];
  setSelectedOffers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  hydrated: boolean;
  activeFilterCount: number;
};

export function useProductQueryParams(): UseProductQueryParamsState {
  const [sort, setSort] = useState<ProductSort>("popularity");
  const [q, setQ] = useState<string | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const activeFilterCount = useMemo(
    () => selectedCategories.length + selectedOffers.length + selectedBrands.length,
    [selectedCategories.length, selectedOffers.length, selectedBrands.length]
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastWrittenQsRef = useRef<string | null>(null);
  const lastSyncedSearchParamsRef = useRef<string | null>(null);

  useEffect(() => {
    const s = searchParams?.get("sort");
    const allowed = new Set<string>(SORT_OPTIONS.map((o) => o.value));
    if (s && allowed.has(s)) {
      setSort(s as unknown as ProductSort);
    }
    const qParam = searchParams?.get("q") || undefined;
    if (qParam !== undefined) setQ(qParam.replace(/\+/g, " "));

    const urlCats = searchParams?.getAll("categoryIds[]") ?? [];
    const singleCat = searchParams?.get("categoryId");
    const nextCats = urlCats.length > 0 ? urlCats : singleCat ? [singleCat] : [];
    if (nextCats.length > 0) setSelectedCategories(nextCats);

    const urlBrands = searchParams?.getAll("supplierIds[]") ?? [];
    const singleBrand = searchParams?.get("supplierId");
    const nextBrands = urlBrands.length > 0 ? urlBrands : singleBrand ? [singleBrand] : [];
    if (nextBrands.length > 0) setSelectedBrands(nextBrands);

    const urlOffers = searchParams?.getAll("offers[]") ?? [];
    if (urlOffers.length > 0) setSelectedOffers(urlOffers);

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!pathname) return;
    const current = searchParams?.toString() || "";
    const params = new URLSearchParams(current);

    if (sort) params.set("sort", sort); else params.delete("sort");
    if (q) params.set("q", q); else params.delete("q");

    params.delete("categoryId");
    const keysToRemoveCats: string[] = [];
    params.forEach((_, key) => { if (key === "categoryIds[]") keysToRemoveCats.push(key); });
    for (const k of keysToRemoveCats) params.delete(k);
    for (const cid of selectedCategories) {
      if (cid) params.append("categoryIds[]", cid);
    }

    params.delete("supplierId");
    const keysToRemoveBrands: string[] = [];
    params.forEach((_, key) => { if (key === "supplierIds[]") keysToRemoveBrands.push(key); });
    for (const k of keysToRemoveBrands) params.delete(k);
    for (const sid of selectedBrands) {
      if (sid) params.append("supplierIds[]", sid);
    }

    // Add offers to URL
    const keysToRemoveOffers: string[] = [];
    params.forEach((_, key) => { if (key === "offers[]") keysToRemoveOffers.push(key); });
    for (const k of keysToRemoveOffers) params.delete(k);
    for (const offer of selectedOffers) {
      if (offer) params.append("offers[]", offer);
    }

    const nextQs = params.toString();
    if (nextQs !== current && nextQs !== lastWrittenQsRef.current) {
      lastWrittenQsRef.current = nextQs;
      router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, { scroll: false });
    }
  }, [sort, selectedCategories, selectedBrands, selectedOffers, pathname, router, q, hydrated]);

  useEffect(() => {
    const current = searchParams?.toString() || "";
    if (lastWrittenQsRef.current === current || lastSyncedSearchParamsRef.current === current) {
      return;
    }
    
    lastSyncedSearchParamsRef.current = current;
    
    const s = searchParams?.get("sort");
    const allowed = new Set<string>(SORT_OPTIONS.map((o) => o.value));
    if (s && allowed.has(s) && s !== sort) {
      setSort(s as unknown as ProductSort);
    }

    const qParam = searchParams?.get("q") || undefined;
    const normalizedQ = qParam ? qParam.replace(/\+/g, " ") : undefined;
    if (normalizedQ !== q) setQ(normalizedQ);

    const urlCats = searchParams?.getAll("categoryIds[]") ?? [];
    const singleCat = searchParams?.get("categoryId");
    const nextCats = urlCats.length > 0 ? urlCats : singleCat ? [singleCat] : [];
    if (!arraysEqual(nextCats, selectedCategories)) {
      setSelectedCategories(nextCats);
    }

    const urlBrands = searchParams?.getAll("supplierIds[]") ?? [];
    const singleBrand = searchParams?.get("supplierId");
    const nextBrands = urlBrands.length > 0 ? urlBrands : singleBrand ? [singleBrand] : [];
    if (!arraysEqual(nextBrands, selectedBrands)) {
      setSelectedBrands(nextBrands);
    }

    const urlOffers = searchParams?.getAll("offers[]") ?? [];
    if (!arraysEqual(urlOffers, selectedOffers)) {
      setSelectedOffers(urlOffers);
    }
  }, [searchParams, sort, q, selectedBrands, selectedOffers]);

  return {
    sort,
    setSort,
    q,
    setQ,
    selectedCategories,
    setSelectedCategories,
    selectedOffers,
    setSelectedOffers,
    selectedBrands,
    setSelectedBrands,
    selectedCategorySlugs,
    setSelectedCategorySlugs,
    hydrated,
    activeFilterCount,
  };
}
