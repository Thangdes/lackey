"use client";

import React from "react";
import ProductGallery from "@/components/products/detail/ProductGallery";

export type ProductDetailGalleryColumnProps = {
  name: string;
  images: string[];
  activeImg: number;
  onChangeActive: (idx: number) => void;
  isSale: boolean;
  discountPercent?: number;
  thumbColsClass: string;
  thumbGapClass: string;
};

const ProductDetailGalleryColumn: React.FC<ProductDetailGalleryColumnProps> = ({
  name,
  images,
  activeImg,
  onChangeActive,
  isSale,
  discountPercent,
  thumbColsClass,
  thumbGapClass,
}) => {
  return (
    <div className="w-full max-w-[520px] mx-auto lg:mx-0">
      <ProductGallery
        name={name}
        images={images}
        activeImg={activeImg}
        onChangeActive={onChangeActive}
        isSale={isSale}
        discountPercent={discountPercent}
        thumbColsClass={thumbColsClass}
        thumbGapClass={thumbGapClass}
      />
    </div>
  );
};

export default ProductDetailGalleryColumn;
