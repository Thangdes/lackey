"use client";

import React from "react";
import { FiFilter } from "react-icons/fi";
import { Phone, Facebook, MessageCircle } from "lucide-react";

/**
 * Demo component to visualize mobile layout positioning
 * Shows how Filter button (left) and ChatWidget (right) are positioned to avoid conflicts
 */
export default function MobileLayoutDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">Mobile Layout - Position Fix</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-2 text-green-600">✅ Problem Solved:</h2>
            <p className="text-sm text-gray-700">
              Filter button và ChatWidget không còn đè lên nhau nữa!
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-3">New Layout Positioning:</h2>
            
            <div className="space-y-3 text-sm">
              {/* Filter Button */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-12 h-12 bg-[#AE1C2C] rounded-full flex items-center justify-center text-white shrink-0">
                  <FiFilter className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900">Filter Button</div>
                  <div className="text-xs text-blue-700 mt-1">
                    Position: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">bottom-6 left-4</span>
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Z-index: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">z-40</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    📍 Vị trí: <strong>Góc trái dưới</strong>
                  </div>
                </div>
              </div>

              {/* ChatWidget */}
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-green-900">ChatWidget</div>
                  <div className="text-xs text-green-700 mt-1">
                    Position: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">bottom-4 right-4</span>
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    Z-index: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">z-30</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    📍 Vị trí: <strong>Góc phải dưới</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Visual Comparison:</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Before */}
              <div className="border border-red-200 rounded-lg p-3 bg-red-50">
                <div className="font-semibold text-red-900 mb-2">❌ Before (Conflict)</div>
                <div className="text-red-700">
                  • Filter: bottom-20 <strong>right-4</strong><br />
                  • Chat: bottom-4 <strong>right-4</strong><br />
                  • Result: <strong>Đè lên nhau!</strong>
                </div>
              </div>

              {/* After */}
              <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                <div className="font-semibold text-green-900 mb-2">✅ After (Fixed)</div>
                <div className="text-green-700">
                  • Filter: bottom-6 <strong>left-4</strong><br />
                  • Chat: bottom-4 <strong>right-4</strong><br />
                  • Result: <strong>Tách biệt rõ ràng!</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Benefits:</h2>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Không còn conflict vị trí giữa Filter và ChatWidget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Filter button dễ dàng tiếp cận ở góc trái</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>ChatWidget vẫn ở vị trí quen thuộc bên phải</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Cả hai button đều có không gian riêng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Z-index được tối ưu (Filter: z-40, Chat: z-30)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mock Screen Demo */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Live Position Demo</h2>
          <div className="relative border-2 border-gray-300 rounded-lg h-96 bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Screen Content */}
            <div className="p-4 text-center text-gray-400">
              <p>Product Grid Area</p>
            </div>

            {/* Filter Button (Left) */}
            <div className="absolute bottom-6 left-4">
              <div className="relative">
                <div className="w-14 h-14 bg-[#AE1C2C] rounded-full shadow-lg flex items-center justify-center text-white animate-pulse">
                  <FiFilter className="w-6 h-6" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#AE1C2C] text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#AE1C2C]">
                  2
                </div>
                <div className="absolute left-0 -bottom-8 text-xs font-semibold text-blue-600 whitespace-nowrap">
                  Filter (Left)
                </div>
              </div>
            </div>

            {/* ChatWidget (Right) */}
            <div className="absolute bottom-4 right-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-lg flex items-center justify-center text-white animate-pulse">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  3
                </div>
                <div className="absolute right-0 -bottom-8 text-xs font-semibold text-green-600 whitespace-nowrap">
                  Chat (Right)
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Cả hai button đều hiển thị rõ ràng không đè lên nhau
          </p>
        </div>
      </div>
    </div>
  );
}
