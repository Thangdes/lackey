"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { Product, ProductVariant } from "@/type/product";
import { useSmartCart, useAddToCart } from "@/hook/useCart";
import { formatVND } from "@/utils/format";
import { addRecentProduct  } from "@/utils/recent";
import ProductSEO from "@/components/products/detail/ProductSEO";
import ProductBreadcrumb from "@/components/products/detail/ProductBreadcrumb";
import ProductMobileBar from "./detail/ProductMobileBar";
import { productService } from "@/service/product.service";
import useProductPricing from "@/hook/useProductPricing";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MiniCart from "@/components/cart/MiniCart";
import { showAddedToCartToast } from "@/components/toast/AddToCartToast";
import { showErrorToast } from "@/components/toast/AppToast";
import { useAuthModalStore } from "@/store/authModal";
import ProductGridSkeleton from "@/components/common/ProductGridSkeleton";

import ProductToast from "@/components/products/detail/ProductToast";
import ProductDetailGalleryColumn from "@/components/products/detail/ProductDetailGalleryColumn";
import ProductDetailInfoColumn from "@/components/products/detail/ProductDetailInfoColumn";
import ProductTabsSection from "@/components/products/detail/ProductTabsSection";
import ProductRelatedSection from "@/components/products/detail/ProductRelatedSection";

