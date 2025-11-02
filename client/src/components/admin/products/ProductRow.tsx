"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product, ProductVariant } from "@/type/product";
import { getDiscountedVariants, getMinPrice } from "@/utils/priceHelper";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import ExpandedVariantsTable from "./ExpandedVariantsTable";

const LOW_THRESHOLD = 5;

export type ProductRowProps = {
  product: Product;
  selected: boolean;
  expanded: boolean;
  stockMap: Record<string, { total: number; variantCount: number; low: boolean }>;
  variantsMap: Record<string, ProductVariant[]>;
  savingVariant: Record<string, boolean>;
  stockLoading: boolean;
  VND: Intl.NumberFormat;
  onToggleSelect: (id: string, checked: boolean) => void;
  onToggleActive: (product: Product) => void;
  onToggleExpand: (id: string) => void;
  onAskDelete: (id: string) => void;
  onPercentKeyDown: (productId: string, variant: ProductVariant) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPercentApplyClick: (productId: string, variant: ProductVariant) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveDiscountClick: (productId: string, variant: ProductVariant) => () => Promise<void>;
  onStockInputKeyDown: (productId: string, variant: ProductVariant) => (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onStockSaveClick: (productId: string, variant: ProductVariant) => (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function ProductRow({
  product: p,
  selected,
  expanded,
  stockMap,
  variantsMap,
  savingVariant,
  stockLoading,
  VND,
  onToggleSelect,
  onToggleActive,
  onToggleExpand,
  onAskDelete,
  onPercentKeyDown,
  onPercentApplyClick,
  onRemoveDiscountClick,
  onStockInputKeyDown,
  onStockSaveClick,
}: ProductRowProps) {
  return (
    <React.Fragment key={p.id}>
      <TableRow>
        <TableCell>
          <Checkbox
            checked={selected}
            onCheckedChange={(v) => onToggleSelect(p.id, Boolean(v))}
            aria-label={`Chọn ${p.name}`}
          />
        </TableCell>
        <TableCell className="relative">
          <div className="group w-10 h-10 rounded overflow-hidden bg-neutral-100">
            {p.thumbnailUrl || p.images?.[0] ? (
              <Image
                src={(p.thumbnailUrl || p.images?.[0]) as string}
                alt={p.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-neutral-200" />
            )}
          </div>

          {(p.thumbnailUrl || p.images?.[0]) && (
            <div className="pointer-events-none absolute left-12 top-1 hidden group-hover:block">
              <div className="rounded border bg-white p-1 shadow-xl">
                <Image
                  src={(p.thumbnailUrl || p.images?.[0]) as string}
                  alt={p.name}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-cover rounded"
                  unoptimized
                />
              </div>
            </div>
          )}
        </TableCell>
        <TableCell className="font-medium">{p.name}</TableCell>
        <TableCell>{p.slug}</TableCell>
        <TableCell>
          {(() => {
            let vs = variantsMap[p.id] || [];
            if (!vs.length && Array.isArray(p.variants) && p.variants.length > 0) {
              vs = p.variants as unknown as ProductVariant[];
            }
            if (!vs.length) {
              const minEff =
                typeof p.minEffectivePrice === "number" ? Number(p.minEffectivePrice) : undefined;
              return (
                <span className="font-medium">
                  {typeof minEff === "number" && Number.isFinite(minEff) ? (
                    VND.format(minEff)
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </span>
              );
            }

            const discountedVariants = getDiscountedVariants(vs);
            const minPrice = getMinPrice(vs);

            const allVariantsPricing = vs.map((v) => ({
              variant: v,
              pricing: {
                effectivePrice: v.price ?? 0,
                originalPrice: v.price ?? 0,
                hasDiscount: false,
                discountPercent: 0,
                discountPrice: v.discountPrice,
              },
            }));

            if (discountedVariants.length) {
              const top = discountedVariants[0];
              const badgeVariant: "destructive" | "outline" =
                top.pricing.discountPercent > 40 ? "destructive" : "outline";
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-default">
                      <span className="line-through text-muted-foreground text-xs">
                        {VND.format(top.pricing.originalPrice)}
                      </span>
                      <span className="font-semibold text-[#AE1C2C]">
                        → {VND.format(top.pricing.effectivePrice)}
                      </span>
                      <Badge variant={badgeVariant} className="text-[10px]">
                        -{top.pricing.discountPercent}%
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[380px]">
                    <div className="text-xs font-medium mb-2">Chi tiết giá các biến thể</div>
                    <ul className="space-y-1 text-xs">
                      {vs.slice(0, 8).map((v) => {
                        const discountData = discountedVariants.find((x) => x.variant.id === v.id);
                        const hasDiscount = !!discountData;
                        return (
                          <li
                            key={v.id}
                            className="flex items-center justify-between gap-2 py-0.5"
                          >
                            <span className="truncate max-w-[140px] text-[11px]" title={v.name}>
                              {v.name}
                            </span>
                            {hasDiscount ? (
                              <>
                                <span className="text-muted-foreground line-through text-[10px]">
                                  {VND.format(discountData.pricing.originalPrice)}
                                </span>
                                <span className="font-semibold text-[#AE1C2C] text-[11px]">
                                  {VND.format(discountData.pricing.effectivePrice)}
                                </span>
                                <Badge
                                  variant={
                                    discountData.pricing.discountPercent > 40
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="text-[9px] h-4"
                                >
                                  -{discountData.pricing.discountPercent}%
                                </Badge>
                              </>
                            ) : (
                              <>
                                <span className="font-medium text-[11px]">
                                  {VND.format(v.price ?? 0)}
                                </span>
                                <span className="text-[10px] text-muted-foreground italic">
                                  Chưa KM
                                </span>
                              </>
                            )}
                          </li>
                        );
                      })}
                      {vs.length > 8 && (
                        <li className="text-muted-foreground text-[10px] pt-1">
                          +{vs.length - 8} biến thể khác…
                        </li>
                      )}
                    </ul>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-default">
                    <span className="font-medium">{VND.format(minPrice)}</span>
                    <span className="text-[10px] text-muted-foreground">(Chưa KM)</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-[320px]">
                  <div className="text-xs font-medium mb-1">Giá các biến thể</div>
                  <ul className="space-y-1 text-xs">
                    {vs.slice(0, 8).map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-2">
                        <span className="truncate max-w-[180px]" title={v.name}>
                          {v.name}
                        </span>
                        <span className="font-medium">{VND.format(v.price ?? 0)}</span>
                      </li>
                    ))}
                    {vs.length > 8 && (
                      <li className="text-muted-foreground">+{vs.length - 8} biến thể khác…</li>
                    )}
                  </ul>
                </TooltipContent>
              </Tooltip>
            );
          })()}
        </TableCell>
        <TableCell>
          {stockMap[p.id] ? (
            <span>{stockMap[p.id].variantCount}</span>
          ) : stockLoading ? (
            <span className="text-xs text-muted-foreground">Đang tải…</span>
          ) : (
            <span>—</span>
          )}
        </TableCell>
        <TableCell>
          {stockMap[p.id] ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <span>{stockMap[p.id].total}</span>
                  {stockMap[p.id].low && (
                    <StatusBadge status="warning" className="text-[10px]">
                      Cảnh báo kho thấp
                    </StatusBadge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="max-w-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium">Chi tiết tồn theo biến thể</div>
                  {variantsMap[p.id]?.length ? (
                    <>
                      <div className="text-[11px] text-muted-foreground">
                        Tổng biến thể: {variantsMap[p.id].length} • Hết hàng:{" "}
                        {variantsMap[p.id].filter((v) => (v.stockQuantity ?? 0) === 0).length} •
                        Sắp hết:{" "}
                        {
                          variantsMap[p.id].filter(
                            (v) =>
                              (v.stockQuantity ?? 0) > 0 &&
                              (v.stockQuantity ?? 0) <= LOW_THRESHOLD
                          ).length
                        }
                      </div>
                      <ul className="text-xs list-disc pl-4">
                        {variantsMap[p.id].slice(0, 6).map((v) => {
                          const s = v.stockQuantity ?? 0;
                          const zero = s === 0;
                          const low = s > 0 && s <= LOW_THRESHOLD;
                          return (
                            <li
                              key={v.id}
                              className={
                                zero ? "text-red-600" : low ? "text-amber-600" : undefined
                              }
                            >
                              <span className="inline-flex items-center gap-2">
                                <span>
                                  {v.name || v.sku || "Biến thể"}: {s}
                                </span>
                                {zero ? (
                                  <StatusBadge status="danger" className="text-[10px]">
                                    Hết
                                  </StatusBadge>
                                ) : low ? (
                                  <StatusBadge status="warning" className="text-[10px]">
                                    Thấp
                                  </StatusBadge>
                                ) : null}
                              </span>
                            </li>
                          );
                        })}
                        {variantsMap[p.id].length > 6 && (
                          <li>… và {variantsMap[p.id].length - 6} biến thể khác</li>
                        )}
                      </ul>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">Không có dữ liệu biến thể</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : stockLoading ? (
            <span className="text-xs text-muted-foreground">Đang tải…</span>
          ) : (
            <span>—</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {p.isActive ? (
              <StatusBadge status="success">Hiển thị</StatusBadge>
            ) : (
              <StatusBadge status="neutral">Ẩn</StatusBadge>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={() => onToggleActive(p)}>
              {p.isActive ? "Ẩn" : "Hiển thị"}
            </Button>
          </div>
        </TableCell>
        <TableCell className="space-x-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <Link href={`/admin/products/${p.id}`}>
              <Pencil className="size-4" aria-hidden />
              Sửa
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onAskDelete(p.id)}
            className="inline-flex items-center gap-2"
          >
            <Trash2 className="size-4" aria-hidden />
            Xóa
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggleExpand(p.id)}
            className="inline-flex items-center gap-1"
          >
            {expanded ? (
              <ChevronDown className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
            Xem tồn
          </Button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={9}>
            <ExpandedVariantsTable
              productId={p.id}
              productName={p.name}
              variants={variantsMap[p.id] || []}
              savingVariant={savingVariant}
              VND={VND}
              onPercentKeyDown={onPercentKeyDown}
              onPercentApplyClick={onPercentApplyClick}
              onRemoveDiscountClick={onRemoveDiscountClick}
              onStockInputKeyDown={onStockInputKeyDown}
              onStockSaveClick={onStockSaveClick}
              loading={stockLoading}
            />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
