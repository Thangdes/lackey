"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Palette, Zap, Lightbulb, RotateCcw, DollarSign, Sparkles } from "lucide-react";

export type FAQItem = {
  question: string;
  answer: string;
  icon?: React.ReactNode;
};

export type RetroFAQProps = {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
};

const defaultFAQs: FAQItem[] = [
  {
    question: "Bàn phím cơ và Keycap được làm từ chất liệu gì?",
    answer: "Keycap thường được làm từ nhựa PBT hoặc ABS siêu bền, keycap artisan làm từ resin/epoxy thủ công. Kit bàn phím làm từ nhôm CNC nguyên khối hoặc nhựa ABS/PC chắc chắn.",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    question: "Thời gian giao hàng mất bao lâu?",
    answer: "Đơn hàng có sẵn (switch, keycap bộ): 1-3 ngày toàn quốc. Dịch vụ build/mod phím: 3-5 ngày. Chúng tôi đóng gói chống sốc cẩn thận, đảm bảo an toàn tuyệt đối.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    question: "Làm sao để build bàn phím theo yêu cầu?",
    answer: "Rất đơn giản! Bạn chỉ cần: (1) Nhắn qua Zalo/Facebook, (2) Chia sẻ budget và sở thích (âm thanh, màu sắc), (3) Nhận tư vấn cấu hình, (4) Chốt đơn và nhận phím đã được mod hoàn chỉnh.",
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    question: "Chính sách đổi trả bảo hành như thế nào?",
    answer: "Bảo hành 1-12 tháng tùy linh kiện. Đổi trả trong 7 ngày nếu có lỗi từ NSX (chết led, hỏng mạch). Không áp dụng bảo hành nếu tự ý rã hàn hoặc đổ nước vào mạch.",
    icon: <RotateCcw className="w-5 h-5" />,
  },
  {
    question: "Giá một chiếc bàn phím/keycap bao nhiêu?",
    answer: "Switch lẻ chỉ từ 5.000đ/cái. Set keycap full từ 300.000đ. Phím custom hoàn thiện (Kit + Switch + Keycap) có giá từ 1 triệu đến vài triệu đồng tùy cấu hình.",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    question: "Làm thế nào để bảo quản bàn phím cơ?",
    answer: "Tránh để nước hay chất lỏng đổ vào phím. Thường xuyên vệ sinh bụi bằng chổi mềm. Không tự ý nhổ switch nếu phím không hỗ trợ hotswap để tránh hỏng mạch.",
    icon: <Sparkles className="w-5 h-5" />,
  },
];

const RetroFAQ: React.FC<RetroFAQProps> = ({
  title = "CÂU HỎI THƯỜNG GẶP",
  subtitle = "Giải đáp mọi thắc mắc về Bàn phím cơ & Dịch vụ của LắcKey",
  items = defaultFAQs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-white py-12 md:py-20 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              #000 0px,
              #000 1px,
              transparent 1px,
              transparent 15px
            ),
            repeating-linear-gradient(
              90deg,
              #000 0px,
              #000 1px,
              transparent 1px,
              transparent 15px
            )
          `,
        }} />
      </div>

      {/* Container */}
      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            {/* Icon Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fff100] border-4 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(34,144,144,1)] hover:rotate-12 transition-transform">
                <HelpCircle className="w-10 h-10 md:w-12 md:h-12 text-black" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-[family-name:var(--font-retro)] text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-black mb-4 tracking-wider">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 md:space-y-6">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div
                  key={index}
                  className="bg-white border-4 border-black transition-all duration-300"
                  style={{
                    boxShadow: isOpen 
                      ? "8px 8px 0px 0px rgba(34,144,144,1)" 
                      : "4px 4px 0px 0px rgba(0,0,0,1)",
                  }}
                >
                  {/* Question Button */}
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 md:p-8 flex items-center justify-between gap-4 text-left hover:bg-[#fff100] transition-colors group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Icon */}
                      {item.icon && (
                        <span className="text-3xl md:text-4xl flex-shrink-0">
                          {item.icon}
                        </span>
                      )}
                      
                      {/* Question Text */}
                      <span className="font-[family-name:var(--font-retro)] text-lg md:text-xl lg:text-2xl font-bold text-black uppercase tracking-wide">
                        {item.question}
                      </span>
                    </div>

                    {/* Chevron Icon */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-black border-4 border-black rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "rotate-180 bg-[#229090]" : "group-hover:bg-[#229090]"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-[#fff100]" />
                    </div>
                  </button>

                  {/* Answer Panel */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                      {/* Divider */}
                      <div className="h-1 w-full bg-black mb-6" />
                      
                      {/* Answer Text */}
                      <p className="text-base md:text-lg text-black/80 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decorative Bottom Line */}
          <div className="mt-12 flex justify-center">
            <div className="h-1 w-48 bg-black" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroFAQ;