export type ProductClientViewProps = {
  product: Product;
  thumbCols?: {
    base?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  thumbGap?: 1 | 2 | 3;
  stockUnit?: string;
};

const ProductClientView: React.FC<ProductClientViewProps> = ({ product, thumbCols, thumbGap, stockUnit = "gói" }) => {
  const p = product;
  const images = useMemo(() => {
    const list = p.images && p.images.length > 0 ? p.images : [];
    const thumb = p.thumbnailUrl ?? undefined;
    return thumb ? [thumb, ...list.filter((u) => u !== thumb)] : list;
  }, [p.images, p.thumbnailUrl]);

  const variants = useMemo(() => {
    type VariantLike = ProductVariant & { price: number | string; discountPrice?: number | string | null };
    const list = Array.isArray(p.variants) ? (p.variants as VariantLike[]) : [];
    return list.map((v) => ({
      ...v,
      price: typeof v.price === "string" ? Number(v.price) : v.price,
      discountPrice:
        v.discountPrice == null
          ? undefined
          : typeof v.discountPrice === "string"
          ? Number(v.discountPrice)
          : v.discountPrice,
    }));
  }, [p.variants]);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(variants[0]?.id);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const [tab, setTab] = useState<"desc" | "reviews" | "info" | "supplier">("desc");

  const ratingValue = Math.max(0, Math.min(5, Number(p.ratingAvg ?? 0)));
  const fullStars = Math.floor(ratingValue);
  const ratingCount = p.ratingCount ?? 0;

  const totalStock = variants.reduce((sum, v) => sum + Math.max(0, Number(v.stockQuantity ?? 0)), 0);
  const outOfStock = totalStock <= 0;

  const { price, compareAt, isSale, discountPercent } = useProductPricing(selectedVariant);

  const cart = useSmartCart();
  const addToCart = useAddToCart();
  const openAuth = useAuthModalStore((s) => s.openWith);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [miniOpen, setMiniOpen] = useState(false);
  const [miniHighlightSku, setMiniHighlightSku] = useState<string | undefined>(undefined);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      console.warn("[ADD_TO_CART] blocked: no selectedVariant");
      return;
    }
    if (adding) {
      console.warn("[ADD_TO_CART] blocked: already adding in progress");
      return;
    }
    const cap = typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;
    const remain = cap - cartQty;
    if (remain <= 0) {
      console.warn("[ADD_TO_CART] blocked: remain <= 0", { cap, cartQty, remain });
      setToastMsg("Bạn đã đạt số lượng tối đa còn trong kho cho phiên bản này.");
      setTimeout(() => setToastMsg(null), 2500);
      return;
    }
    const toAdd = Math.min(1, remain);
    try {
      setAdding(true);
      console.log("[ADD_TO_CART] start", { variantId: selectedVariant.id, quantity: toAdd });
      const res = await addToCart.mutateAsync({ productVariantId: selectedVariant.id, quantity: toAdd });
      console.log("[ADD_TO_CART] success", res);
      // Only show toast when adding from 0 -> 1 in cart
      if ((cartQty || 0) <= 0) {
        showAddedToCartToast({ name: p.name, thumbnailUrl: p.thumbnailUrl || p.images?.[0], quantity: toAdd });
      }
      const sku = selectedVariant.sku || selectedVariant.id;
      if (sku) setMiniHighlightSku(sku);
      // setMiniOpen(true); // Disabled: Don't auto-open miniCart when adding to cart
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể thêm vào giỏ hàng. Vui lòng thử lại.";
      if (/401|unauthorized/i.test(msg)) {
        showErrorToast({ title: "Cần đăng nhập", message: "Bạn cần đăng nhập để thêm vào giỏ." });
        try { openAuth('signin'); } catch {}
      } else {
        console.error("[ADD_TO_CART] error", e);
        setToastMsg("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
      }
      setTimeout(() => setToastMsg(null), 2500);
    } finally {
      setAdding(false);
    }
  };

  const handleShare = () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : undefined;
      const nav = navigator as Navigator & { share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>; clipboard?: { writeText?: (t: string) => Promise<void> } };
      const shareData = { title: p.name, text: p.name, url };
      if (nav.share) {
        nav.share(shareData).catch(() => {});
      } else if (nav.clipboard?.writeText && url) {
        nav.clipboard.writeText(url).then(() => {
          alert("Đã sao chép liên kết sản phẩm.");
        }).catch(() => {});
      }
    } catch {}
  };

  const currentSku = selectedVariant?.sku || selectedVariant?.id;
  const cartItem = useMemo(() => (cart.items || []).find((it) => it.sku === currentSku), [cart.items, currentSku]);
  
  // Fix hydration mismatch: use state to prevent SSR/client mismatch
  const [cartQty, setCartQty] = useState(0);
  useEffect(() => {
    setCartQty(cartItem?.quantity ?? 0);
  }, [cartItem?.quantity]);
  
  const maxStock = typeof selectedVariant?.stockQuantity === "number" ? Math.max(0, selectedVariant.stockQuantity as number) : undefined;

  const handleDecrease = useCallback(() => {
    if (!cartItem?.itemId) return;
    if (cartQty <= 1) {
      cart.remove(cartItem.itemId);
    } else {
      cart.updateQty(cartItem.itemId, cartQty - 1);
    }
  }, [cart, cartItem?.itemId, cartQty]);

  const handleIncrease = useCallback(() => {
    if (!selectedVariant) return;
    const cap = typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;
    if (cartQty < cap) {
      addToCart
        .mutateAsync({ productVariantId: selectedVariant.id, quantity: 1 })
        .then(() => {
          const sku = selectedVariant.sku || selectedVariant.id;
          if (sku) setMiniHighlightSku(sku);
          // setMiniOpen(true); // Disabled: Don't auto-open miniCart when increasing quantity
        })
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : "Không thể thêm vào giỏ hàng. Vui lòng thử lại.";
          if (/401|unauthorized/i.test(msg)) {
            showErrorToast({ title: "Cần đăng nhập", message: "Bạn cần đăng nhập để thêm vào giỏ." });
            try { openAuth('signin'); } catch {}
          } else {
            setToastMsg("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
          }
          setTimeout(() => setToastMsg(null), 2500);
        });
    }
  }, [addToCart, cartQty, maxStock, openAuth, selectedVariant]);

  const handleIncreaseMobile = useCallback(() => {
    if (!selectedVariant) return;
    const cap = typeof maxStock === "number" && maxStock > 0 ? maxStock : Infinity;
    if (cartQty < cap) {
      addToCart.mutate({ productVariantId: selectedVariant.id, quantity: 1 });
    }
  }, [addToCart, cartQty, maxStock, selectedVariant]);

  const thumbGapClass = useMemo(() => {
    const gap = thumbGap ?? 2;
    return gap === 1
      ? "gap-1"
      : gap === 3
      ? "gap-3"
      : "gap-2";
  }, [thumbGap]);

  const thumbColsClass = useMemo(() => {
    const base = (thumbCols?.base ?? 5) as 3|4|5|6|7|8|9|10|11|12;
    const sm = (thumbCols?.sm ?? 6) as 3|4|5|6|7|8|9|10|11|12;
    const md = (thumbCols?.md ?? 8) as 3|4|5|6|7|8|9|10|11|12;
    const map: Record<3|4|5|6|7|8|9|10|11|12, string> = {
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    };
    return `grid ${map[base]} sm:${map[sm]} md:${map[md]}`;
  }, [thumbCols?.base, thumbCols?.sm, thumbCols?.md]);

  useEffect(() => {
    try {
      if (p && p.id) addRecentProduct(p);
    } catch {}
  }, [p]);
  
  useEffect(() => {
    let mounted = true;
    setRelatedLoading(true);
    productService
      .related(p.id, 12)
      .then((items) => {
        if (!mounted) return;
        const filtered = (items || []).filter((it) => it.id !== p.id);
        setRelated(filtered);
        setRelatedLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setRelated([]);
        setRelatedLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [p.id]);

  useEffect(() => {
    try {
      const fromUrl = searchParams?.get("variant");
      if (fromUrl) {
        const byId = variants.find((v) => v.id === fromUrl);
        const bySku = variants.find((v) => (v.sku || "").toLowerCase() === fromUrl.toLowerCase());
        const byName = variants.find((v) => (v.name || "").toLowerCase() === fromUrl.toLowerCase());
        const matched = byId || bySku || byName;
        if (matched) setSelectedVariantId(matched.id);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (!selectedVariant?.id) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    const val = (selectedVariant.sku || selectedVariant.id);
    if (params.get("variant") === val) return;
    params.set("variant", val);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedVariant?.id, selectedVariant?.sku, pathname, router, searchParams]);

  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-6 lg:py-8 pb-24 sm:pb-28 md:pb-10">
      <ProductToast message={toastMsg} />
      <ProductSEO product={p} images={images} selectedVariant={selectedVariant} price={price} compareAt={compareAt} isSale={isSale} discountPercent={discountPercent} />
      <ProductBreadcrumb product={p} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
        <ProductDetailGalleryColumn
          name={p.name}
          images={images}
          activeImg={activeImg}
          onChangeActive={setActiveImg}
          isSale={isSale}
          discountPercent={discountPercent}
          thumbColsClass={thumbColsClass}
          thumbGapClass={thumbGapClass}
        />

        <ProductDetailInfoColumn
          name={p.name}
          ratingValue={ratingValue}
          fullStars={fullStars}
          ratingCount={ratingCount}
          selectedVariant={selectedVariant}
          categoryId={p.categoryId}
          categoryName={p.category?.name}
          outOfStock={outOfStock}
          totalStock={totalStock}
          stockUnit={stockUnit}
          onShare={handleShare}
          price={price}
          compareAt={compareAt}
          isSale={isSale}
          discountPercent={discountPercent}
          variants={variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={setSelectedVariantId}
          cartQty={cartQty}
          maxStock={maxStock}
          adding={adding}
          onAdd={handleAddToCart}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
        />
      </div>

      <ProductTabsSection
        tab={tab}
        onChange={setTab}
        description={p.description}
        ratingValue={ratingValue}
        ratingCount={ratingCount}
        variants={variants}
        supplier={{
          id: p.supplier?.id,
          name: p.supplier?.name ?? null,
          email: p.supplier?.email ?? null,
          phone: p.supplier?.phone ?? null,
          address: p.supplier?.address ?? null,
          description: p.supplier?.description ?? null,
        }}
      />

      {relatedLoading ? (
        <div className="mt-12">
          <ProductGridSkeleton count={6} />
        </div>
      ) : (
        <ProductRelatedSection related={related} loading={false} categorySlug={p.category?.slug ?? null} />
      )}

      <ProductMobileBar
        price={price}
        compareAt={compareAt}
        isSale={isSale}
        cartQty={cartQty}
        maxStock={maxStock}
        onAdd={handleAddToCart}
        onDecrease={handleDecrease}
        onIncrease={handleIncreaseMobile}
        formatVND={formatVND}
      />
      <MiniCart open={miniOpen} onOpenChange={setMiniOpen} highlightSku={miniHighlightSku} />
    </div>
  );
};

export default ProductClientView;
