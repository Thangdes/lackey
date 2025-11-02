import type { ProductSort } from "@/type/product";

export const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: "Phổ biến", value: "popularity" },
  { label: "Đánh giá cao", value: "rating" },
  { label: "Giá thấp đến cao", value: "priceAsc" },
  { label: "Giá cao đến thấp", value: "priceDesc" },
];

// Separate mapping for UI enhancements
export const SORT_DISPLAY: Record<ProductSort, { icon: string; shortLabel: string }> = {
  popularity: { icon: "🔥", shortLabel: "Phổ biến" },
  rating: { icon: "⭐", shortLabel: "Đánh giá" },
  priceAsc: { icon: "📈", shortLabel: "Giá tăng" },
  priceDesc: { icon: "📉", shortLabel: "Giá giảm" },
};

// Filter options for offers/promotions
export const OFFER_OPTIONS: string[] = [
  "Giảm giá",
  "Miễn phí vận chuyển", 
  "Khuyến mãi đặc biệt",
  "Combo tiết kiệm",
  "Mua 1 tặng 1",
  "Giảm giá theo số lượng"
];

// Filter options for dietary/lifestyle
export const DIETARY_OPTIONS: string[] = [
  "Organic",
  "Không đường",
  "Ít muối", 
  "Cho trẻ em",
  "Người ăn chay",
  "Không gluten",
  "Ít calo",
  "Tự nhiên"
];
