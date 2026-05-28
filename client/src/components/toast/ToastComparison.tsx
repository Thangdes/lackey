"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { showAddedToCartToast } from "./AddToCartToast";
import { showAddedToCartToastGold } from "./AddToCartToastGold";
import { Palette, Moon, Sun, Sparkles, Check } from "lucide-react";





export default function ToastComparison() {
  const [selectedVersion, setSelectedVersion] = useState<"dark" | "gold">("dark");

  const sampleProduct = {
    name: "Hạt điều rang muối (500g)",
    thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
    quantity: 1
  };

  const versions = [
    {
      id: "dark" as const,
      name: "Dark & Gold (Đen/Vàng)",
      icon: Moon,
      description: "Sang trọng, hiện đại với nền đen và điểm nhấn vàng",
      features: [
        "Nền gradient đen thanh lịch",
        "Điểm nhấn vàng amber nổi bật",
        "Phù hợp website cao cấp",
        "Tạo cảm giác premium, chuyên nghiệp",
        "Tương phản màu rõ ràng"
      ],
      showToast: showAddedToCartToast,
      color: "from-neutral-900 to-neutral-700",
      accentColor: "text-amber-400"
    },
    {
      id: "gold" as const,
      name: "Full Gold (Vàng Chủ Đạo)",
      icon: Sun,
      description: "Ấm áp, nổi bật với tông màu vàng chủ đạo",
      features: [
        "Nền gradient vàng ấm áp",
        "Thiết kế tươi sáng, thu hút",
        "Phù hợp thương hiệu năng động",
        "Tạo cảm giác vui tươi, thân thiện",
        "Màu sắc nổi bật, dễ nhận diện"
      ],
      showToast: showAddedToCartToastGold,
      color: "from-amber-400 to-yellow-500",
      accentColor: "text-amber-900"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-amber-50/30 to-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 mb-4 shadow-2xl">
            <Palette className="w-10 h-10 text-neutral-900" />
          </div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-3">
            Toast Design Comparison
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Chọn phiên bản toast notification phù hợp nhất với thương hiệu của bạn
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {versions.map((version) => {
            const Icon = version.icon;
            const isSelected = selectedVersion === version.id;
            
            return (
              <div
                key={version.id}
                className={`relative bg-white rounded-2xl shadow-lg border-3 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-amber-400 shadow-amber-200"
                    : "border-neutral-200 hover:border-amber-300"
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-lg flex items-center justify-center animate-in zoom-in-50">
                    <Check className="w-6 h-6 text-neutral-900" strokeWidth={3} />
                  </div>
                )}

                <div className="p-6">
                  {}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${version.color} shadow-md`}>
                      <Icon className={`w-6 h-6 ${isSelected ? version.accentColor : "text-white"}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900">{version.name}</h3>
                      <p className="text-sm text-neutral-600">{version.description}</p>
                    </div>
                  </div>

                  {}
                  <div className="space-y-2 mb-4">
                    {version.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        version.showToast(sampleProduct);
                      }}
                      className={`flex-1 h-11 rounded-xl font-bold shadow-md hover:shadow-lg transition-all ${
                        version.id === "dark"
                          ? "bg-gradient-to-r from-neutral-900 to-neutral-700 hover:from-neutral-800 hover:to-neutral-600 text-amber-400"
                          : "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-900"
                      }`}
                    >
                      Xem Demo
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVersion(version.id);
                      }}
                      variant={isSelected ? "default" : "outline"}
                      className={`px-6 h-11 rounded-xl font-bold transition-all ${
                        isSelected
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "border-2 border-neutral-300 hover:border-amber-400"
                      }`}
                    >
                      {isSelected ? "Đã chọn" : "Chọn"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">💻</span>
            Cách áp dụng phiên bản đã chọn
          </h2>

          <div className="space-y-6">
            {}
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="font-semibold text-amber-900">Phiên bản hiện tại:</span>
                <span className="font-bold text-amber-700">
                  {versions.find(v => v.id === selectedVersion)?.name}
                </span>
              </div>
            </div>

            {}
            <div className="space-y-4">
              <h3 className="font-bold text-neutral-900 text-lg">Bước 1: Import function</h3>
              <div className="bg-neutral-900 text-amber-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                {selectedVersion === "dark" ? (
                  <code>import &#123; showAddedToCartToast &#125; from &quot;@/components/toast/AddToCartToast&quot;;</code>
                ) : (
                  <code>import &#123; showAddedToCartToastGold &#125; from &quot;@/components/toast/AddToCartToastGold&quot;;</code>
                )}
              </div>

              <h3 className="font-bold text-neutral-900 text-lg">Bước 2: Sử dụng trong code</h3>
              <div className="bg-neutral-900 text-amber-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <code>
                  {selectedVersion === "dark" ? "showAddedToCartToast" : "showAddedToCartToastGold"}(&#123;<br />
                  &nbsp;&nbsp;name: &quot;Hạt điều rang muối (500g)&quot;,<br />
                  &nbsp;&nbsp;thumbnailUrl: product.thumbnailUrl,<br />
                  &nbsp;&nbsp;quantity: 1<br />
                  &#125;);
                </code>
              </div>

              <h3 className="font-bold text-neutral-900 text-lg">Bước 3: Thay thế trong ProductClientView.tsx</h3>
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg text-sm">
                <p className="text-neutral-700 mb-2">
                  Tìm dòng <code className="bg-neutral-200 px-2 py-1 rounded">showAddedToCartToast(&#123;...&#125;)</code> trong file:
                </p>
                <p className="text-neutral-600 font-mono text-xs">
                  src/components/products/ProductClientView.tsx (line ~107)
                </p>
                <p className="text-neutral-700 mt-2">
                  {selectedVersion === "dark" 
                    ? "Giữ nguyên import và function hiện tại" 
                    : "Thay thế bằng showAddedToCartToastGold"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-bold text-blue-900 mb-2">Tùy chỉnh màu sắc</h3>
            <p className="text-sm text-blue-800">
              Có thể điều chỉnh màu gradient trong file .tsx để phù hợp với brand identity
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-purple-900 mb-2">Performance</h3>
            <p className="text-sm text-purple-800">
              Toast sử dụng animation CSS tối ưu, không ảnh hưởng đến hiệu suất
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-bold text-green-900 mb-2">Responsive</h3>
            <p className="text-sm text-green-800">
              Tự động điều chỉnh kích thước trên mobile và desktop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
