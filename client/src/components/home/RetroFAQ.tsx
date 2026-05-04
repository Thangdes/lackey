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
    question: "Móc khóa được làm từ chất liệu gì?",
    answer: "Móc khóa của chúng tôi được làm từ acrylic trong suốt cao cấp, dày 3-4mm. In offset với mực chất lượng cao, bền màu, không phai theo thời gian. An toàn, không độc hại.",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    question: "Thời gian giao hàng mất bao lâu?",
    answer: "Đơn hàng sẵn có: 1-3 ngày toàn quốc. Đơn custom design: 3-5 ngày (bao gồm thời gian thiết kế và sản xuất). Giao hàng nhanh, đóng gói cẩn thận, bảo hành trong quá trình vận chuyển.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    question: "Làm sao để custom móc khóa theo ý tưởng?",
    answer: "Rất đơn giản! Bạn chỉ cần: (1) Gửi hình ảnh/concept qua Zalo/Facebook, (2) Trao đổi với team design về kích thước, màu sắc, (3) Xác nhận thiết kế mẫu, (4) Thanh toán và nhận hàng. Thiết kế hoàn toàn MIỄN PHÍ!",
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    question: "Chính sách đổi trả như thế nào?",
    answer: "Đổi trả trong 7 ngày nếu sản phẩm bị lỗi từ nhà sản xuất (in lỗi, vỡ, phai màu). Hoàn tiền 100% hoặc đổi sản phẩm mới. Lưu ý: Không áp dụng với đơn custom đã được xác nhận thiết kế.",
    icon: <RotateCcw className="w-5 h-5" />,
  },
  {
    question: "Giá móc khóa bao nhiêu?",
    answer: "Móc khóa có sẵn: 35.000₫ - 75.000₫/chiếc. Custom design: 45.000₫ - 120.000₫/chiếc tùy kích thước và độ phức tạp. Giảm giá khi mua số lượng lớn (từ 10 chiếc trở lên).",
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    question: "Làm thế nào để bảo quản móc khóa?",
    answer: "Tránh tiếp xúc trực tiếp với nước trong thời gian dài, không để dưới ánh nắng mặt trời gắt. Lau nhẹ bằng khăn mềm khi bám bụi. Bảo quản ở nơi khô ráo, thoáng mát để móc khóa giữ được màu sắc lâu dài.",
    icon: <Sparkles className="w-5 h-5" />,
  },
];

const RetroFAQ: React.FC<RetroFAQProps> = ({
  title = "CÂU HỎI THƯỜNG GẶP",
  subtitle = "Giải đáp mọi thắc mắc của bạn về móc khóa LắcKey",
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
