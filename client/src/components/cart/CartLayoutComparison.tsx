"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";




export default function CartLayoutComparison() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/30 to-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">
              ❌
            </div>
            <ArrowRight className="w-8 h-8 text-gray-400" />
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
              ✓
            </div>
          </div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-3">
            So sánh Layout Giỏ Hàng
          </h1>
          <p className="text-lg text-neutral-600">
            Layout cũ vs Layout mới theo hàng ngang
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {}
          <div className="space-y-4">
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
              <h2 className="text-2xl font-bold text-red-800 mb-2 flex items-center gap-2">
                <span className="text-3xl">❌</span>
                Layout Cũ
              </h2>
              <p className="text-sm text-red-700">Grid layout với 3 cột riêng biệt</p>
            </div>

            <div className="bg-white border-2 border-red-300 rounded-xl overflow-hidden">
              <div className="p-6">
                {}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 pb-4 border-b">
                    {}
                    <div className="col-span-6 flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded" />
                      <div>
                        <div className="font-medium text-sm mb-1">Hạt điều rang muối</div>
                        <div className="text-xs text-gray-600">(500g)</div>
                        <div className="text-sm font-semibold mt-1">120,000₫</div>
                      </div>
                    </div>
                    {}
                    <div className="col-span-3 flex items-center justify-center">
                      <div className="flex items-center border rounded">
                        <button className="w-8 h-8 border-r">−</button>
                        <span className="w-12 text-center">2</span>
                        <button className="w-8 h-8 border-l">+</button>
                      </div>
                    </div>
                    {}
                    <div className="col-span-3 flex items-center justify-end">
                      <div className="font-bold">240,000₫</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-bold text-red-900 mb-3">⚠️ Vấn đề:</h3>
              <div className="space-y-2 text-sm text-red-800">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Thông tin phân tán, khó theo dõi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Số lượng ở giữa, không trực quan</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Tốn không gian theo chiều dọc</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Responsive phức tạp trên mobile</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
              <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
                <span className="text-3xl">✓</span>
                Layout Mới (Đã Áp Dụng)
              </h2>
              <p className="text-sm text-green-700">Horizontal layout - tất cả trên 1 hàng</p>
            </div>

            <div className="bg-white border-2 border-green-300 rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                {}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    {}
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shrink-0 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    {}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base mb-1">Hạt điều rang muối</div>
                      <div className="text-sm text-gray-600 mb-1">(500g)</div>
                      <div className="text-base font-bold text-gray-900">120,000₫</div>
                    </div>
                    {}
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 font-bold text-lg">−</button>
                      <span className="w-12 text-center font-bold border-x-2 border-gray-300">2</span>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-amber-50 font-bold text-lg">+</button>
                    </div>
                    {}
                    <div className="shrink-0 min-w-[100px] text-right">
                      <div className="text-lg font-bold text-gray-900">240,000₫</div>
                      <button className="text-xs text-gray-500 hover:text-red-600 mt-1">Xóa</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-green-900 mb-3">✨ Cải thiện:</h3>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Thông tin nằm trên 1 hàng, dễ đọc</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Nút +/- nổi bật, dễ thao tác</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Tiết kiệm không gian chiều dọc</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Responsive tự nhiên trên mobile</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <span>Nút tăng (+) luôn ở cuối bên phải</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">🎯 Luồng Thông Tin Mới</h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
              <div className="text-4xl mb-2 text-center">📷</div>
              <div className="font-bold text-center">1. Ảnh</div>
              <div className="text-xs opacity-80 text-center">Nhận diện nhanh</div>
            </div>
            <ArrowRight className="w-8 h-8" />
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
              <div className="text-4xl mb-2 text-center">📝</div>
              <div className="font-bold text-center">2. Thông tin</div>
              <div className="text-xs opacity-80 text-center">Tên, giá sản phẩm</div>
            </div>
            <ArrowRight className="w-8 h-8" />
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
              <div className="text-4xl mb-2 text-center">⚖️</div>
              <div className="font-bold text-center">3. Số lượng</div>
              <div className="text-xs opacity-80 text-center">Tăng/Giảm dễ dàng</div>
            </div>
            <ArrowRight className="w-8 h-8" />
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/30">
              <div className="text-4xl mb-2 text-center">💰</div>
              <div className="font-bold text-center">4. Tổng</div>
              <div className="text-xs opacity-80 text-center">Kết quả cuối cùng</div>
            </div>
          </div>
          <p className="text-center mt-6 text-white/90">
            Mắt di chuyển từ trái sang phải một cách tự nhiên, phù hợp với thói quen đọc
          </p>
        </div>

        {}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Visual Hierarchy</h3>
            <p className="text-sm text-neutral-600">
              Thông tin quan trọng nhất (ảnh, tên) ở bên trái, hành động (tăng/giảm) ở bên phải
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Action-Oriented</h3>
            <p className="text-sm text-neutral-600">
              Nút +/- được thiết kế nổi bật với border và shadow, dễ nhấn, phản hồi nhanh
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-neutral-200">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Mobile-First</h3>
            <p className="text-sm text-neutral-600">
              Layout tự động điều chỉnh, ẩn thông tin phụ trên mobile, chỉ giữ phần quan trọng
            </p>
          </div>
        </div>

        {}
        <div className="mt-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            🎉 Layout mới đã được áp dụng!
          </h2>
          <p className="text-neutral-800 mb-6">
            Truy cập trang giỏ hàng hoặc test page để xem layout mới trong thực tế
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/cart"
              className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Xem Giỏ Hàng Thật
            </a>
            <a
              href="/test/cart-layout"
              className="px-8 py-3 bg-white hover:bg-neutral-50 text-neutral-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-neutral-900"
            >
              Xem Test Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
