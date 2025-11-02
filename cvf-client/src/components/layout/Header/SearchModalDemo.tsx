"use client";

import React, { useState } from "react";
import SearchModal from "./SearchModal";
import { Search } from "lucide-react";

/**
 * Demo component for SearchModal responsive design
 * Shows the improvements made for mobile devices
 */
export default function SearchModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">SearchModal - Mobile Responsive</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="font-semibold mb-2 text-green-600">✅ Responsive Improvements:</h2>
            <p className="text-sm text-gray-700 mb-2">
              SearchModal đã được tối ưu hoá toàn diện cho mobile với z-index cao nhất.
            </p>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-3">Changes Made:</h2>
            
            <div className="space-y-3 text-sm">
              {/* Z-Index */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="font-semibold text-purple-900 mb-2">1. Z-Index (Highest)</div>
                <div className="text-xs text-purple-700 space-y-1">
                  <div>• Before: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded line-through">z-50</span></div>
                  <div>• After: <span className="font-mono bg-purple-100 px-2 py-0.5 rounded font-bold">z-[1000]</span> (Cao nhất!)</div>
                  <div className="mt-2 text-purple-600">
                    ✨ Modal luôn hiển thị trên tất cả các element khác
                  </div>
                </div>
              </div>

              {/* Input Field */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold text-blue-900 mb-2">2. Search Input Sizing</div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• Padding Mobile: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">px-3 py-2</span></div>
                  <div>• Padding Desktop: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">px-6 py-4</span></div>
                  <div>• Text Mobile: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">text-sm</span></div>
                  <div>• Text Desktop: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">text-lg</span></div>
                </div>
              </div>

              {/* Close Button */}
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-900 mb-2">3. Close Button (X)</div>
                <div className="text-xs text-green-700 space-y-1">
                  <div>• Mobile: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">p-2 + icon w-5 h-5</span></div>
                  <div>• Desktop: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">p-4 + icon w-6 h-6</span></div>
                </div>
              </div>

              {/* Product Thumbnails */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-semibold text-yellow-900 mb-2">4. Product Thumbnails</div>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>• Mobile: <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">w-12 h-12</span> (48px)</div>
                  <div>• Tablet: <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">w-16 h-16</span> (64px)</div>
                  <div>• Desktop: <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded">w-20 h-20</span> (80px)</div>
                </div>
              </div>

              {/* Content Sizing */}
              <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                <div className="font-semibold text-pink-900 mb-2">5. Content & Text Sizing</div>
                <div className="text-xs text-pink-700 space-y-1">
                  <div>• Headers: <span className="font-mono bg-pink-100 px-2 py-0.5 rounded">text-xs sm:text-sm</span></div>
                  <div>• Buttons: <span className="font-mono bg-pink-100 px-2 py-0.5 rounded">text-xs sm:text-sm</span></div>
                  <div>• Product Names: <span className="font-mono bg-pink-100 px-2 py-0.5 rounded">text-xs sm:text-sm</span></div>
                  <div>• Icons: <span className="font-mono bg-pink-100 px-2 py-0.5 rounded">w-3.5 h-3.5 sm:w-4 h-4</span></div>
                </div>
              </div>

              {/* Spacing */}
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="font-semibold text-orange-900 mb-2">6. Responsive Spacing</div>
                <div className="text-xs text-orange-700 space-y-1">
                  <div>• Container padding: <span className="font-mono bg-orange-100 px-2 py-0.5 rounded">px-4 sm:px-6 md:px-8</span></div>
                  <div>• Vertical spacing: <span className="font-mono bg-orange-100 px-2 py-0.5 rounded">py-3 sm:py-4 md:py-6</span></div>
                  <div>• Grid gaps: <span className="font-mono bg-orange-100 px-2 py-0.5 rounded">gap-2 sm:gap-3 md:gap-4</span></div>
                  <div>• Content gaps: <span className="font-mono bg-orange-100 px-2 py-0.5 rounded">gap-6 sm:gap-8 md:gap-12</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Responsive Breakpoints:</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <div className="font-semibold text-gray-900 mb-1">📱 Mobile</div>
                <div className="text-gray-600">
                  &lt; 640px<br/>
                  Compact sizing<br/>
                  Small thumbnails
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <div className="font-semibold text-gray-900 mb-1">📱 Tablet</div>
                <div className="text-gray-600">
                  640px - 768px<br/>
                  Medium sizing<br/>
                  Mid thumbnails
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                <div className="font-semibold text-gray-900 mb-1">💻 Desktop</div>
                <div className="text-gray-600">
                  ≥ 768px<br/>
                  Full sizing<br/>
                  Large thumbnails
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Z-Index Hierarchy:</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-purple-100 px-2 py-1 rounded font-bold">z-[1000]</span>
                <span className="font-semibold text-purple-600">SearchModal (CAO NHẤT)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">z-[80]</span>
                <span>Mobile Filter Sheet</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">z-[70]</span>
                <span>Filter Sheet Overlay</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">z-40</span>
                <span>Filter Button</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">z-30</span>
                <span>ChatWidget</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Benefits:</h2>
            <ul className="space-y-1.5 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Modal fullscreen với z-index cao nhất (z-[1000])</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Input field compact trên mobile (px-3 py-2)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Button đóng nhỏ gọn hơn (p-2 thay vì p-4)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Product thumbnails responsive (48px → 64px → 80px)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Text sizing phù hợp với màn hình (xs → sm → base)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Spacing tối ưu cho touch targets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>Footer hint responsive với ESC key</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Demo Button */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-4">Live Demo - Click to Test!</h2>
          <p className="text-sm text-gray-600 mb-4">
            Click button dưới để mở SearchModal và test responsive trên mobile
          </p>
          
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-4 rounded-lg hover:bg-black/90 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span className="font-semibold">Mở Search Modal</span>
          </button>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>💡 Testing Tips:</strong>
              <br/>• Click button để mở modal fullscreen
              <br/>• Resize window từ 320px → 1920px để xem responsive
              <br/>• Test input field, close button, và product cards
              <br/>• Verify z-index cao nhất (không bị che bởi element nào)
              <br/>• Press ESC để đóng modal
            </p>
          </div>
        </div>
      </div>

      {/* SearchModal Component */}
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
