"use client";
import React from "react";
import Link from "next/link";
import type { ProductVariant } from "@/type/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";

const LOW_THRESHOLD = 5;

export type ExpandedVariantsTableProps = {
  productId: string;
  productName: string;
  variants: ProductVariant[];
  savingVariant: Record<string, boolean>;
  VND: Intl.NumberFormat;
  onPercentKeyDown: (productId: string, variant: ProductVariant) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPercentApplyClick: (productId: string, variant: ProductVariant) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveDiscountClick: (productId: string, variant: ProductVariant) => () => Promise<void>;
  onStockInputKeyDown: (productId: string, variant: ProductVariant) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onStockSaveClick: (productId: string, variant: ProductVariant) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
};

export default function ExpandedVariantsTable({
  productId,
  productName,
  variants,
  savingVariant,
  VND,
  onPercentKeyDown,
  onPercentApplyClick,
  onRemoveDiscountClick,
  onStockInputKeyDown,
  onStockSaveClick,
  loading,
}: ExpandedVariantsTableProps) {
  return (
    <div className="border rounded-md p-3 bg-muted/20">
      <div className="text-sm font-medium mb-2">Biến thể của: {productName}</div>
      {variants?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 pr-2">Tên</th>
                <th className="py-1 pr-2">SKU</th>
                <th className="py-1 pr-2">Giá</th>
                <th className="py-1 pr-2">Khuyến mãi</th>
                <th className="py-1 pr-2">Kho hiện tại</th>
                <th className="py-1 pr-2">Chỉnh sửa kho</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="py-1 pr-2">{v.name}</td>
                  <td className="py-1 pr-2">{v.sku}</td>
                  <td className="py-1 pr-2">{VND.format(v.price ?? 0)}</td>
                  <td className="py-1 pr-2">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const price = Number(v.price ?? 0);
                        const d = v.discountPrice == null ? NaN : Number(v.discountPrice);
                        return Number.isFinite(d) && d < price;
                      })() ? (
                        <>
                          <span className="line-through text-muted-foreground">
                            {VND.format(Number(v.price ?? 0))}
                          </span>
                          <span className="font-medium">
                            → {VND.format(Number(v.discountPrice ?? v.price ?? 0))}
                          </span>
                          {(() => {
                            const price = Number(v.price ?? 0);
                            const d = v.discountPrice == null ? NaN : Number(v.discountPrice);
                            const pct =
                              price > 0 && Number.isFinite(d)
                                ? Math.round(((price - d) / price) * 100)
                                : 0;
                            const variantStyle: "destructive" | "outline" =
                              pct > 40 ? "destructive" : "outline";
                            return (
                              <Badge variant={variantStyle} className="text-[10px]">
                                -{pct}%
                              </Badge>
                            );
                          })()}
                        </>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Chưa KM
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        key={`pct-${v.id}-${(() => {
                          const price = Number(v.price ?? 0);
                          const dRaw = v.discountPrice;
                          const d = dRaw == null ? NaN : Number(dRaw);
                          return price > 0 && Number.isFinite(d) && d < price
                            ? Math.round(((price - d) / price) * 100)
                            : "";
                        })()}`}
                        type="number"
                        min={1}
                        max={100}
                        placeholder="% KM (1-100)"
                        defaultValue={(() => {
                          const price = Number(v.price ?? 0);
                          const dRaw = v.discountPrice;
                          const d = dRaw == null ? NaN : Number(dRaw);
                          if (price > 0 && Number.isFinite(d) && d < price) {
                            return Math.round(((price - d) / price) * 100);
                          }
                          return "";
                        })()}
                        className="w-24 h-8"
                        onKeyDown={onPercentKeyDown(productId, v)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={onPercentApplyClick(productId, v)}
                      >
                        Áp dụng %
                      </Button>
                      {typeof v.discountPrice === "number" &&
                        v.discountPrice < (v.price ?? 0) && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-8"
                            onClick={onRemoveDiscountClick(productId, v)}
                          >
                            Bỏ KM
                          </Button>
                        )}
                    </div>
                  </td>
                  <td className="py-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span>{v.stockQuantity ?? 0}</span>
                      {(v.stockQuantity ?? 0) === 0 ? (
                        <Badge variant="destructive" className="text-[10px]">
                          Hết hàng
                        </Badge>
                      ) : (v.stockQuantity ?? 0) <= LOW_THRESHOLD ? (
                        <Badge variant="outline" className="text-[10px]">
                          Sắp hết
                        </Badge>
                      ) : (
                        <Badge className="text-[10px]">Còn hàng</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-1 pr-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        defaultValue={v.stockQuantity ?? 0}
                        className="w-28 h-8"
                        onKeyDown={onStockInputKeyDown(productId, v)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={!!savingVariant[v.id]}
                        className="inline-flex items-center gap-1 h-8"
                        onClick={onStockSaveClick(productId, v)}
                      >
                        <Save className="size-4" aria-hidden />
                        {savingVariant[v.id] ? "Đang lưu…" : "Lưu"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : loading ? (
        <div className="text-xs text-muted-foreground">Đang tải biến thể…</div>
      ) : (
        <div className="text-sm text-muted-foreground">Chưa có biến thể</div>
      )}
      <div className="mt-2">
        <Button asChild variant="link" size="sm" className="px-0">
          <Link href={`/admin/products/${productId}`}>Đi tới trang sửa sản phẩm</Link>
        </Button>
      </div>
    </div>
  );
}
