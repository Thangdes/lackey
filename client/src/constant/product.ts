import type { ProductSort } from "@/type/product";

export const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: "Phổ biến", value: "popularity" },
  { label: "Đánh giá cao", value: "rating" },
  { label: "Giá thấp đến cao", value: "priceAsc" },
  { label: "Giá cao đến thấp", value: "priceDesc" },
];


export const SORT_DISPLAY: Record<ProductSort, { icon: string; shortLabel: string }> = {
  popularity: { icon: "🔥", shortLabel: "Phổ biến" },
  rating: { icon: "⭐", shortLabel: "Đánh giá" },
  priceAsc: { icon: "📈", shortLabel: "Giá tăng" },
  priceDesc: { icon: "📉", shortLabel: "Giá giảm" },
};


export const OFFER_OPTIONS: string[] = [
  "Giảm giá",
  "Miễn phí vận chuyển", 
  "Khuyến mãi đặc biệt",
  "Combo tiết kiệm",
  "Mua 1 tặng 1",
  "Giảm giá theo số lượng"
];


export const STYLE_OPTIONS: string[] = [
  "Acrylic",
  "Kim loại",
  "Da",
  "Gỗ", 
  "Nhựa",
  "Vải",
  "Cao su",
  "Mica"
];
