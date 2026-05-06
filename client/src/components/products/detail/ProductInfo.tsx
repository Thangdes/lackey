"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
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
  showSupplierContacts?: boolean;
  showSupplierDescription?: boolean;
  outOfStock: boolean;
  totalStock: number;
  stockUnit: string;
  product?: Product; // NEW: Product data for wishlist
  onShare?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  ratingValue,
  fullStars,
  ratingCount,
  selectedVariant,
  categoryName,
  supplierId,
  supplierName,
  supplierEmail,
  supplierPhone,
  supplierAddress,
  supplierDescription,
  showSupplierContacts = true,
  showSupplierDescription = true,
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
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">Hết hàng</span>
        </div>
      )}
      
      <h1 
        className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight line-clamp-2 mb-2" 
        title={name}
      >
        {name}
      </h1>
      {categoryName && (
        <p className="text-sm text-neutral-500 mb-3">Danh mục: <span className="font-medium text-neutral-700">{categoryName}</span></p>
      )}
      
      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-4">
        <div className="flex items-center gap-0.5" aria-label={`Đánh giá ${ratingValue.toFixed(1)}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IoIosStar key={i} className={`h-4 w-4 ${i < fullStars ? "text-amber-400" : "text-neutral-200"}`} />
          ))}
        </div>
        <span className="font-semibold text-neutral-900">{ratingValue.toFixed(1)}</span>
        <span className="text-neutral-400">({ratingCount} đánh giá)</span>
      </div>
      {/* SKU, Stock, and Share buttons in ONE ROW */}
      <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
        {selectedVariant?.sku && (
          <span className="inline-flex items-center bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full font-medium">SKU: {selectedVariant.sku}</span>
        )}
        {!outOfStock && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${totalStock <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
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
            className="!inline-flex items-center gap-2 !px-3 !py-1.5 !text-xs !font-medium !border !border-neutral-200 !bg-white hover:!bg-neutral-50 !transition-all !rounded-full !w-auto !h-auto !text-neutral-700"
          />
        )}
        {onShare && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 bg-white rounded-full hover:bg-neutral-50 text-neutral-600 transition-all"
            aria-label="Chia sẻ sản phẩm"
            onClick={onShare}
          >
            <FiShare2 className="h-3.5 w-3.5" />
            Chia sẻ
          </button>
        )}
      </div>
      {(supplierName || supplierEmail || supplierPhone || supplierAddress || supplierDescription) ? (
        <div className="mt-3 md:mt-4 rounded-lg border border-neutral-200 bg-white p-3 md:p-4">
          <div className="text-sm md:text-base font-semibold text-[var(--color-cod-gray-900)]">Nhà cung cấp</div>
          {supplierDescription && showSupplierDescription ? (
            <p className="mt-1.5 text-[12px] md:text-sm text-neutral-700 whitespace-pre-wrap">{supplierDescription}</p>
          ) : null}
          <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 text-[12px] md:text-sm text-neutral-700">
            {supplierName ? (
              <div><span className="text-neutral-500">Tên:</span> <span className="font-medium">{supplierName}</span></div>
            ) : null}
            {showSupplierContacts && supplierEmail ? (
              <div><span className="text-neutral-500">Email:</span> <a href={`mailto:${supplierEmail}`} className="underline hover:no-underline">{supplierEmail}</a></div>
            ) : null}
            {showSupplierContacts && supplierPhone ? (
              <div><span className="text-neutral-500">Điện thoại:</span> <a href={`tel:${supplierPhone}`} className="underline hover:no-underline">{supplierPhone}</a></div>
            ) : null}
            {showSupplierContacts && supplierAddress ? (
              <div className="md:col-span-2"><span className="text-neutral-500">Địa chỉ:</span> <span>{supplierAddress}</span></div>
            ) : null}
          </div>
          {supplierId ? (
            <div className="mt-2">
              <Link
                href={{ pathname: ROUTES.products, query: { supplierId } }}
                className="text-[12px] md:text-sm font-medium text-[var(--color-cod-gray-900)] hover:underline"
              >
                Xem tất cả sản phẩm từ nhà cung cấp này
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
;

export default ProductInfo;
