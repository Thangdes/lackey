"use client";

import React from "react";

import { IoIosStar } from "react-icons/io";
import { FiShare2, FiPackage } from "react-icons/fi";
import type { Product, ProductVariant } from "@/type/product";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductInfoProps {
  name: string;
  ratingValue: number;
  fullStars: number;
  ratingCount: number;
  selectedVariant?: ProductVariant;
  categoryId?: string;
  categoryName?: string;
  supplierId?: string;
  supplierName?: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  supplierDescription?: string;

  outOfStock: boolean;
  totalStock: number;
  stockUnit: string;
  product?: Product; 
  onShare?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  ratingValue,
  fullStars,
  ratingCount,
  selectedVariant,
  categoryName,


  outOfStock,
  totalStock,
  stockUnit,
  product,
  onShare,
}) => {
  return (
    <div>
      {outOfStock && (
        <div className="mb-3 inline-block">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-200">Hết hàng</span>
        </div>
      )}
      
      <h1 
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight line-clamp-2 mb-3" 
        title={name}
      >
        {name}
      </h1>
      {categoryName && (
        <p className="text-sm text-neutral-500 mb-4">
          Danh mục: <span className="font-medium text-neutral-700">{categoryName}</span>
        </p>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1" aria-label={`Đánh giá ${ratingValue.toFixed(1)}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IoIosStar key={i} className={`h-5 w-5 ${i < fullStars ? "text-amber-400" : "text-neutral-200"}`} />
          ))}
        </div>
        <span className="text-sm font-semibold text-neutral-900">{ratingValue.toFixed(1)}</span>
        <span className="text-sm text-neutral-400">({ratingCount})</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {selectedVariant?.sku && (
          <span className="inline-flex items-center bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full font-medium text-xs">
            SKU: {selectedVariant.sku}
          </span>
        )}
        {!outOfStock && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs ${
            totalStock <= 5 
              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <FiPackage className="h-3.5 w-3.5" />
            {totalStock}+ {stockUnit}
          </span>
        )}
        {product && (
          <WishlistButton
            product={product}
            variant={selectedVariant}
            size="md"
            showLabel={true}
            className="!inline-flex items-center gap-1.5 !px-3 !py-1.5 !text-xs !font-medium !border !border-neutral-200 !bg-white hover:!bg-neutral-50 !transition-all !rounded-full !w-auto !h-auto !text-neutral-700"
          />
        )}
        {onShare && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 bg-white rounded-full hover:bg-neutral-50 text-neutral-700 transition-all"
            aria-label="Chia sẻ sản phẩm"
            onClick={onShare}
          >
            <FiShare2 className="h-3.5 w-3.5" />
            Chia sẻ
          </button>
        )}
      </div>
    </div>
  );
}
;

export default ProductInfo;
