"use client";

import type { Product } from "@/type/product";

const KEY = "recentlyViewed";
const LIMIT = 12;

function safeParse(json: string | null): Product[] {
  try {
    if (!json) return [];
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function getRecentProducts(): Product[] {
  try {
    if (typeof window === "undefined") return [];
    return safeParse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

export function addRecentProduct(p: Product) {
  try {
    if (typeof window === "undefined") return;
    const list = getRecentProducts();
    const filtered = list.filter((it) => it.id !== p.id);
    const next = [stripProduct(p), ...filtered].slice(0, LIMIT);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

function stripProduct(p: Product): Product {
  const thumb = p.thumbnailUrl || p.images?.[0] || null;
  const variants = Array.isArray(p.variants) && p.variants.length > 0 ? [p.variants[0]] : [];
  return {
    ...p,
    thumbnailUrl: thumb || undefined,
    images: undefined,
    variants,
  } as Product;
}
