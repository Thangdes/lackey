"use client";
import React, { useState } from "react";
import { ConfigState } from "./ConfiguratorWizard";
import { CASE_COLORS, KEYCAP_THEMES, PLATE_MATERIALS } from "./KeyboardVisualizer";
import { siteConfig } from "@/constant/site";
import { X, Mail } from "lucide-react";
import Image from "next/image";

interface OrderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigState;
  keyOverrides?: Record<string, "alpha" | "mod" | "accent">;
}

export function OrderRequestModal({ isOpen, onClose, config, keyOverrides }: OrderRequestModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  if (!isOpen) return null;

  // Retrieve Zalo from siteConfig or fallback
  const sameAs = siteConfig.sameAs || [];
  const zaloFromSameAs = sameAs.find((u) => /zalo\.me\//.test(u));
  const zaloNumber = zaloFromSameAs ? zaloFromSameAs.split("zalo.me/")[1] : "0919600801";
  const emailTo = siteConfig.contact.email || "lackey6886@gmail.com";

  // Translate details
  const caseName = CASE_COLORS[config.caseColor]?.name || config.caseColor;
  const plateName = PLATE_MATERIALS[config.plateMaterial]?.name || config.plateMaterial;
  const themeName = KEYCAP_THEMES[config.keycapTheme]?.name || config.keycapTheme;
  const switchName = 
    config.switchType === "red_max" ? "Red Max (Linear - Mượt)" :
    config.switchType === "brown_max" ? "Brown Max (Tactile - Khấc)" :
    config.switchType === "blue_max" ? "Blue Max (Clicky - Giòn)" :
    "Black Max (Heavy Linear - Đầm)";

  // Price calculations
  const layoutBasePrice = config.layout === "60" ? 850000 : config.layout === "65" ? 1200000 : config.layout === "75" ? 1450000 : 1600000;
  const caseExtraPrice = config.caseColor === "acrylic" ? 250000 : config.caseColor === "gray" ? 300000 : 0;
  const switchPrice = 
    config.switchType === "red_max" ? 280000 : 
    config.switchType === "brown_max" ? 320000 : 
    config.switchType === "blue_max" ? 350000 : 300000;
  const platePrice = config.plateMaterial === "pc" ? 150000 : config.plateMaterial === "brass" ? 380000 : config.plateMaterial === "fr4" ? 200000 : 250000;
  const keycapPrice = 
    config.keycapTheme === "vintageSky" ? 480000 :
    config.keycapTheme === "carbonSlate" ? 580000 : 
    config.keycapTheme === "matcha" ? 520000 : 
    config.keycapTheme === "cyberpunk" ? 650000 : 450000;
  const cablePrice = config.hasCable ? 350000 : 0;
  const assemblyPrice = config.hasAssembly ? 250000 : 0;
  
  const totalPrice = layoutBasePrice + caseExtraPrice + switchPrice + platePrice + keycapPrice + cablePrice + assemblyPrice;

  // Compile detailed text message
  const compileMessage = () => {
    const textLines = [
      `XIN CHÀO LẮCKEY! TÔI MUỐN ĐẶT BUILD BÀN PHÍM CUSTOM`,
      `---------------------------------------`,
      `Cấu hình chi tiết:`,
      `- Bố cục layout: Bàn phím ${config.layout}%`,
      `- Chất liệu/Màu vỏ: ${caseName}`,
      `- Tấm định vị (Plate): ${plateName}`,
      `- Loại switches: ${switchName}`,
      `- Phối màu Keycaps: ${themeName}`,
      `- Phím accent (Esc/Enter): ${config.accentColor !== "default" ? config.accentColor : "Mặc định theo theme"}`,
      ...(Object.keys(keyOverrides || {}).length > 0
        ? [`- Phối màu phím thủ công (Editor): Có (${Object.keys(keyOverrides || {}).length} phím được tô màu riêng)`]
        : []),
      `- Cáp xoắn custom: ${config.hasCable ? "Có" : "Không"}`,
      `- Dịch vụ modding/assembly: ${config.hasAssembly ? "Có" : "Không"}`,
      `---------------------------------------`,
      `* Tổng chi phí dự kiến: ${totalPrice.toLocaleString("vi-VN")} ₫`,
      ``,
      `Thông tin liên hệ của tôi:`,
      `- Họ và tên: ${form.name}`,
      `- Số điện thoại: ${form.phone}`,
      `- Địa chỉ giao hàng: ${form.address || "Chưa cung cấp"}`,
    ];

    if (form.notes.trim()) {
      textLines.push(`- Ghi chú thêm: ${form.notes}`);
    }

    return textLines.join("\n");
  };

  const handleSendZalo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập Họ tên và Số điện thoại!");
      return;
    }
    const message = compileMessage();
    const zaloUrl = `https://zalo.me/${zaloNumber}?text=${encodeURIComponent(message)}`;
    window.open(zaloUrl, "_blank");
    onClose();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Vui lòng nhập Họ tên và Số điện thoại!");
      return;
    }
    const message = compileMessage();
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(`Yêu cầu build bàn phím custom - ${form.name}`)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-neutral-900 text-base">Gửi Yêu Cầu Build Phím</h3>
            <p className="text-xs text-neutral-400">Chọn phương thức gửi cấu hình chi tiết tới LắcKey</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Summary Preview */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/50 text-xs text-neutral-700 space-y-1.5">
            <div className="font-bold text-neutral-900 mb-1 flex items-center justify-between">
              <span>Cấu hình của bạn:</span>
              <span className="text-neutral-950 font-extrabold text-sm">{totalPrice.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div>• Layout: <span className="font-medium text-neutral-900">{config.layout}%</span></div>
            <div>• Vỏ: <span className="font-medium text-neutral-900">{caseName}</span></div>
            <div>• Switch: <span className="font-medium text-neutral-900">{switchName}</span></div>
            <div>• Keycaps: <span className="font-medium text-neutral-900">{themeName}</span></div>
          </div>

          <div className="space-y-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-name" className="text-xs font-bold text-neutral-700">Họ và tên <span className="text-red-500">*</span></label>
              <input
                id="modal-name"
                type="text"
                required
                placeholder="VD: Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-medium text-neutral-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-phone" className="text-xs font-bold text-neutral-700">Số điện thoại <span className="text-red-500">*</span></label>
              <input
                id="modal-phone"
                type="tel"
                required
                placeholder="VD: 0912 xxx xxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-medium text-neutral-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-address" className="text-xs font-bold text-neutral-700">Địa chỉ giao hàng</label>
              <input
                id="modal-address"
                type="text"
                placeholder="Số nhà, Tên đường, Phường, Quận, Thành phố..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-medium text-neutral-900"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-notes" className="text-xs font-bold text-neutral-700">Ghi chú yêu cầu thêm (nếu có)</label>
              <textarea
                id="modal-notes"
                rows={3}
                placeholder="Ghi chú về lực nhấn switch, lót thêm foam đặc biệt, hoặc màu cáp xoắn mong muốn..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all font-medium text-neutral-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-neutral-100 bg-neutral-50 grid grid-cols-2 gap-3.5">
          {/* Zalo Button */}
          <button
            onClick={handleSendZalo}
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer transition-all"
          >
            <div className="w-4 h-4 relative shrink-0">
              <Image src="/logo/Zalo.png" alt="Zalo" fill className="object-contain rounded-sm" />
            </div>
            <span>Gửi qua Zalo</span>
          </button>

          {/* Email Button */}
          <button
            onClick={handleSendEmail}
            type="button"
            className="bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Gửi qua Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}
