"use client";

import React, { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  ctaLabel?: string;
  onSubscribe?: (email: string) => Promise<void> | void;
};

const Newsletter: React.FC<NewsletterProps> = ({
  title = "Nhận ưu đãi và công thức mới mỗi tuần",
  subtitle = "Đăng ký để không bỏ lỡ các khuyến mãi và bài viết hữu ích về nấu ăn.",
  placeholder = "Nhập email của bạn",
  ctaLabel = "Đăng ký",
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
      setError("Email không hợp lệ");
      return;
    }
    try {
      setSubmitting(true);
      await onSubscribe?.(email);
      setMessage("Đăng ký thành công! Hãy kiểm tra hộp thư của bạn.");
      setEmail("");
    } catch  {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-label="Newsletter" className="py-0">
      <div
        className="border-y"
        style={{
          background:
            "linear-gradient(90deg, var(--color-plantation-950), var(--color-plantation-800), var(--color-plantation-950))",
          borderColor: "var(--color-cod-gray-900)",
        }}
      >
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-white"
              style={{
                fontSize: "var(--font-size-h6, 1.125rem)",
                fontWeight: "var(--font-weight-semibold, 600)",
                letterSpacing: "var(--tracking-tight, -0.01em)",
              }}
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-sm md:text-base text-white/85">{subtitle}</p>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-4 md:mt-6 flex flex-col sm:flex-row items-stretch gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 md:h-11 md:py-0 py-3 rounded-lg border-2 border-white/80 bg-white/90 px-4 text-sm text-[var(--color-cod-gray-900)] placeholder:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg border border-white/60 bg-white/10 px-4 h-11 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-60"
              >
                {submitting ? "Đang gửi..." : ctaLabel}
              </button>
            </form>

            {message ? (
              <div role="status" className="mt-2 text-sm font-medium text-white">{message}</div>
            ) : null}
            {error ? (
              <div id="newsletter-error" role="alert" className="mt-2 text-sm font-medium text-red-200">{error}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
