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
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-sm">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {}
          <div className="space-y-4">
            {items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen ? "border-blue-200 bg-blue-50/30 shadow-md" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {item.icon && (
                        <span className={`flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-blue-600" : "text-gray-400"}`}>
                          {item.icon}
                        </span>
                      )}
                      <span className={`text-base md:text-lg font-semibold transition-colors duration-300 ${isOpen ? "text-blue-900" : "text-gray-900"}`}>
                        {item.question}
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isOpen ? "bg-blue-100 text-blue-600 rotate-180" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 pt-0">
                        <p className="text-gray-600 leading-relaxed md:ml-9">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroFAQ;
