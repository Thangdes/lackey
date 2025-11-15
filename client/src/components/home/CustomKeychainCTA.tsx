"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Upload, MessageCircle, Zap } from "lucide-react";

export default function CustomKeychainCTA() {
  return (
    <section className="relative w-full bg-white py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              #000 0px,
              #000 2px,
              transparent 2px,
              transparent 10px
            )
          `,
        }} />
      </div>

      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            <div className="space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff100] border-4 border-black shadow-[4px_4px_0px_0px_rgba(34,144,144,1)]">
                <Sparkles className="w-5 h-5" />
                <span className="font-[family-name:var(--font-retro)] text-sm md:text-base font-bold uppercase">
                  ĐẶC BIỆT
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black leading-tight tracking-wider">
                CUSTOM<br />
                MÓC KHÓA<br />
                <span className="text-[#229090]">THEO Ý BẠN</span>
              </h2>

              <p className="text-lg md:text-xl text-black/80 leading-relaxed">
                Gửi hình ảnh, concept, nhân vật yêu thích của bạn. 
                Chúng tôi sẽ thiết kế và in móc khóa acrylic chất lượng cao, 
                hoàn toàn độc quyền cho riêng bạn!
              </p>

              <div className="space-y-3">
                {[
                  { icon: "🎨", text: "Thiết kế FREE theo yêu cầu" },
                  { icon: "⚡", text: "Giao hàng nhanh 3-5 ngày" },
                  { icon: "💎", text: "In offset sắc nét, bền màu" },
                  { icon: "🎁", text: "Từ 1 chiếc đã nhận đơn" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-base md:text-lg font-semibold text-black">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact?type=custom"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#fff100] text-black hover:bg-black hover:text-[#fff100] border-4 border-black font-[family-name:var(--font-retro)] text-lg md:text-xl uppercase tracking-wider transition-all shadow-[8px_8px_0px_0px_rgba(34,144,144,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>GỬI YÊU CẦU</span>
                </Link>

                <Link
                  href="/custom-keychain"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black hover:bg-black hover:text-white border-4 border-black font-bold text-lg uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5"
                >
                  <span>XEM MẪU</span>
                  <Zap className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-[#fff100] border-4 border-black p-4 md:p-6 shadow-[12px_12px_0px_0px_rgba(34,144,144,1)]">
                <div className="aspect-square relative bg-white border-4 border-black overflow-hidden">
                  <Image
                    src="https://s.alicdn.com/@sc04/kf/H6d86fa5d68dc4580ab29e41a00c5ec4as.jpg?avif=close&webp=close"
                    alt="Custom Keychain Design"
                    fill
                    className="object-cover"
                  />
                  
                  <div className="absolute top-4 right-4 bg-black text-[#fff100] px-4 py-2 border-4 border-[#fff100]">
                    <span className="font-[family-name:var(--font-retro)] text-sm md:text-base font-bold uppercase">
                      Custom
                    </span>
                  </div>
                </div>

                <div className="mt-4 bg-black text-white p-4 border-4 border-black">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-[#fff100]" />
                      <span className="font-bold text-sm md:text-base">
                        Tư vấn miễn phí 24/7
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-retro)] text-[#fff100] text-lg md:text-xl">
                      FREE
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 bg-black text-white px-4 py-2 border-4 border-white rotate-[-5deg] shadow-lg">
                <span className="font-[family-name:var(--font-retro)] text-sm font-bold uppercase">
                  Từ 1 chiếc
                </span>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-[#229090] text-white px-4 py-2 border-4 border-white rotate-[5deg] shadow-lg">
                <span className="font-[family-name:var(--font-retro)] text-sm font-bold uppercase">
                  3-5 ngày
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { number: "500+", label: "Thiết kế custom" },
              { number: "1000+", label: "Khách hàng hài lòng" },
              { number: "24/7", label: "Hỗ trợ tư vấn" },
              { number: "FREE", label: "Thiết kế miễn phí" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white border-4 border-black p-4 md:p-6 text-center hover:-translate-y-1 transition-transform"
                style={{
                  boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                }}
              >
                <div className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl font-bold text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-black/70 font-semibold uppercase">
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
