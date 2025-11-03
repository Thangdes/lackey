"use client";

import React, { useState } from "react";
import { CartItemRow } from "./CartItemRow";
import { SmartCartItem } from "@/type/cart";
import { formatVND } from "@/utils/format";
import { ShoppingBag } from "lucide-react";

export default function MiniCartLayoutTest() {
  const [items] = useState<SmartCartItem[]>([
    {
      itemId: "1",
      sku: "HDR-500",
      productId: "prod-1",
      productName: "Hạt điều rang muối",
      productSlug: "hat-dieu-rang-muoi",
      variantId: "var-1",
      variantName: "500g",
      quantity: 2,
      price: 120000,
      compareAt: 150000,
      lineTotal: 240000,
      thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      canIncrease: true,
      canDecrease: true,
    },
    {
      itemId: "2",
      sku: "MOR-1000",
      productId: "prod-2",
      productName: "Mật ong rừng nguyên chất cao cấp",
      productSlug: "mat-ong-rung",
      variantId: "var-2",
      variantName: "1kg",
      quantity: 1,
      price: 280000,
      lineTotal: 280000,
      thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      canIncrease: true,
      canDecrease: true,
    },
    {
      itemId: "3",
      sku: "MAC-250",
      productId: "prod-3",
      productName: "Hạt macca Úc rang bơ",
      productSlug: "hat-macca-uc",
      variantId: "var-3",
      variantName: "250g",
      quantity: 3,
      price: 180000,
      lineTotal: 540000,
      thumbnailUrl: "https://res.cloudinary.com/dbonwxmgl/image/upload/v1759287451/yaq8lcv2ukostr99ofoq.jpg",
      canIncrease: true,
      canDecrease: true,
    },
  ]);

  const handleChangeQty = (sku: string, newQty: number) => {
    console.log(`Change qty: ${sku} -> ${newQty}`);
  };

  const handleRemove = (sku: string) => {
    console.log(`Remove: ${sku}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-none border-3 border-black bg-[#fff100] mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <ShoppingBag className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="font-[family-name:var(--font-retro)] text-5xl font-bold text-black mb-3 uppercase tracking-wider">
            MINI CART LAYOUT
          </h1>
          <p className="text-lg text-neutral-700 font-medium">
            Horizontal Layout: Image | Info | Quantity Controls
          </p>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden mb-8">
          <div className="bg-[#2d2d2d] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-[#fff100] uppercase tracking-wider">
              ✨ New Layout Features
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black rounded-none mt-2" />
                <div>
                  <div className="font-bold text-black">Horizontal Layout</div>
                  <div className="text-sm text-neutral-600">Image | Product Info | Quantity Buttons</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black rounded-none mt-2" />
                <div>
                  <div className="font-bold text-black">Compact Design</div>
                  <div className="text-sm text-neutral-600">All elements on one line, space-efficient</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black rounded-none mt-2" />
                <div>
                  <div className="font-bold text-black">Clear Buttons</div>
                  <div className="text-sm text-neutral-600">Quantity controls on the right, easy to access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="bg-[#fff100] border-b-3 border-black px-6 py-4">
            <h2 className="font-[family-name:var(--font-retro)] text-xl font-bold text-black uppercase tracking-wider flex items-center justify-between">
              🛒 Mini Cart Preview
              <span className="text-sm font-normal">{items.length} items</span>
            </h2>
          </div>
          
          <div className="p-4">
            {items.map((item) => (
              <CartItemRow
                key={item.sku}
                item={item}
                highlight={false}
                maxStock={10}
                onChangeQty={handleChangeQty}
                onRemove={handleRemove}
                formatVND={formatVND}
                mode="mini"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#fff100] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">📐</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Horizontal</h3>
            <p className="text-xs text-black/80">
              All elements in one row
            </p>
          </div>
          <div className="bg-white rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">📏</div>
            <h3 className="font-bold text-black mb-2 uppercase text-sm">Compact</h3>
            <p className="text-xs text-neutral-600">
              Space-efficient design
            </p>
          </div>
          <div className="bg-[#2d2d2d] rounded-none border-3 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
            <div className="text-3xl mb-2">👆</div>
            <h3 className="font-bold text-white mb-2 uppercase text-sm">Easy Access</h3>
            <p className="text-xs text-white/80">
              Buttons always visible
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-none border-3 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          <h3 className="font-bold text-black mb-4 uppercase tracking-wider">📋 Layout Structure:</h3>
          <div className="bg-neutral-50 rounded-none border-2 border-black p-4 font-mono text-sm">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="px-3 py-2 bg-purple-100 border border-black rounded-none">
                📷 Image
              </div>
              <div className="text-xl">→</div>
              <div className="px-3 py-2 bg-green-100 border border-black rounded-none flex-1 min-w-[120px]">
                📝 Name + Price
              </div>
              <div className="text-xl">→</div>
              <div className="px-3 py-2 bg-amber-100 border border-black rounded-none">
                [−] 2 [+]
              </div>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mt-3">
            All elements aligned horizontally for easy scanning and interaction
          </p>
        </div>
      </div>
    </div>
  );
}
