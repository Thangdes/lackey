import { productService } from "@/service/product.service";
import type { Product, ProductVariant } from "@/type/product";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";

const LOW_THRESHOLD = 5;

export async function handleVariantStockSave(
  productId: string,
  variant: ProductVariant,
  stockQuantity: number,
  callbacks: {
    onSuccess: (variants: ProductVariant[]) => void;
    onError?: () => void;
  }
) {
  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
    showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Số lượng phải ≥ 0" });
    return;
  }

  try {
    await productService.updateVariant(productId, variant.id, { stockQuantity });
    const vs = await productService.listVariants(productId);
    callbacks.onSuccess(vs);
    showSuccessToast({ title: "Đã cập nhật số lượng" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Không thể cập nhật số lượng";
    showErrorToast({ title: "Cập nhật thất bại", message: msg });
    callbacks.onError?.();
  }
}

export async function handleVariantDiscountSave(
  productId: string,
  variant: ProductVariant,
  discountPrice: number,
  callbacks: {
    onSuccess: (variants: ProductVariant[]) => void;
    onError?: () => void;
  }
) {
  if (!Number.isFinite(discountPrice) || discountPrice < 0) {
    showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá khuyến mãi phải ≥ 0" });
    return;
  }
  if (discountPrice > (variant.price ?? 0)) {
    showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá khuyến mãi phải ≤ giá bán" });
    return;
  }

  try {
    await productService.updateVariant(productId, variant.id, { discountPrice });
    const vs = await productService.listVariants(productId);
    callbacks.onSuccess(vs);
    showSuccessToast({ title: "Đã cập nhật giá khuyến mãi" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Không thể cập nhật giá khuyến mãi";
    showErrorToast({ title: "Cập nhật thất bại", message: msg });
    callbacks.onError?.();
  }
}

export async function handleRemoveDiscount(
  productId: string,
  variant: ProductVariant,
  callbacks: {
    onSuccess: (variants: ProductVariant[]) => void;
    onError?: () => void;
  }
) {
  try {
    await productService.updateVariant(productId, variant.id, { discountPrice: null as unknown as number });
    const vs = await productService.listVariants(productId);
    callbacks.onSuccess(vs);
    showSuccessToast({ title: "Đã bỏ khuyến mãi" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Không thể bỏ khuyến mãi";
    showErrorToast({ title: "Thao tác thất bại", message: msg });
    callbacks.onError?.();
  }
}

export function calculateDiscountPercent(price: number, discountPercent: number): number {
  if (price <= 0) {
    showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá gốc không hợp lệ" });
    return 0;
  }
  if (!Number.isFinite(discountPercent) || discountPercent < 1 || discountPercent > 100) {
    showErrorToast({ title: "Dữ liệu không hợp lệ", message: "% khuyến mãi phải từ 1 đến 100" });
    return 0;
  }
  return Math.max(0, Math.round((price * (100 - discountPercent)) / 100));
}

export function getStockMeta(variants: ProductVariant[]) {
  const total = variants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
  const variantCount = variants.length;
  const low = total > 0 && total <= LOW_THRESHOLD;
  return { total, variantCount, low };
}
