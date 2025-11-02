"use client";

import React, { useState } from "react";
import { Mail, Gift, Zap, CheckCircle2, AlertCircle } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RetroNewsletterProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  ctaLabel?: string;
  onSubscribe?: (email: string) => Promise<void> | void;
};

const RetroNewsletter: React.FC<RetroNewsletterProps> = ({
  title = "NHẬN ƯU ĐÃI ĐẶC BIỆT",
  subtitle = "Đăng ký ngay để nhận thông tin về sản phẩm mới, khuyến mãi độc quyền và tips chăm sóc móc khóa!",
  placeholder = "Email của bạn...",
  ctaLabel = "ĐĂNG KÝ NGAY",
  onSubscribe,
}) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!EMAIL_REGEX.test(email)) {
      setError("Email không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }

    try {
      setSubmitting(true);
      await onSubscribe?.(email);
      setMessage("Đăng ký thành công! Kiểm tra email để xác nhận.");
      setEmail("");
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative w-full bg-[#fff100] py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }} />
      </div>

      <div className="relative px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-white border-4 border-black p-8 md:p-12 lg:p-16 shadow-[12px_12px_0px_0px_rgba(34,144,144,1)]">
            
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fff100] border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Mail className="w-10 h-10 md:w-12 md:h-12 text-black" />
                </div>
                <div className="absolute -top-2 -right-2 bg-black text-[#fff100] px-2 py-1 border-2 border-[#fff100] rotate-12">
                  <Gift className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h2 className="font-[family-name:var(--font-retro)] text-3xl md:text-4xl lg:text-5xl font-bold uppercase text-black text-center mb-4 tracking-wider">
              {title}
            </h2>

            <p className="text-base md:text-lg text-black/80 text-center mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 md:mb-10">
              {[
                { icon: "🎁", text: "Giảm giá độc quyền" },
                { icon: "⚡", text: "Sản phẩm mới nhất" },
                { icon: "💌", text: "Tips & Tricks" },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#fff100] border-4 border-black p-4 text-center hover:-translate-y-1 transition-transform"
                  style={{
                    boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                  }}
                >
                  <div className="text-3xl mb-2">{benefit.icon}</div>
                  <div className="font-bold text-sm md:text-base text-black uppercase">
                    {benefit.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    disabled={submitting}
                    className="w-full h-14 md:h-16 px-6 border-4 border-black text-base md:text-lg text-black placeholder:text-black/40 font-semibold focus:outline-none focus:ring-4 focus:ring-[#229090] disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-invalid={!!error}
                    aria-describedby={error ? "newsletter-error" : undefined}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-14 md:h-16 px-8 md:px-10 bg-black text-[#fff100] hover:bg-[#229090] border-4 border-black font-[family-name:var(--font-retro)] text-base md:text-lg uppercase tracking-wider transition-all shadow-[6px_6px_0px_0px_rgba(34,144,144,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[6px_6px_0px_0px_rgba(34,144,144,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#fff100] border-t-transparent rounded-full animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>{ctaLabel}</span>
                    </>
                  )}
                </button>
              </div>

              {message && (
                <div className="mt-4 p-4 bg-green-100 border-4 border-green-600 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-green-800 mb-1">Thành công!</div>
                    <div className="text-sm text-green-700">{message}</div>
                  </div>
                </div>
              )}

              {error && (
                <div id="newsletter-error" className="mt-4 p-4 bg-red-100 border-4 border-red-600 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-red-800 mb-1">Lỗi!</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-6 text-xs md:text-sm text-black/60 text-center">
              🔒 Chúng tôi cam kết bảo mật thông tin của bạn. Không spam!
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 bg-black rotate-45" />
            <div className="w-2 h-2 bg-black rotate-45" />
            <div className="w-2 h-2 bg-black rotate-45" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroNewsletter;
