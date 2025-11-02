import { useCallback, useMemo, useState } from "react";
import { productService } from "@/service/product.service";
import type { Product, ProductVariant } from "@/type/product";
import { showErrorToast, showSuccessToast } from "@/components/toast/AppToast";
import { validateAndSuggestVariantName, extractBaseNameFromVariant } from "@/utils/variantNameHelper";

export function useProductVariants(productId: string, data: Product | null, setData: React.Dispatch<React.SetStateAction<Product | null>>) {
  const [nvBaseName, setNvBaseName] = useState("");
  const [nvSku, setNvSku] = useState("");
  const [nvPrice, setNvPrice] = useState<string>("");
  const [nvDiscountPrice, setNvDiscountPrice] = useState<string>("");
  const [nvDiscountAmount, setNvDiscountAmount] = useState<string>("");
  const [nvDiscountMode, setNvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [nvStock, setNvStock] = useState<string>("");
  const [nvWeight, setNvWeight] = useState<string>("");
  const [addingVariant, setAddingVariant] = useState(false);

  const [evOpen, setEvOpen] = useState(false);
  const [evSaving, setEvSaving] = useState(false);
  const [evVid, setEvVid] = useState<string>("");
  const [evBaseName, setEvBaseName] = useState("");
  const [evSku, setEvSku] = useState("");
  const [evPrice, setEvPrice] = useState<string>("");
  const [evDiscountPrice, setEvDiscountPrice] = useState<string>("");
  const [evDiscountAmount, setEvDiscountAmount] = useState<string>("");
  const [evDiscountMode, setEvDiscountMode] = useState<"PERCENT" | "AMOUNT">("PERCENT");
  const [evStock, setEvStock] = useState<string>("");
  const [evWeight, setEvWeight] = useState<string>("");

  const nvFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(nvBaseName, nvWeight);
    return nameValidation.suggestedName || nvBaseName;
  }, [nvBaseName, nvWeight]);

  const evFinalName = useMemo(() => {
    const nameValidation = validateAndSuggestVariantName(evBaseName, evWeight);
    return nameValidation.suggestedName || evBaseName;
  }, [evBaseName, evWeight]);

  const refreshVariants = useCallback(async () => {
    if (!productId) return;
    const vs = await productService.listVariants(productId);
    setData((d) => (d ? ({ ...(d as Product), variants: vs }) : d));
  }, [productId, setData]);

  const onAddVariant = useCallback(async () => {
    if (!data) return;
    try {
      setAddingVariant(true);
      const priceNum = Number(nvPrice);
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá phải là số không âm" });
        setAddingVariant(false);
        return;
      }
      const discountPct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
      if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) {
        showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Phần trăm giảm giá phải từ 0 đến 100" });
        setAddingVariant(false);
        return;
      }
      const discountAmountNum = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
      if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) {
        showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá sau giảm phải từ 0 đến Giá" });
        setAddingVariant(false);
        return;
      }
      const discountedPrice =
        nvDiscountMode === "AMOUNT"
          ? discountAmountNum == null
            ? null
            : discountAmountNum
          : discountPct == null
          ? null
          : Math.max(0, Math.round(priceNum * (1 - discountPct / 100)));
      const payload: Omit<ProductVariant, "id"> & { stockQuantity?: number } = {
        name: nvFinalName,
        sku: nvSku || "",
        price: priceNum,
        ...(discountedPrice != null ? { discountPrice: discountedPrice } : {}),
        stockQuantity: nvStock === "" ? 0 : Number(nvStock),
      };
      await productService.addVariant(productId, payload);
      await refreshVariants();
      setNvBaseName("");
      setNvSku("");
      setNvPrice("");
      setNvDiscountPrice("");
      setNvDiscountAmount("");
      setNvDiscountMode("PERCENT");
      setNvStock("");
      setNvWeight("");
      showSuccessToast({ title: "Đã thêm biến thể" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Không thể thêm biến thể";
      showErrorToast({ title: "Không thể thêm biến thể", message: msg });
    } finally {
      setAddingVariant(false);
    }
  }, [data, productId, nvFinalName, nvSku, nvPrice, nvDiscountPrice, nvDiscountAmount, nvDiscountMode, nvStock, refreshVariants]);

  const onVariantEdit = useCallback(
    (vid: string) => {
      const v = data?.variants?.find((x) => x.id === vid) as ProductVariant | undefined;
      if (!v) return;

      const baseName = extractBaseNameFromVariant(v.name || "");
      const extractedWeight = v.weight || 0;

      setEvVid(v.id);
      setEvBaseName(baseName);
      setEvWeight(String(extractedWeight));
      setEvSku(v.sku || "");
      setEvPrice(String(v.price ?? 0));
      if (v.discountPrice != null && v.price) {
        const p = Number(v.price) || 0;
        const dp = Number(v.discountPrice);
        const pct = p > 0 && dp < p ? Math.round((1 - dp / p) * 100) : 0;
        setEvDiscountPrice(pct ? String(pct) : "");
        setEvDiscountAmount(String(dp));
        setEvDiscountMode("AMOUNT");
      } else {
        setEvDiscountPrice("");
        setEvDiscountAmount("");
      }
      setEvStock(String(v.stockQuantity ?? 0));
      setEvOpen(true);
    },
    [data]
  );

  const onEditVariantSave = useCallback(async () => {
    if (!data || !evVid) return;
    const priceNum = Number(evPrice);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá phải là số không âm" });
      return;
    }
    const discountPct = evDiscountPrice === "" ? null : Number(evDiscountPrice);
    if (discountPct != null && (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 100)) {
      showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Phần trăm giảm giá phải từ 0 đến 100" });
      return;
    }
    const discountAmountNum = evDiscountAmount === "" ? null : Number(evDiscountAmount);
    if (discountAmountNum != null && (!Number.isFinite(discountAmountNum) || discountAmountNum < 0 || discountAmountNum > priceNum)) {
      showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Giá sau giảm phải từ 0 đến Giá" });
      return;
    }
    const discountedPrice =
      discountAmountNum != null ? discountAmountNum : discountPct == null ? null : Math.max(0, Math.round(priceNum * (1 - discountPct / 100)));
    const stockNum = evStock === "" ? 0 : Number(evStock);
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      showErrorToast({ title: "Dữ liệu không hợp lệ", message: "Kho phải là số không âm" });
      return;
    }
    try {
      setEvSaving(true);
      await productService.updateVariant(productId, evVid, {
        name: evFinalName,
        sku: evSku || undefined,
        price: priceNum,
        ...(discountedPrice != null ? { discountPrice: discountedPrice } : {}),
        stockQuantity: stockNum,
      });
      await refreshVariants();
      showSuccessToast({ title: "Đã cập nhật biến thể" });
      setEvOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể cập nhật biến thể";
      showErrorToast({ title: "Không thể cập nhật biến thể", message: msg });
    } finally {
      setEvSaving(false);
    }
  }, [data, productId, evVid, evFinalName, evSku, evPrice, evDiscountPrice, evDiscountAmount, evStock, refreshVariants]);

  const onVariantDelete = useCallback(
    async (vid: string) => {
      try {
        await productService.removeVariant(productId, vid);
        await refreshVariants();
        showSuccessToast({ title: "Đã xóa biến thể" });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Cannot delete variant because it is associated with existing orders")) {
          showErrorToast({ title: "Không thể xóa biến thể", message: "Đang được liên kết với các đơn hàng hiện có." });
        } else {
          showErrorToast({ title: "Không thể xóa biến thể", message: msg || "Không thể xóa biến thể" });
        }
      }
    },
    [productId, refreshVariants]
  );

  const handleNvDiscountModeChange = useCallback(
    (v: "PERCENT" | "AMOUNT") => {
      setNvDiscountMode(v);
      const p = Number(nvPrice);
      if (!Number.isFinite(p) || p < 0) return;
      if (v === "AMOUNT") {
        const pct = nvDiscountPrice === "" ? null : Number(nvDiscountPrice);
        if (pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
          const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
          setNvDiscountAmount(String(amt));
        }
      } else {
        const amt = nvDiscountAmount === "" ? null : Number(nvDiscountAmount);
        if (amt != null && Number.isFinite(amt) && amt >= 0 && amt <= p && p > 0) {
          const pct = Math.round((1 - amt / p) * 100);
          setNvDiscountPrice(String(pct));
        }
      }
    },
    [nvPrice, nvDiscountPrice, nvDiscountAmount]
  );

  const handleEvDiscountModeChange = useCallback(
    (v: "PERCENT" | "AMOUNT") => {
      setEvDiscountMode(v);
      const p = Number(evPrice);
      if (!Number.isFinite(p) || p < 0) return;
      if (v === "AMOUNT") {
        const pct = evDiscountPrice === "" ? null : Number(evDiscountPrice);
        if (pct != null && Number.isFinite(pct) && pct >= 0 && pct <= 100) {
          const amt = Math.max(0, Math.round(p * (1 - pct / 100)));
          setEvDiscountAmount(String(amt));
        }
      } else {
        const amt = evDiscountAmount === "" ? null : Number(evDiscountAmount);
        if (amt != null && Number.isFinite(amt) && amt >= 0 && amt <= p && p > 0) {
          const pct = Math.round((1 - amt / p) * 100);
          setEvDiscountPrice(String(pct));
        }
      }
    },
    [evPrice, evDiscountPrice, evDiscountAmount]
  );

  return {
    // Add Variant State
    nvBaseName,
    nvSku,
    nvPrice,
    nvDiscountPrice,
    nvDiscountAmount,
    nvDiscountMode,
    nvStock,
    nvWeight,
    nvFinalName,
    addingVariant,
    setNvBaseName,
    setNvSku,
    setNvPrice,
    setNvDiscountPrice,
    setNvDiscountAmount,
    setNvStock,
    setNvWeight,
    
    // Edit Variant State
    evOpen,
    evSaving,
    evVid,
    evBaseName,
    evSku,
    evPrice,
    evDiscountPrice,
    evDiscountAmount,
    evDiscountMode,
    evStock,
    evWeight,
    evFinalName,
    setEvOpen,
    setEvBaseName,
    setEvSku,
    setEvPrice,
    setEvDiscountPrice,
    setEvDiscountAmount,
    setEvStock,
    setEvWeight,
    
    // Actions
    onAddVariant,
    onVariantEdit,
    onEditVariantSave,
    onVariantDelete,
    handleNvDiscountModeChange,
    handleEvDiscountModeChange,
    refreshVariants,
  };
}
