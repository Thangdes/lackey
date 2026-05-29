"use client";
import React, { useState } from "react";
import { ConfigState } from "./ConfiguratorWizard";
import { CASE_COLORS, KEYCAP_THEMES, PLATE_MATERIALS } from "./KeyboardVisualizer";
import { Share2, Download, ShoppingCart, Check } from "lucide-react";

interface PricingSummaryProps {
  config: ConfigState;
  onOpenOrderModal: () => void;
  keyOverrides?: Record<string, "alpha" | "mod" | "accent">;
}

export function PricingSummary({ config, onOpenOrderModal, keyOverrides }: PricingSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Price calculations
  const layoutBasePrice = (() => {
    switch (config.layout) {
      case "60": return 850000;
      case "65": return 1200000;
      case "75": return 1450000;
      case "tkl": return 1600000;
    }
  })();

  const caseExtraPrice = (() => {
    switch (config.caseColor) {
      case "acrylic": return 250000;
      case "gray": return 300000;
      default: return 0;
    }
  })();

  const switchPrice = (() => {
    switch (config.switchType) {
      case "red_max": return 280000;
      case "brown_max": return 320000;
      case "blue_max": return 350000;
      case "black_max": return 300000;
      default: return 280000;
    }
  })();

  const platePrice = (() => {
    switch (config.plateMaterial) {
      case "pc": return 150000;
      case "brass": return 380000;
      case "fr4": return 200000;
      case "aluminum": return 250000;
      default: return 0;
    }
  })();

  const keycapPrice = (() => {
    switch (config.keycapTheme) {
      case "vintageSky": return 480000;
      case "carbonSlate": return 580000;
      case "matcha": return 520000;
      case "cyberpunk": return 650000;
      case "lavender": return 450000;
      case "monochrome": return 450000;
      default: return 0;
    }
  })();

  const cablePrice = config.hasCable ? 350000 : 0;
  const assemblyPrice = config.hasAssembly ? 250000 : 0;

  const totalPrice = 
    layoutBasePrice + 
    caseExtraPrice + 
    switchPrice + 
    platePrice + 
    keycapPrice + 
    cablePrice + 
    assemblyPrice;

  // Generate share link
  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const query = new URLSearchParams({
      layout: config.layout,
      case: config.caseColor,
      plate: config.plateMaterial,
      switch: config.switchType,
      keycap: config.keycapTheme,
      accent: config.accentColor,
      cable: String(config.hasCable),
      assembly: String(config.hasAssembly),
    }).toString();

    const shareUrl = `${window.location.origin}${window.location.pathname}?${query}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Export visualizer as PNG image using html2canvas
  const handleExportPNG = async () => {
    if (typeof window === "undefined") return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const element = document.getElementById("keyboard-visualizer-capture");
      if (!element) throw new Error("Visualizer element not found");

      // Capture options
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null, // transparent case surrounding
        scale: 2, // high-res
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `lackey-custom-keyboard-${config.layout}pct.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export image failure:", err);
      alert("Không thể xuất ảnh bàn phím. Vui lòng thử lại!");
    } finally {
      setExporting(false);
    }
  };

  const caseName = CASE_COLORS[config.caseColor]?.name || config.caseColor;
  const plateName = PLATE_MATERIALS[config.plateMaterial]?.name || config.plateMaterial;
  const themeName = KEYCAP_THEMES[config.keycapTheme]?.name || config.keycapTheme;
  const switchName = 
    config.switchType === "red_max" ? "Red Max (Linear - Mượt)" :
    config.switchType === "brown_max" ? "Brown Max (Tactile - Khấc)" :
    config.switchType === "blue_max" ? "Blue Max (Clicky - Giòn)" :
    config.switchType === "black_max" ? "Black Max (Heavy Linear - Đầm)" : "Custom Switch";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="border-b border-neutral-100 pb-3">
        <h3 className="text-base font-bold text-neutral-900">Chi Tiết Cấu Hình</h3>
        <p className="text-xs text-neutral-400">Bảng kê giá trị linh kiện chi tiết</p>
      </div>

      {/* Itemized Pricing List */}
      <div className="space-y-3.5 text-xs text-neutral-600">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-neutral-800">Kit phím ({config.layout}%)</span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">Vỏ: {caseName}</span>
          </div>
          <span className="font-semibold text-neutral-950 text-right">
            {(layoutBasePrice + caseExtraPrice).toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-neutral-800">Switch</span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">Loại: {switchName}</span>
          </div>
          <span className="font-semibold text-neutral-950 text-right">
            {switchPrice.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-neutral-800">Plate (Định vị)</span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">{plateName}</span>
          </div>
          <span className="font-semibold text-neutral-950 text-right">
            {platePrice.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <span className="font-bold text-neutral-800">Bộ Keycaps</span>
            <span className="block text-[10px] text-neutral-400 mt-0.5">
              Theme: {themeName} {config.accentColor !== "default" ? "(Custom Accent)" : ""}
              {Object.keys(keyOverrides || {}).length > 0 ? ` (+${Object.keys(keyOverrides || {}).length} phím custom)` : ""}
            </span>
          </div>
          <span className="font-semibold text-neutral-950 text-right">
            {keycapPrice.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        {config.hasCable && (
          <div className="flex justify-between items-center">
            <span className="font-bold text-neutral-800">Cáp xoắn Custom Coiled</span>
            <span className="font-semibold text-neutral-950 text-right">350.000 ₫</span>
          </div>
        )}

        {config.hasAssembly && (
          <div className="flex justify-between items-center">
            <span className="font-bold text-neutral-800">Modding & Lắp ráp trọn gói</span>
            <span className="font-semibold text-neutral-950 text-right">250.000 ₫</span>
          </div>
        )}
      </div>

      {/* Total Price Section */}
      <div className="bg-neutral-900 text-white rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Tổng Chi Phí</span>
          <span className="block text-xl font-extrabold tracking-tight mt-0.5">
            {totalPrice.toLocaleString("vi-VN")} ₫
          </span>
        </div>
        
        {/* Order CTA */}
        <button
          onClick={onOpenOrderModal}
          type="button"
          className="bg-white hover:bg-neutral-100 text-neutral-950 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Đặt hàng</span>
        </button>
      </div>

      {/* Utility Actions */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer text-neutral-700"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-bold">Đã chép link!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ link</span>
            </>
          )}
        </button>

        <button
          type="button"
          disabled={exporting}
          onClick={handleExportPNG}
          className="flex items-center justify-center gap-1.5 py-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-colors cursor-pointer text-neutral-700 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? "Đang xuất..." : "Tải ảnh PNG"}</span>
        </button>
      </div>
    </div>
  );
}
