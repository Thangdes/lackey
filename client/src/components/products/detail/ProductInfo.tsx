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
      {outOfStock && (
        <div className="mb-3 inline-block px-4 py-1 bg-red-600 border-2 border-black">
          <span className="text-xs font-bold uppercase tracking-wider text-white">Hết hàng</span>
        </div>
      )}
      
      <h1 
        className="font-[family-name:var(--font-retro)] text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-black leading-tight line-clamp-2 mb-2" 
        title={name}
      >
        {name}
      </h1>
      {categoryName && (
        <p className="text-sm font-medium text-neutral-700 mb-3">Danh mục: <span className="font-bold">{categoryName}</span></p>
      )}
      
      <div className="flex items-center gap-2 text-sm text-neutral-700 mb-4">
        <div className="flex items-center gap-0.5" aria-label={`Đánh giá ${ratingValue.toFixed(1)}/5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IoIosStar key={i} className={`h-4 w-4 ${i < fullStars ? "text-[#fff100]" : "text-neutral-300"}`} style={i < fullStars ? {stroke: "#000", strokeWidth: "1px"} : {}} />
          ))}
        </div>
        <span className="font-bold">{ratingValue.toFixed(1)}</span>
        <span className="text-neutral-600">({ratingCount} đánh giá)</span>
      </div>
      {/* SKU, Stock, and Share buttons in ONE ROW */}
      <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
        {selectedVariant?.sku && (
          <span className="inline-flex items-center bg-white text-black px-3 py-1.5 border-2 border-black font-bold uppercase">SKU: {selectedVariant.sku}</span>
        )}
        {!outOfStock && (
          <span className={`inline-flex items-center px-3 py-1.5 border-2 font-bold uppercase ${totalStock <= 5 ? 'bg-amber-100 text-amber-900 border-amber-600' : 'bg-emerald-100 text-emerald-900 border-emerald-600'}`}>
            <FiPackage className={`h-3.5 w-3.5 mr-1.5 ${totalStock <= 5 ? 'text-amber-700' : 'text-emerald-700'}`} />
            {totalStock}+ {stockUnit}
          </span>
        )}
        {onFavorite && (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
            aria-label="Thêm vào yêu thích"
            onClick={onFavorite}
          >
            <FiHeart className="h-4 w-4" />
            Yêu thích
          </button>
        )}
        {onShare && (
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
            aria-label="Chia sẻ sản phẩm"
            onClick={onShare}
          >
            <FiShare2 className="h-4 w-4" />
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
