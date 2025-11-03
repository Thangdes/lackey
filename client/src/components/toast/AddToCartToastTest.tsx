"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { showAddedToCartToast } from "./AddToCartToast";
import { Package } from "lucide-react";

export default function AddToCartToastTest() {
  const testCases = [
    {
      name: "Hạt điều rang muối (500g)",
      thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      quantity: 1,
      label: "Với ảnh sản phẩm"
    },
    {
      name: "Mật ong rừng nguyên chất cao cấp",
      thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      quantity: 3,
      label: "Số lượng nhiều"
    },
    {
      name: "Hạt macca Úc rang bơ",
      thumbnailUrl: null,
      quantity: 1,
      label: "Không có ảnh"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-none border-3 border-black bg-[#fff100] mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <Package className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-[family-name:var(--font-retro)] text-5xl font-bold text-black mb-3 uppercase tracking-wider">
            ADD TO CART TOAST
          </h1>
          <p className="text-lg text-neutral-700 font-medium">
            Retro + Minimalist Design - Brutalist Style
          </p>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden mb-8">
          <div className="bg-[#2d2d2d] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-[#fff100] uppercase tracking-wider">
              ✨ Design Features
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">No Yellow Text</div>
                    <div className="text-sm text-neutral-600">Black text only, no yellow/amber</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Brutalist Borders</div>
                    <div className="text-sm text-neutral-600">Border-3 border-black everywhere</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Beige Background</div>
                    <div className="text-sm text-neutral-600">Warm #f5f1e8 retro color</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Hard Shadow</div>
                    <div className="text-sm text-neutral-600">6px offset, no blur</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Sharp Corners</div>
                    <div className="text-sm text-neutral-600">Rounded-none for brutalist feel</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-black rounded-none mt-2" />
                  <div>
                    <div className="font-bold text-black">Yellow Header</div>
                    <div className="text-sm text-neutral-600">Bright #fff100 accent only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="bg-[#fff100] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-black uppercase tracking-wider">
              🎬 Test Scenarios
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="space-y-3">
                  <div className="p-4 bg-neutral-50 rounded-none border-2 border-black">
                    <div className="text-sm font-bold text-black mb-1 uppercase">
                      {testCase.label}
                    </div>
                    <div className="text-xs text-neutral-600 line-clamp-2">
                      {testCase.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-2 font-bold">
                      Qty: {testCase.quantity}
                    </div>
                  </div>
                  <Button
                    onClick={() => showAddedToCartToast(testCase)}
                    className="w-full rounded-none border-3 border-black bg-[#2d2d2d] text-white font-bold uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                  >
                    SHOW TOAST {index + 1}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#fff100] border-3 border-black rounded-none">
              <h3 className="font-bold text-black mb-2 uppercase tracking-wider">📋 Testing Instructions:</h3>
              <ol className="text-sm text-black space-y-1 list-decimal list-inside font-medium">
                <li>Click any &quot;SHOW TOAST&quot; button above</li>
                <li>Toast appears at bottom-right with retro style</li>
                <li>Notice NO yellow/amber text (black text only)</li>
                <li>Check brutalist borders and hard shadows</li>
                <li>Hover buttons to see 3D effect</li>
                <li>Click X or &quot;TIẾP TỤC&quot; to close</li>
                <li>Click &quot;XEM GIỎ&quot; to navigate to cart</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#fff100] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Retro Style</h3>
            <p className="text-xs text-black/80">
              Yellow header, beige body, black text
            </p>
          </div>
          <div className="bg-white rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Minimalist</h3>
            <p className="text-xs text-neutral-600">
              Clean, essential elements, no clutter
            </p>
          </div>
          <div className="bg-[#2d2d2d] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">🔲</div>
            <h3 className="font-bold text-white mb-2 uppercase text-sm">Brutalist</h3>
            <p className="text-xs text-white/80">
              Sharp edges, thick borders, hard shadows
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
