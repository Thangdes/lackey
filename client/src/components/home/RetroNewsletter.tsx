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
  subtitle = "Đăng ký ngay để nhận thông tin về đợt GB mới, khuyến mãi độc quyền và tips chơi phím cơ!",
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
    <section className="w-full bg-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-lg shadow-blue-100/50">
            
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-sm">
                  <Gift className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4 tracking-tight">
              {title}
            </h2>

            <p className="text-base md:text-lg text-gray-600 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { icon: "🎁", text: "Giảm giá độc quyền" },
                { icon: "⚡", text: "Sản phẩm mới nhất" },
                { icon: "💌", text: "Tips & Tricks" },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <div className="font-semibold text-sm md:text-base text-gray-800">
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
                    className="w-full h-14 px-6 border border-gray-300 rounded-xl text-base md:text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                    aria-invalid={!!error}
                    aria-describedby={error ? "newsletter-error" : undefined}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-14 px-8 bg-blue-600 text-white rounded-xl font-semibold text-base md:text-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-800 mb-1">Thành công!</div>
                    <div className="text-sm text-green-700">{message}</div>
                  </div>
                </div>
              )}

              {error && (
                <div id="newsletter-error" className="mt-6 p-4 bg-red-50 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-red-800 mb-1">Lỗi!</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-8 text-xs md:text-sm text-gray-500 text-center flex items-center justify-center gap-2">
              <span>🔒</span> Chúng tôi cam kết bảo mật thông tin của bạn. Không spam!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetroNewsletter;
