"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { orderService } from "@/service/order.service";
import type { OrderDetail, OrderItem } from "@/type/order";
import { formatVND } from "@/utils/format";
import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/constant/route";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ImageWithFallback({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/logo/logo.jpg");
    }
  };

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <Image 
      src={imgSrc} 
      alt={alt} 
      fill 
      className={className || "object-cover"} 
      sizes={sizes || "48px"}
      onError={handleError}
    />
  );
}

export default function OrderLookupPage() {
  const sp = useSearchParams();
  const urlCode = sp?.get("code") || "";

  const [code, setCode] = useState(urlCode);
  const [searchType, setSearchType] = useState<"code" | "phone" | "email">("code");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderDetail[] | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const normalizedCode = useMemo(() => code.trim(), [code]);

  const isValidPhone = useCallback((val: string) => {
    const digits = val.replace(/\D+/g, "");
    return /^0\d{9}$/.test(digits) || /^(84)\d{9,10}$/.test(digits);
  }, []);

  const isValidEmail = useCallback((val: string) => {
    return /^(?!.{255,})([A-Za-z0-9._%+-]{1,64})@([A-Za-z0-9.-]{1,190})\.[A-Za-z]{2,}$/.test(val.trim());
  }, []);

  const [page, setPage] = useState(1);
  const pageSize = 5; 
  const statusBadgeClass = useCallback((status: unknown) => {
    const s = String(status || "").toUpperCase();
    if (["PENDING", "PENDING_CONFIRMATION"].includes(s)) return "bg-yellow-100 text-yellow-800";
    if (["PROCESSING", "CONFIRMED", "PACKING"].includes(s)) return "bg-blue-100 text-blue-800";
    if (["SHIPPED", "IN_TRANSIT"].includes(s)) return "bg-indigo-100 text-indigo-800";
    if (["DELIVERED", "COMPLETED"].includes(s)) return "bg-green-100 text-green-800";
    if (["CANCELLED", "CANCELED", "REFUNDED", "FAILED"].includes(s)) return "bg-red-100 text-red-800";
    return "bg-neutral-100 text-neutral-700";
  }, []);

  useEffect(() => {
    setPage(1);
  }, [orders?.length, searchType]);

  const onLookup = useCallback(async () => {
    setError(null);
    setOrders(null);
    const c = normalizedCode;
    if (!c) {
      setError(
        searchType === "code"
          ? "Vui lòng nhập mã đơn hàng"
          : searchType === "phone"
          ? "Vui lòng nhập số điện thoại"
          : "Vui lòng nhập email"
      );
      inputRef.current?.focus();
      return;
    }
    if (searchType === "phone" && !isValidPhone(c)) {
      setError("Số điện thoại không hợp lệ. Vui lòng nhập 10 số (VD: 0901234567) hoặc đầu số 84.");
      inputRef.current?.focus();
      return;
    }
    if (searchType === "email" && !isValidEmail(c)) {
      setError("Email không hợp lệ. Vui lòng kiểm tra lại định dạng (VD: you@example.com).");
      inputRef.current?.focus();
      return;
    }
    try {
      setLoading(true);
      if (searchType === "code") {
        const data = await orderService.lookupByCode(c);
        setOrders([data]);
      } else if (searchType === "phone") {
        const phone = c.replace(/\D+/g, "");
        const arr = await orderService.lookup({ phone });
        setOrders(arr);
      } else {
        const arr = await orderService.lookup({ email: c });
        setOrders(arr);
      }
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      const notFound = /404|not\s*found|không\s*tìm\s*thấy/i.test(raw);
      const entity = searchType === "code" ? "mã" : (searchType === "phone" ? "số điện thoại" : "email");
      const msg = notFound ? `Không tìm thấy đơn hàng. Vui lòng kiểm tra lại ${entity}.` : (raw || "Không thể tra cứu đơn hàng");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [normalizedCode, searchType, isValidPhone, isValidEmail]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (urlCode && urlCode !== code) {
      setCode(urlCode);
      setSearchType("code");
      if (!loading) {
        void onLookup();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode]);

  return (
    <main className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-6 md:py-8 xl:py-10 2xl:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold">Tra cứu đơn hàng</h1>
          <p className="mt-1 text-sm text-neutral-600">Nhập mã đơn, số điện thoại hoặc email để xem trạng thái và chi tiết.</p>
        </header>

        <section className="rounded-lg bg-white p-4 md:p-6 border border-black/10">
          <form
            className="flex flex-col sm:flex-row gap-3 sm:items-center"
            onSubmit={(e) => { e.preventDefault(); if (!loading) onLookup(); }}
          >
            <div className="flex items-center gap-2">
              <label htmlFor="order-search-type" className="text-sm font-medium">Tìm theo</label>
              <Select value={searchType} onValueChange={(val) => { setError(null); setSearchType(val as "code" | "phone" | "email"); }} disabled={loading}>
                <SelectTrigger id="order-search-type" className="w-40">
                  <SelectValue placeholder="Chọn cách tìm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">Mã đơn</SelectItem>
                  <SelectItem value="phone">Số điện thoại</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <input
                  id="order-code"
                  ref={inputRef}
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (searchType === "phone") {
                      // keep digits only for phone input for consistency
                      const digits = val.replace(/\D+/g, "").slice(0, 12);
                      setCode(digits);
                    } else {
                      setCode(val);
                    }
                  }}
                  placeholder={searchType === "code" ? "VD: OD123456" : (searchType === "phone" ? "VD: 0901234567" : "VD: you@example.com")}
                  autoComplete="off"
                  type={searchType === "email" ? "email" : "text"}
                  inputMode={searchType === "phone" ? "tel" : (searchType === "email" ? "email" : "text")}
                  aria-invalid={!!error}
                  className="w-full rounded-md border border-black/15 pr-10 pl-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20"
                />
                {code && (
                  <button
                    type="button"
                    onClick={() => { setCode(""); setError(null); inputRef.current?.focus(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 flex items-center justify-center"
                    aria-label="Xoá nội dung"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                aria-busy={loading}
                disabled={loading}
                className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${loading ? "bg-black/70" : "bg-black hover:bg-black/90"}`}
              >
                {loading ? "Đang tra cứu..." : "Tra cứu"}
              </button>
            </div>
          </form>
          <div className="mt-2 text-xs text-neutral-500">
            {searchType === "code" && (
              <span>Gợi ý: Dùng mã bắt đầu bằng OD... Ví dụ: OD123456</span>
            )}
            {searchType === "phone" && (
              <span>Nhập 10 số điện thoại (VD: 0901234567) hoặc số có đầu 84.</span>
            )}
            {searchType === "email" && (
              <span>Nhập địa chỉ email hợp lệ (VD: you@example.com).</span>
            )}
          </div>
          {!error && !orders && !loading && !normalizedCode && (
            <div className="mt-3 text-sm text-neutral-600">Nhập thông tin để bắt đầu tra cứu.</div>
          )}
          {error && (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          )}
        </section>

        {loading && (
          <section className="mt-6 md:mt-8 rounded-lg bg-white p-4 md:p-6 border border-black/10 animate-pulse">
            <div className="h-5 w-64 bg-black/10 rounded" />
            <div className="mt-2 h-4 w-40 bg-black/10 rounded" />
            <div className="mt-2 h-4 w-48 bg-black/10 rounded" />
            <div className="mt-4 h-8 w-full bg-black/5 rounded" />
            <div className="mt-2 h-8 w-full bg-black/5 rounded" />
            <div className="mt-2 h-8 w-full bg-black/5 rounded" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-4 w-40 bg-black/10 rounded" />
              <div className="h-4 w-32 bg-black/10 rounded ml-auto" />
            </div>
          </section>
        )}
        {orders && !loading && orders.length === 1 && (() => {
          const order = orders[0]!;
          return (
            <section className="mt-6 md:mt-8 rounded-lg bg-white p-4 md:p-6 border border-black/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">Đơn hàng #{order.orderCode || order.code || order.id}</h2>
                  <p className="text-sm text-neutral-600">Trạng thái: <strong className="text-neutral-800">{String(order.status)}</strong></p>
                  {order.createdAt && (
                    <p className="text-sm text-neutral-600">Tạo lúc: {new Date(order.createdAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                {(() => {
                  const items = (order.orderItems || []) as OrderItem[];
                  const getUnitPrice = (it: OrderItem) => {
                    const raw = (it.priceAtPurchase as number | string | undefined) ?? (it.productVariant?.price as number | string | undefined);
                    const val = Number(raw);
                    return Number.isFinite(val) && val > 0 ? val : undefined;
                  };
                  const hasUnitPrice = items.some((it) => {
                    const v = getUnitPrice(it);
                    return typeof v === 'number' && v > 0;
                  });
                  const hasLineTotal = hasUnitPrice; 
                  return (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left text-neutral-600">
                      <th className="py-2 pr-3 border-b border-black/10 font-medium">Sản phẩm</th>
                      <th className="py-2 px-3 border-b border-black/10 font-medium">Ảnh</th>
                      <th className="py-2 px-3 border-b border-black/10 font-medium">SKU</th>
                      <th className="py-2 px-3 border-b border-black/10 font-medium">SL</th>
                      {hasUnitPrice ? (<th className="py-2 px-3 border-b border-black/10 font-medium text-right">Đơn giá</th>) : null}
                      {hasLineTotal ? (<th className="py-2 pl-3 border-b border-black/10 font-medium text-right">Thành tiền</th>) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it: OrderItem) => {
                      const name = it.productVariant?.product?.name || it.productVariant?.name || it.productVariantId;
                      const sku = it.productVariant?.sku || "-";
                      const unitPrice = getUnitPrice(it);
                      const lineTotal = typeof unitPrice === 'number' && unitPrice > 0 ? unitPrice * it.quantity : undefined;
                      const imgSrc = it.productVariant?.imageUrl
                        || (Array.isArray(it.productVariant?.images) ? it.productVariant?.images?.[0]?.url || undefined : undefined)
                        || it.productVariant?.product?.thumbnailUrl
                        || "/logo/logo.jpg";
                      return (
                        <tr key={it.id} className="align-top">
                          <td className="py-2 pr-3 border-b border-black/5">
                            <div className="max-w-[560px] truncate" title={name}>{name}</div>
                          </td>
                          <td className="py-2 px-3 border-b border-black/5">
                            <div className="h-12 w-12 relative rounded overflow-hidden bg-neutral-50 ring-1 ring-black/10">
                              <ImageWithFallback src={imgSrc} alt={name} className="object-cover" sizes="48px" />
                            </div>
                          </td>
                          <td className="py-2 px-3 border-b border-black/5 text-neutral-700">{sku}</td>
                          <td className="py-2 px-3 border-b border-black/5">{it.quantity}</td>
                          {hasUnitPrice ? (
                            <td className="py-2 px-3 border-b border-black/5 text-right">{typeof unitPrice === 'number' && unitPrice > 0 ? formatVND(unitPrice) : '-'}</td>
                          ) : null}
                          {hasLineTotal ? (
                            <td className="py-2 pl-3 border-b border-black/5 text-right">{typeof lineTotal === 'number' ? formatVND(lineTotal) : '-'}</td>
                          ) : null}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                  );
                })()}
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  {order.discountAmount ? (
                    <div>Giảm giá: <strong>-{formatVND(order.discountAmount)}</strong></div>
                  ) : null}
                  {order.shippingFee != null ? (
                    <div>Phí vận chuyển: <strong>{formatVND(order.shippingFee)}</strong></div>
                  ) : null}
                </div>
                <div className="sm:text-right space-y-1">
                  <div>Tạm tính: <strong>{formatVND(order.subtotalAmount ?? order.subtotal ?? 0)}</strong></div>
                  <div>Tổng tiền: <strong className="text-red-700">{formatVND(order.totalAmount ?? order.total ?? 0)}</strong></div>
                </div>
              </div>
            </section>
          );
        })()}

        {orders && !loading && orders.length > 1 && (
          <section className="mt-6 md:mt-8 rounded-lg bg-white p-4 md:p-6 border border-black/10">
            <h2 className="text-lg font-semibold">Tìm thấy {orders.length} đơn hàng</h2>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
              const safePage = Math.min(Math.max(1, page), totalPages);
              const start = (safePage - 1) * pageSize;
              const currentOrders = orders.slice(start, start + pageSize);
              return (
                <>
                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {currentOrders.map((order) => {
                      const oid = String(order.id);
                      const code = order.orderCode || order.code || oid;
                      const items = (order.orderItems || []) as OrderItem[];
                      const getUnitPrice = (it: OrderItem) => {
                        const raw = (it.priceAtPurchase as number | string | undefined) ?? (it.productVariant?.price as number | string | undefined);
                        const val = Number(raw);
                        return Number.isFinite(val) && val > 0 ? val : undefined;
                      };
                      const hasUnitPrice = items.some((it) => {
                        const v = getUnitPrice(it);
                        return typeof v === 'number' && v > 0;
                      });
                      const hasLineTotal = hasUnitPrice;
                      return (
                        <div key={order.id} className="rounded-lg border border-black/10 p-3 md:p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <h3 className="text-base md:text-lg font-semibold">Đơn hàng #{code}</h3>
                              <div className="mt-0.5 flex items-center gap-2 text-sm text-neutral-600">
                                <span>Trạng thái:</span>
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusBadgeClass(order.status)}`}>{String(order.status)}</span>
                              </div>
                              {order.createdAt && (
                                <p className="text-sm text-neutral-600">Tạo lúc: {new Date(order.createdAt).toLocaleString()}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-semibold text-red-700">{formatVND(order.totalAmount ?? order.total ?? 0)}</div>
                            </div>
                          </div>
                          <div className="mt-3 overflow-x-auto">
                            <table className="w-full text-xs md:text-sm border-collapse">
                              <thead>
                                <tr className="text-left text-neutral-600">
                                  <th className="py-2 pr-3 border-b border-black/10 font-medium">Sản phẩm</th>
                                  <th className="py-2 px-3 border-b border-black/10 font-medium">Ảnh</th>
                                  <th className="py-2 px-3 border-b border-black/10 font-medium">SKU</th>
                                  <th className="py-2 px-3 border-b border-black/10 font-medium">SL</th>
                                  {hasUnitPrice ? (<th className="py-2 px-3 border-b border-black/10 font-medium text-right">Đơn giá</th>) : null}
                                  {hasLineTotal ? (<th className="py-2 pl-3 border-b border-black/10 font-medium text-right">Thành tiền</th>) : null}
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((it: OrderItem) => {
                                  const name = it.productVariant?.product?.name || it.productVariant?.name || it.productVariantId;
                                  const sku = it.productVariant?.sku || "-";
                                  const unitPrice = getUnitPrice(it);
                                  const lineTotal = typeof unitPrice === 'number' && unitPrice > 0 ? unitPrice * it.quantity : undefined;
                                  const imgSrc = it.productVariant?.imageUrl
                                    || (Array.isArray(it.productVariant?.images) ? it.productVariant?.images?.[0]?.url || undefined : undefined)
                                    || it.productVariant?.product?.thumbnailUrl
                                    || "/logo/logo.jpg";
                                  return (
                                    <tr key={it.id} className="align-top">
                                      <td className="py-2 pr-3 border-b border-black/5">
                                        <div className="max-w-[560px] truncate" title={name}>{name}</div>
                                      </td>
                                      <td className="py-2 px-3 border-b border-black/5">
                                        <div className="h-10 w-10 md:h-12 md:w-12 relative rounded overflow-hidden bg-neutral-50 ring-1 ring-black/10">
                                          <ImageWithFallback src={imgSrc} alt={name} className="object-cover" sizes="48px" />
                                        </div>
                                      </td>
                                      <td className="py-2 px-3 border-b border-black/5 text-neutral-700">{sku}</td>
                                      <td className="py-2 px-3 border-b border-black/5">{it.quantity}</td>
                                      {hasUnitPrice ? (
                                        <td className="py-2 px-3 border-b border-black/5 text-right">{typeof unitPrice === 'number' && unitPrice > 0 ? formatVND(unitPrice) : '-'}</td>
                                      ) : null}
                                      {hasLineTotal ? (
                                        <td className="py-2 pl-3 border-b border-black/5 text-right">{typeof lineTotal === 'number' ? formatVND(lineTotal) : '-'}</td>
                                      ) : null}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                            <div className="space-y-1">
                              {order.discountAmount ? (
                                <div>Giảm giá: <strong>-{formatVND(order.discountAmount)}</strong></div>
                              ) : null}
                              {order.shippingFee != null ? (
                                <div>Phí vận chuyển: <strong>{formatVND(order.shippingFee)}</strong></div>
                              ) : null}
                            </div>
                            <div className="sm:text-right space-y-1">
                              <div>Tạm tính: <strong>{formatVND(order.subtotalAmount ?? order.subtotal ?? 0)}</strong></div>
                              <div>Tổng tiền: <strong className="text-red-700">{formatVND(order.totalAmount ?? order.total ?? 0)}</strong></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <div className="text-neutral-600">Trang {safePage}/{totalPages}</div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-md border border-black/10 disabled:opacity-50"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                        >
                          Trước
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-md border border-black/10 disabled:opacity-50"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        )}

        <div className="mt-8 text-sm text-neutral-600">
          <p>
            Bạn cần hỗ trợ? Xem thêm tại <Link href={ROUTES.help} className="underline">Trợ giúp</Link> hoặc <Link href={ROUTES.contact} className="underline">Liên hệ</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
