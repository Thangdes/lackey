import { http } from "@/utils/http";
import { API } from "@/constant/api";
import type { Review } from "@/type/review";

export const ratingService = {
  
  listByProduct: (productId: string) =>
    http.get<unknown[]>(API.ratings.byProduct(productId)).then((items) =>
      (Array.isArray(items) ? items : []).map(normalizeReview)
    ),
  
  create: (payload: { orderId: string; productId: string; productVariantId: string; ratingValue: number; comment?: string }) =>
    http.post<unknown>(API.ratings.root, payload),
  
  admin: {
    
    list: (params?: { page?: number; limit?: number; search?: string }) => {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;
      const search = params?.search?.trim() || undefined;
      return http
        .get<unknown>(API.ratings.adminList(page, limit, search))
        .then((res) => {
          const r = (res ?? {}) as Record<string, unknown>;
          const items = Array.isArray(r["items"]) ? (r["items"] as unknown[]) : Array.isArray(res) ? (res as unknown[]) : [];
          const total = typeof r["total"] === "number" ? (r["total"] as number) : items.length;
          return { total, items: items.map(normalizeAdminItem) };
        });
    },
    
    delete: (id: string) => http.delete<unknown>(API.ratings.byId(id)),
  },
};

function normalizeReview(r: unknown): Review {
  const o = (r ?? {}) as Record<string, unknown>;

  const toString = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
  const toStringU = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
  const toNumber = (v: unknown, fb = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fb);
  const toDateStringU = (v: unknown): string | undefined =>
    typeof v === "string" ? v : v instanceof Date ? v.toISOString() : undefined;

  const authorRaw = o["author"];
  const authorObj = authorRaw && typeof authorRaw === "object" ? (authorRaw as Record<string, unknown>) : undefined;
  const customer = (o["customer"] && typeof o["customer"] === "object" ? (o["customer"] as Record<string, unknown>) : undefined) || {};
  const authorName =
    toStringU(authorObj?.["name"]) ||
    toStringU(o["authorName"]) ||
    toStringU(customer["fullName"]) ||
    toStringU(customer["name"]) ||
    "";
  const authorAvatarRaw =
    authorObj?.["avatarUrl"] ??
    authorObj?.["avatar"] ??
    o["authorAvatar"] ??
    customer["avatarUrl"] ??
    customer["avatar"];
  const avatarUrl = typeof authorAvatarRaw === "string" ? authorAvatarRaw : undefined;

  const productObj = (o["product"] && typeof o["product"] === "object" ? (o["product"] as Record<string, unknown>) : undefined) || {};
  const productId = toString(o["productId"] ?? productObj["id"]);

  const ratingNumber = toNumber(o["ratingValue"], Number(o["rating"])) || toNumber(o["rating"], 0);

  const content = toStringU(o["comment"]) ?? toStringU(o["content"]);

  const images = ((): string[] | undefined => {
    const a = o["images"];
    if (Array.isArray(a)) return a.filter((x): x is string => typeof x === "string");
    const b = o["imageUrls"];
    if (Array.isArray(b)) return b.filter((x): x is string => typeof x === "string");
    return undefined;
  })();

  return {
    id: toString(o["id"]),
    productId,
    rating: ratingNumber,
    title: toStringU(o["title"]),
    content,
    images,
    createdAt: toDateStringU(o["createdAt"]),
    author: { name: authorName, avatarUrl: avatarUrl ?? null },
  } as Review;
}

function normalizeAdminItem(r: unknown) {
  const o = (r ?? {}) as Record<string, unknown>;
  const toString = (v: unknown, fb = "") => (typeof v === "string" ? v : v != null ? String(v) : fb);
  const toNumber = (v: unknown, fb = 0) => (typeof v === "number" && Number.isFinite(v) ? v : fb);
  const toDateStringU = (v: unknown): string | undefined =>
    typeof v === "string" ? v : v instanceof Date ? v.toISOString() : undefined;

  const customer = (o["customer"] ?? {}) as Record<string, unknown>;
  const product = (o["product"] ?? {}) as Record<string, unknown>;
  const variant = (o["productVariant"] ?? {}) as Record<string, unknown>;
  const order = (o["order"] ?? {}) as Record<string, unknown>;

  return {
    id: toString(o["id"]),
    productName: toString(product["name"]),
    productSlug: toString(product["slug"]),
    variantName: toString(variant["name"], variant["sku"] as string | undefined),
    customerName: toString(customer["fullName"]),
    orderCode: toString(order["orderCode"]),
    rating: toNumber(o["ratingValue"], 0),
    comment: toString(o["comment"], ""),
    createdAt: toDateStringU(o["createdAt"]) || new Date().toISOString(),
  } as {
    id: string;
    productName: string;
    productSlug: string;
    variantName?: string;
    customerName: string;
    orderCode: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}
