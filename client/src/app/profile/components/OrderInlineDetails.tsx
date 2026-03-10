"use client";

import React from "react";
import { formatVND } from "@/utils/format";
import { useProductById } from "@/hook/useProduct";

type OrderItemMinimal = {
  id?: string;
  quantity?: number;
  priceAtPurchase?: number | string;
  productVariant?: { name?: string; sku?: string; productId?: string } & { product?: { id?: string } };
  product?: { id?: string };
  productVariantId?: string;
};

function ItemRow({ item }: { item: OrderItemMinimal }) {
  const productId: string | undefined = item?.productVariant?.productId ?? item?.product?.id;
  const { data: product, isLoading } = useProductById(productId || "");

  if (isLoading) {
    return (
      <li className="flex items-center justify-between gap-3 text-sm animate-pulse">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded bg-black/10" />
          <div className="min-w-0 flex-1">
            <div className="h-4 w-40 rounded bg-black/10 mb-1" />
            <div className="h-3 w-24 rounded bg-black/10" />
          </div>
        </div>
        <div className="shrink-0 whitespace-nowrap text-black/40">&nbsp;</div>
        <div className="shrink-0 whitespace-nowrap font-medium w-16 h-4 rounded bg-black/10" />
      </li>
    );
  }

  const img = product?.thumbnailUrl || (Array.isArray(product?.images) ? product?.images[0] : undefined);
  const name = item?.productVariant?.name ?? product?.name ?? item?.productVariantId ?? "Sản phẩm";
  const sku = item?.productVariant?.sku || product?.slug || "-";

  return (
    <li className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 text-xs sm:text-sm py-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 w-full xs:w-auto">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-black/10 shrink-0" />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-black/5 border border-black/10 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 font-medium">{name}</div>
          <div className="text-[11px] sm:text-xs text-black/60 mt-0.5 truncate">SKU: {sku}</div>
        </div>
      </div>
      <div className="flex items-center justify-between xs:justify-end gap-3 w-full xs:w-auto xs:shrink-0">
        <div className="whitespace-nowrap text-black/70">x{item?.quantity}</div>
        <div className="whitespace-nowrap font-semibold text-[#AE1C2C]">{formatVND(Number(item?.priceAtPurchase ?? 0))}</div>
      </div>
    </li>
  );
}

type OrderMinimal = {
  id?: string;
  orderCode?: string;
  code?: string;
  notes?: string | null;
  subtotalAmount?: number | string;
  shippingFee?: number | string;
  discountAmount?: number | string;
  totalAmount?: number | string;
  total?: number | string;
  orderItems?: OrderItemMinimal[];
  deliveryCode?: string | null;
  carrier?: string | null;
  shippingCarrier?: string | null;
};

export default function OrderInlineDetails({ order }: { order: OrderMinimal }) {
  const items: OrderItemMinimal[] = Array.isArray(order?.orderItems) ? order.orderItems : [];
  const getTrackUrl = (carrier?: string | null, code?: string | null) => {
    const c = (carrier || '').toString().toLowerCase();
    const v = (code || '').toString().trim();
    if (!v) return null;
    // Basic mapping for popular carriers
    if (c.includes('ghn')) return `https://donhang.ghn.vn/?order_code=${encodeURIComponent(v)}`;
    if (c.includes('ghtk')) return `https://i.ghtk.vn/${encodeURIComponent(v)}`;
    if (c.includes('vtp') || c.includes('viettel')) return `https://viettelpost.com.vn/tra-cuu-don-hang?code=${encodeURIComponent(v)}`;
    if (c.includes('spx') || c.includes('shopee')) return `https://spx.vn/track?tracking_number=${encodeURIComponent(v)}`;
    if (c.includes('jnt') || c.includes('j&t')) return `https://www.jtexpress.vn/track?billcode=${encodeURIComponent(v)}`;
    if (c.includes('ninjavan') || c.includes('ninja')) return `https://www.ninjavan.co/vi-vn/tracking?id=${encodeURIComponent(v)}`;
    return null;
  };
  const handleCopy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-xl border border-black/10 bg-gradient-to-br from-neutral-50 to-white p-3 sm:p-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="text-sm sm:text-base font-bold">Sản phẩm</div>
        <div className="h-px flex-1 bg-black/10" />
      </div>
      <ul className="space-y-1 sm:space-y-2 divide-y divide-black/5">
        {items.map((it) => (
          <ItemRow key={it.id} item={it} />
        ))}
      </ul>
      <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-black/10 space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between">
          <div className="text-black/60 font-medium">Mã đơn</div>
          <div className="text-right font-semibold">{order?.orderCode || order?.code || order?.id}</div>
        </div>
        {(() => {
          const dc = (order?.deliveryCode || '').toString().trim();
          const carrier = (order?.carrier || order?.shippingCarrier || '').toString().trim();
          if (!dc && !carrier) return null;
          return (
            <>
              {carrier ? (
                <div className="flex items-center justify-between">
                  <div className="text-black/60 font-medium">Đơn vị vận chuyển</div>
                  <div className="text-right font-semibold">{carrier}</div>
                </div>
              ) : null}
              {dc ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="text-black/60 font-medium">
                    Mã vận chuyển
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="font-semibold">{dc}</span>
                    <button
                      type="button"
                      className="rounded-lg border border-black/15 px-2.5 py-1 text-[10px] sm:text-xs font-medium hover:bg-black/5 transition-colors"
                      onClick={() => handleCopy(dc)}
                      title="Sao chép mã vận chuyển"
                    >
                      📋 Copy
                    </button>
                    {(() => {
                      const url = getTrackUrl(carrier, dc);
                      if (!url) return null;
                      return (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-sky-700 hover:bg-sky-100 transition-colors"
                          title="Theo dõi đơn trên trang hãng"
                        >
                          🔍 Tra cứu
                        </a>
                      );
                    })()}
                  </div>
                </div>
              ) : null}
            </>
          );
        })()}
        <div className="flex items-center justify-between">
          <div className="text-black/60 font-medium">Ghi chú</div>
          <div className="text-right line-clamp-2 max-w-[60%]">{order?.notes || "-"}</div>
        </div>
        <div className="h-px bg-black/10 my-2" />
        <div className="flex items-center justify-between">
          <div className="text-black/60">Tạm tính</div>
          <div className="text-right font-medium">{formatVND(Number(order?.subtotalAmount ?? 0))}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-black/60">Phí vận chuyển</div>
          <div className="text-right font-medium">{formatVND(Number(order?.shippingFee ?? 0))}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-black/60">Giảm giá</div>
          <div className="text-right font-medium text-emerald-600">-{formatVND(Number(order?.discountAmount ?? 0))}</div>
        </div>
        <div className="h-px bg-black/10 my-2" />
        <div className="flex items-center justify-between">
          <div className="text-sm sm:text-base font-bold">Tổng cộng</div>
          <div className="text-right text-base sm:text-lg font-bold text-[#AE1C2C]">{formatVND(Number(order?.totalAmount ?? order?.total ?? 0))}</div>
        </div>
      </div>
      {(() => {
        const dc = (order?.deliveryCode || '').toString().trim();
        const carrier = (order?.carrier || order?.shippingCarrier || '').toString().trim();
        if (!dc && !carrier) return null;
        return (
          <p className="mt-2 text-xs text-black/60">
            Phần &quot;Vận chuyển&quot; hiển thị <strong>đơn vị vận chuyển</strong> (nếu có) và <strong>mã vận chuyển</strong> để bạn có thể tra cứu trạng thái đơn trên hệ thống của hãng.
          </p>
        );
      })()}
    </div>
  );
}
