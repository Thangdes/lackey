"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Upload, MessageCircle, Zap } from "lucide-react";

export default function CustomKeychainCTA() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  DỊCH VỤ ĐẶC BIỆT
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                BUILD<br />
                BÀN PHÍM<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">THEO Ý BẠN</span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Gửi cấu hình, sở thích âm thanh, hay thiết kế bạn mong muốn.
                Chúng tôi sẽ tư vấn build kit, lube switch chuyên nghiệp và đem đến
                cho bạn chiếc bàn phím hoàn hảo nhất!
              </p>

              <div className="space-y-4">
                {[
                  { icon: "🎨", text: "Thiết kế FREE theo yêu cầu" },
                  { icon: "⚡", text: "Giao hàng nhanh 3-5 ngày" },
                  { icon: "💎", text: "In offset sắc nét, bền màu" },
                  { icon: "🎁", text: "Từ 1 chiếc đã nhận đơn" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                      {feature.icon}
                    </div>
                    <span className="text-base font-medium text-gray-800">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/contact?type=custom"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5" />
                  <span>GỬI YÊU CẦU</span>
                </Link>

                <Link
                  href="/custom-keychain"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 font-semibold text-base transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span>XEM MẪU</span>
                  <Zap className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-2 shadow-xl border border-white/50">
                <div className="aspect-square relative rounded-2xl overflow-hidden bg-white shadow-inner">
                  <Image
                    src="https://s.alicdn.com/@sc04/kf/H6d86fa5d68dc4580ab29e41a00c5ec4as.jpg?avif=close&webp=close"
                    alt="Custom Keyboard Design"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full shadow-sm border border-white/20">
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Premium
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-6 inset-x-8 bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-800">
                      Tư vấn miễn phí 24/7
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                    FREE
                  </span>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute top-12 -left-6 bg-white text-gray-800 px-5 py-3 rounded-2xl shadow-xl border border-gray-100 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="text-sm font-bold">
                  Từ 1 chiếc 🎉
                </span>
              </div>

              <div className="absolute top-1/2 -right-6 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <span className="text-sm font-bold">
                  3-5 ngày ⚡
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Thiết kế custom" },
              { number: "1000+", label: "Khách hàng hài lòng" },
              { number: "24/7", label: "Hỗ trợ tư vấn" },
              { number: "FREE", label: "Thiết kế miễn phí" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors border border-gray-100/50"
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
