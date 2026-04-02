/**
 * Product component props types
 */

import type { Product, ProductVariant, ProductSort } from "./product";
import type { OptionItem } from "@/hook/useOptionsData";

export type ProductClientViewProps = {
  product: Product;
  thumbCols?: {
    base?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
};

export type ProductBreadcrumbProps = {
  product: Product;
};

export type ProductGalleryProps = {
  name: string;
  images: string[];
  activeImg: number;
  setActiveImg: (idx: number) => void;
  isSale?: boolean;
};

export type ProductDetailGalleryColumnProps = {
  name: string;
  images: string[];
  activeImg: number;
  setActiveImg: (idx: number) => void;
  isSale?: boolean;
};

export type ProductDetailInfoColumnProps = {
  name: string;
  ratingValue: number;
  fullStars: number;
  ratingCount: number;
  selectedVariant: ProductVariant | null;
  variants: ProductVariant[];
  onVariantChange: (id: string) => void;
  categoryName?: string | null;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierEmail?: string | null;
  supplierPhone?: string | null;
  supplierAddress?: string | null;
  supplierDescription?: string | null;
  showSupplierContacts?: boolean;
  showSupplierDescription?: boolean;
  outOfStock?: boolean;
  cartQty: number;
  maxStock: number;
  handleAddToCart: () => Promise<void>;
  adding: boolean;
  handleIncrease: () => void;
  handleDecrease: () => void;
};

export type ProductMobileBarProps = {
  price?: number;
  compareAt?: number;
  isSale?: boolean;
  discountPercent?: number;
  cartQty: number;
  maxStock: number;
  handleDecrease: () => void;
  handleIncrease: () => void;
  handleAddToCart: () => Promise<void>;
  adding: boolean;
};

export type ProductRelatedSectionProps = {
  related: Product[];
  loading?: boolean;
  categorySlug?: string | null;
  categoryName?: string | null;
};

export type ProductTabsProps = {
  tab: "desc" | "reviews" | "info" | "supplier";
  onChange: (t: "desc" | "reviews" | "info" | "supplier") => void;
  description?: string | null;
  reviewsCount?: number;
};

export type ProductTabsSectionProps = {
  tab: "desc" | "reviews" | "info" | "supplier";
  onChange: (tab: "desc" | "reviews" | "info" | "supplier") => void;
  description?: string | null;
  productId: string;
  supplierId?: string | null;
  supplierName?: string | null;
  supplierEmail?: string | null;
  supplierPhone?: string | null;
  supplierAddress?: string | null;
  supplierDescription?: string | null;
};

export type ProductSEOProps = {
  product: Product;
  images: string[];
  selectedVariant?: ProductVariant | null;
};

export type ProductsFilterSidebarProps = {
  className?: string;
  show?: boolean;
  sort: ProductSort;
  onChangeSort: (s: ProductSort) => void;
  OFFER_OPTIONS: OptionItem[];
  BRAND_OPTIONS: OptionItem[];
  CATEGORY_OPTIONS: OptionItem[];
  selectedOffers: string[];
  selectedBrands: string[];
  selectedDietary: string[];
  selectedCategories: string[];
  toggleOffer: (key: string) => void;
  toggleBrand: (id: string) => void;
  toggleDietary: (val: string) => void;
  toggleCategory: (id: string) => void;
};

export type FilterBarProps = {
  productCount?: number;
  selectedSize?: string;
  selectedType?: string;
  selectedSort?: string;
  onSizeChange?: (size: string) => void;
  onTypeChange?: (type: string) => void;
  onSortChange?: (sort: string) => void;
};

export type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
};

export type SelectedFilterChipsProps = {
  categoryOptions: OptionItem[];
  brandOptions: OptionItem[];
  selectedCategories: string[];
  selectedBrands: string[];
  onRemoveCategory: (id: string) => void;
  onRemoveBrand: (id: string) => void;
  onClearAll?: () => void;
};

export type PromoBannerProps = {
  className?: string;
  fullBleed?: boolean;
  mobileHidden?: boolean;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  bgColor?: string;
  textColor?: string;
};
