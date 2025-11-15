"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { ROUTES } from "@/constant/route";
import { useBestSellers } from "@/hook/useProduct";
import { cartService } from "@/service/cart.service";
import { productService } from "@/service/product.service";
import type { ProductVariant } from "@/type/product";
import { toast } from "sonner";
import { showAddedToCartToast } from "@/components/toast/AddToCartToast";


const BADGE_STYLES = {
  HOT: "bg-black text-white",
  TRENDING: "bg-black text-white",
  BEST: "bg-black text-white",
  NEW: "bg-white text-black border border-black",
  SALE: "bg-black text-white",
};

export default function BestSellers() {
  const { data, isLoading } = useBestSellers(6);

  const products = data?.data || [];

  const mapProduct = (product: typeof products[number]) => {
    const variants = product.variants || [];
    const firstVariant = variants[0];
    const price = firstVariant?.discountPrice || firstVariant?.price || product.minEffectivePrice || 0;
    const originalPrice = firstVariant?.discountPrice ? firstVariant.price : null;
    const discount = originalPrice && price < originalPrice 
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;
    
    const totalBuyCount = product.totalBuyCount || product.buyCount || 0;
    const badge = totalBuyCount >= 100 ? "HOT" : "NEW";
    
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.thumbnailUrl || product.images?.[0] || "/placeholder.jpg",
      price,
      originalPrice,
      discount,
      rating: product.ratingAvg || 0,
      reviewCount: product.ratingCount || 0,
      sold: totalBuyCount,
      badge,
      variantId: firstVariant?.id as string | undefined,
    };
  };

  const mappedProducts = products.map(mapProduct);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
            <h2 className="font-[family-name:var(--font-retro)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-3 sm:mb-4 tracking-wider uppercase">
              Bán chạy nhất
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-none border border-black aspect-square" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center">
          <h2 className="font-[family-name:var(--font-retro)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-neutral-900 mb-3 sm:mb-4 tracking-wider uppercase">
            Bán chạy nhất
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto px-4">
            Sẵn sàng tỏa sáng? Khám phá những móc khóa bán chạy nhất của chúng tôi! 
            Từ nhân vật anime, Kpop đến các thiết kế độc đáo, những sản phẩm yêu thích 
            này mang đến sự kết hợp hoàn hảo giữa phong cách, cá tính và năng lượng LắcKey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-8 sm:mb-10 md:mb-12">
          {mappedProducts.map((product) => (
            <Link
              key={product.id}
              href={`${ROUTES.products}/${product.slug}`}
              className="group bg-white rounded-none border border-black overflow-hidden hover:bg-black transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  <span className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${BADGE_STYLES[product.badge as keyof typeof BADGE_STYLES]}`}>
                    {product.badge}
                  </span>
                </div>

                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <span className="bg-black text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs font-bold">
                      -{product.discount}%
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toast.info("Tính năng yêu thích sẽ có sau");
                    }}
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="p-2 sm:p-3 md:p-4 group-hover:text-white transition-colors">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-neutral-900 group-hover:text-white mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-black group-hover:fill-white text-black group-hover:text-white transition-colors" />
                    <span className="text-[10px] sm:text-xs md:text-sm font-medium text-neutral-900 group-hover:text-white transition-colors">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="text-[10px] sm:text-xs text-neutral-600 group-hover:text-neutral-300 mb-2 sm:mb-3 transition-colors">
                  Đã bán: <span className="font-semibold">{product.sold.toLocaleString('vi-VN')}</span>
                </div>

                <div className="flex items-baseline gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-black group-hover:text-white transition-colors">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-[10px] sm:text-xs md:text-sm text-neutral-400 group-hover:text-neutral-300 line-through transition-colors">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                <button
                  className="w-full py-1.5 sm:py-2 bg-black text-white group-hover:bg-white group-hover:text-black border border-black font-semibold text-[10px] sm:text-xs md:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    (async () => {
                      try {
                        let variantId = product.variantId;
                        if (!variantId) {
                          const variants = await productService.listVariants(product.id);
                          const pick = (variants || []).find((v: ProductVariant) => v.stockQuantity == null || v.stockQuantity > 0) || (variants || [])[0];
                          if (!pick?.id) {
                            toast.warning("Sản phẩm tạm hết biến thể khả dụng");
                            return;
                          }
                          variantId = pick.id as string;
                        }
                        await cartService.addItem({ productVariantId: variantId, quantity: 1 });
                        showAddedToCartToast({ name: product.name, thumbnailUrl: product.image, quantity: 1 });
                      } catch (err) {
                        const msg = err instanceof Error ? err.message : "Không thể thêm vào giỏ";
                        toast.error(msg);
                      }
                    })();
                  }}
                >
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                  THÊM VÀO GIỎ
                </button>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <button
            className="bg-[#fff100] text-black hover:bg-[#fcf299] hover:text-black border-2 border-black font-bold px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm md:text-base transition-all uppercase tracking-wider rounded-none"
          >
            <Link href={ROUTES.products + "?bestseller=true"}>
              Xem tất cả sản phẩm bán chạy 
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
}
