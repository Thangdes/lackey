"use client";

import React from "react";
import ProductInfo from "./ProductInfo";
import ProductPricing from "./ProductPricing";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductAddToCart from "./ProductAddToCart";
import ProductFeatures from "./ProductFeatures";
import type { ProductVariant } from "@/type/product";

export type ProductDetailInfoColumnProps = {
  name: string;
  ratingValue: number;
  fullStars: number;
  ratingCount: number;
  selectedVariant: (ProductVariant & { price?: number; discountPrice?: number | null }) | undefined;
  categoryId?: string;
  categoryName?: string;
  outOfStock: boolean;
  totalStock: number;
  stockUnit: string;
  onShare: () => void;
  price: number | undefined;
  compareAt: number | undefined;
  isSale: boolean;
  discountPercent?: number;
  variants: Array<ProductVariant & { price?: number; discountPrice?: number | null }>;
  selectedVariantId?: string;
  onVariantChange: (id: string) => void;
  cartQty: number;
  maxStock?: number;
  adding: boolean;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

const ProductDetailInfoColumn: React.FC<ProductDetailInfoColumnProps> = ({
  name,
  ratingValue,
  fullStars,
  ratingCount,
  selectedVariant,
  categoryId,
  categoryName,
  outOfStock,
  totalStock,
  stockUnit,
  onShare,
  price,
  compareAt,
  isSale,
  discountPercent,
  variants,
  selectedVariantId,
  onVariantChange,
  cartQty,
  maxStock,
  adding,
  onAdd,
  onDecrease,
  onIncrease,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5 self-start lg:sticky lg:top-20 w-full max-w-[580px] mx-auto lg:mx-0">
      <ProductInfo
        name={name}
        ratingValue={ratingValue}
        fullStars={fullStars}
        ratingCount={ratingCount}
        selectedVariant={selectedVariant}
        categoryId={categoryId}
        categoryName={categoryName}
        showSupplierContacts={false}
        showSupplierDescription={false}
        outOfStock={outOfStock}
        totalStock={totalStock}
        stockUnit={stockUnit}
        onFavorite={undefined}
        onShare={onShare}
      />

      <ProductPricing
        price={price}
        compareAt={compareAt}
        isSale={isSale}
        discountPercent={discountPercent}
        formatVND={(n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n).replace('₫', '₫').replace('VND', '₫')}
      />

      <ProductVariantSelector
        variants={variants}
        selectedVariantId={selectedVariantId}
        onVariantChange={onVariantChange}
      />

      <ProductAddToCart
        cartQty={cartQty}
        maxStock={maxStock}
        selectedVariant={selectedVariant}
        outOfStock={outOfStock}
        productName={name}
        adding={adding}
        onAdd={onAdd}
        onDecrease={onDecrease}
        onIncrease={onIncrease}
      />

      <ProductFeatures />
    </div>
  );
};

export default ProductDetailInfoColumn;
