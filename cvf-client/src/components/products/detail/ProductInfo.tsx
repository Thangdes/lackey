"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constant/route";
import { IoIosStar } from "react-icons/io";
import { FiHeart, FiShare2, FiPackage } from "react-icons/fi";
import type { ProductVariant } from "@/type/product";

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
  onFavorite?: () => void;
  onShare?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  ratingValue,
  fullStars,
  ratingCount,
  selectedVariant,
  categoryId,
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
  onFavorite,
  onShare,
}) => {
  return (
    <div>
      <h1 
        className="text-lg sm:text-xl md:text-xl font-bold text-[var(--color-cod-gray-900)] leading-tight tracking-tight line-clamp-3 cursor-default" 
        title={name}
      >
        {name}
      </h1>
      <div className="mt-2 sm:mt-2.5 flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base text-neutral-700">
        <div className="flex items-center gap-0.5" aria-label={`Đánh giá ${ratingValue.toFixed(1)}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IoIosStar key={i} className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${i < fullStars ? "" : "text-neutral-300"}`} />
          ))}
        </div>
        <span className="font-semibold">{ratingValue.toFixed(1)}</span>
        <span className="text-neutral-500">({ratingCount})</span>
      </div>
      <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
        {selectedVariant?.sku ? (
          <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-2.5 sm:px-3 py-1 sm:py-1.5 ring-1 ring-neutral-200 font-medium">SKU: {selectedVariant.sku}</span>
        ) : null}
        {(categoryName || categoryId) ? (
          <span className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-700 px-2.5 sm:px-3 py-1 sm:py-1.5 ring-1 ring-neutral-200 font-medium">Danh mục: {categoryName || categoryId}</span>
        ) : null}
        {outOfStock ? (
          <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2.5 sm:px-3 py-1 sm:py-1.5 ring-1 ring-red-200 font-semibold">Hết hàng</span>
        ) : (
          <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ring-1 font-medium ${totalStock <= 5 ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200'}`}>
            <FiPackage className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 ${totalStock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`} />
            {totalStock}+ {stockUnit}
          </span>
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
      <div className="mt-3 md:mt-4 flex items-center gap-2.5">
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm ring-1 ring-neutral-300 hover:bg-neutral-50"
          aria-label="Thêm vào yêu thích"
          onClick={onFavorite}
        >
          <FiHeart className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Yêu thích
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm ring-1 ring-neutral-300 hover:bg-neutral-50"
          aria-label="Chia sẻ sản phẩm"
          onClick={onShare}
        >
          <FiShare2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Chia sẻ
        </button>
      </div>
    </div>
  );
}
;

export default ProductInfo;
