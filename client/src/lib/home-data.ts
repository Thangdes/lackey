import type { Product } from "@/type/product";
import type { Category } from "@/type/category";

const SSR_BASE = (
  process.env.NEXT_INTERNAL_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8000"
).replace(/\/$/, "");

const API_PREFIX = (
  process.env.NEXT_INTERNAL_API_PREFIX ||
  process.env.NEXT_PUBLIC_API_PREFIX ||
  "/api/v1"
).replace(/\/$/, "");

function apiUrl(path: string) {
  const base = /^https?:\/\//i.test(SSR_BASE) ? SSR_BASE : "http://localhost:8000";
  return `${base}${API_PREFIX}/${path.replace(/^\//, "")}`;
}

type ProductListResponse = {
  data?: Product[];
  meta?: unknown;
};

async function fetchJson<T>(url: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.success === true && json?.data !== undefined) return json.data as T;
    return json as T;
  } catch {
    return null;
  }
}

export type HomeSectionProduct = {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl?: string | null;
  images?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  buyCount?: number;
  totalBuyCount?: number;
  category?: { id?: string; name?: string; slug?: string };
  supplier?: { id?: string; name?: string };
  brand?: string;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    discountPrice?: number | null;
    stockQuantity: number;
  }>;
  priceEffective?: number | null;
  compareAt?: number | null;
  isOnSale?: boolean;
  discountPercent?: number | null;
  isOutOfStock?: boolean;
  totalStock?: number;
  badges?: string[];
};

function normalizeProducts(raw: unknown): HomeSectionProduct[] {
  const list = (() => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      const r = raw as Record<string, unknown>;
      if (Array.isArray(r.data)) return r.data;
    }
    return [];
  })();

  return list.map((p: Record<string, unknown>) => ({
    id: String(p.id ?? ""),
    name: String(p.name ?? ""),
    slug: String(p.slug ?? ""),
    thumbnailUrl: (p.thumbnailUrl as string) ?? null,
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    ratingAvg: Number(p.ratingAvg ?? 0),
    ratingCount: Number(p.ratingCount ?? 0),
    buyCount: Number(p.buyCount ?? 0),
    totalBuyCount: Number(p.totalBuyCount ?? p.buyCount ?? 0),
    category: p.category as HomeSectionProduct["category"],
    supplier: p.supplier as HomeSectionProduct["supplier"],
    brand: (p.brand as string) ?? undefined,
    variants: Array.isArray(p.variants) ? (p.variants as HomeSectionProduct["variants"]) : [],
    priceEffective: typeof p.priceEffective === "number" ? p.priceEffective : null,
    compareAt: typeof p.compareAt === "number" ? p.compareAt : null,
    isOnSale: Boolean(p.isOnSale),
    discountPercent: typeof p.discountPercent === "number" ? p.discountPercent : null,
    isOutOfStock: Boolean(p.isOutOfStock),
    totalStock: Number(p.totalStock ?? 0),
    badges: Array.isArray(p.badges) ? (p.badges as string[]) : [],
  }));
}

export async function fetchHomeProducts(): Promise<{
  bestSellers: HomeSectionProduct[];
  keycaps: HomeSectionProduct[];
  switches: HomeSectionProduct[];
  kits: HomeSectionProduct[];
  accessories: HomeSectionProduct[];
  categories: Category[];
}> {
  const [
    bestSellersRaw,
    keycapsRaw,
    switchesRaw,
    kitsRaw,
    accessoriesRaw,
    categoriesRaw,
  ] = await Promise.all([
    fetchJson<ProductListResponse>(
      apiUrl("/products?sort=buy_desc&limit=12&page=1"),
    ),
    fetchJson<ProductListResponse>(
      apiUrl("/products?categorySlugs=keycap&sort=buy_desc&limit=6&page=1"),
    ),
    fetchJson<ProductListResponse>(
      apiUrl("/products?categorySlugs=switch&sort=buy_desc&limit=6&page=1"),
    ),
    fetchJson<ProductListResponse>(
      apiUrl("/products?categorySlugs=bo-kit-tu-lap&sort=buy_desc&limit=6&page=1"),
    ),
    fetchJson<ProductListResponse>(
      apiUrl("/products?categorySlugs=lube-phu-kien&sort=buy_desc&limit=6&page=1"),
    ),
    fetchJson<Category[]>(apiUrl("/categories")),
  ]);

  return {
    bestSellers: normalizeProducts(bestSellersRaw),
    keycaps: normalizeProducts(keycapsRaw),
    switches: normalizeProducts(switchesRaw),
    kits: normalizeProducts(kitsRaw),
    accessories: normalizeProducts(accessoriesRaw),
    categories: Array.isArray(categoriesRaw)
      ? (categoriesRaw as Category[])
      : [],
  };
}
