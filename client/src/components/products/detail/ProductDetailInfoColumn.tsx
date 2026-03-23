"use client";

import React from "react";
import ProductInfo from "./ProductInfo";
import ProductPricing from "./ProductPricing";
import ProductVariantSelector from "./ProductVariantSelector";
import ProductAddToCart from "./ProductAddToCart";
import type { Product, ProductVariant } from "@/type/product";

export type ProductDetailInfoColumnProps = {
  product?: Product;
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
  onBuyNow: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

const ProductDetailInfoColumn: React.FC<ProductDetailInfoColumnProps> = ({
  product,
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
  onBuyNow,
  onDecrease,
  onIncrease,
}) => {
  return (
    <div className="flex flex-col w-full max-w-[600px] mx-auto lg:mx-0 lg:sticky lg:top-24">
      <ProductInfo
        product={product}
        name={name}
        ratingValue={ratingValue}
        fullStars={fullStars}
        ratingCount={ratingCount}
        selectedVariant={selectedVariant}
        categoryId={categoryId}
        categoryName={categoryName}
        outOfStock={outOfStock}
        totalStock={totalStock}
        stockUnit={stockUnit}
        onShare={onShare}
      />

      <div className="mt-3 mb-6">
        <ProductPricing
          price={price}
          compareAt={compareAt}
          isSale={isSale}
          discountPercent={discountPercent}
          formatVND={(n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n).replace('₫', '₫').replace('VND', '₫')}
        />
      </div>

      <div className="mb-6">
        <ProductVariantSelector
          variants={variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={onVariantChange}
        />
      </div>

      <div className="pt-6 border-t border-neutral-100">
        <ProductAddToCart
          cartQty={cartQty}
          maxStock={maxStock}
          selectedVariant={selectedVariant}
          outOfStock={outOfStock}
          productName={name}
          adding={adding}
          onAdd={onAdd}
          onBuyNow={onBuyNow}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>
    </div>
  );
};

export default ProductDetailInfoColumn;
