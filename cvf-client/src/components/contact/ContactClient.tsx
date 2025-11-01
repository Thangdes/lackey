"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/constant/site";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";

export default function ContactClient() {
  const sameAs = siteConfig.sameAs || [];
  const zaloFromSameAs = sameAs.find((u) => /zalo\.me\//.test(u));
  const zaloFallback = `https://zalo.me/${siteConfig.contact.telephoneE164?.replace(/^\+/, "") || ""}`;
  const zaloLink = zaloFromSameAs || zaloFallback;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    company: "", // honeypot
  });
  const [copied, setCopied] = useState<"phone" | "email" | null>(null);

  const onCopy = useCallback((type: "phone" | "email") => {
    const text = type === "phone" ? siteConfig.contact.telephone : siteConfig.contact.email;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.company) return; // honeypot
    const to = siteConfig.contact.email;
    const subject = encodeURIComponent(form.subject || `Liên hệ từ ${form.name || "Khách hàng"}`);
    const bodyLines = [
      `Họ tên: ${form.name}`,
      `Email: ${form.email}`,
      `Điện thoại: ${form.phone}`,
      "",
      form.message,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    const href = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = href;
  };

  const iconForUrl = (url: string): { src: string; alt: string } => {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("zalo.me")) return { src: "/logo/Zalo.png", alt: "Zalo" };
    if (host.includes("facebook.com") || host.includes("fb.com")) return { src: "/logo/facebook.svg", alt: "Facebook" };
    return { src: "/globe.svg", alt: host };
  };

  return (
    <>
      <section className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-black">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#fff100]" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Liên hệ nhanh</h2>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
            <div className="flex flex-wrap items-center gap-3">
              <Phone className="size-5 text-black" aria-hidden />
              <span className="font-bold uppercase text-xs tracking-wide">Điện thoại:</span>
              <a href={`tel:${siteConfig.contact.telephoneE164}`} className="text-lg font-bold text-black hover:text-[var(--brand-secondary)] transition-colors" aria-label={`Gọi ${siteConfig.contact.telephone}`}>
                {siteConfig.contact.telephone}
              </a>
              <button onClick={() => onCopy("phone")} className="ml-auto px-3 py-1 bg-black text-white border-2 border-black text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors" aria-label="Sao chép số điện thoại">
                {copied === "phone" ? "✓ Sao chép" : "Sao chép"}
              </button>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
            <div className="flex flex-wrap items-center gap-3">
              <Mail className="size-5 text-black" aria-hidden />
              <span className="font-bold uppercase text-xs tracking-wide">Email:</span>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-lg font-bold text-black hover:text-[var(--brand-secondary)] transition-colors break-all" aria-label={`Gửi email tới ${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              <button onClick={() => onCopy("email")} className="ml-auto px-3 py-1 bg-black text-white border-2 border-black text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors" aria-label="Sao chép email">
                {copied === "email" ? "✓ Sao chép" : "Sao chép"}
              </button>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 border-2 border-neutral-300">
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-black shrink-0 mt-0.5" aria-hidden />
              <div>
                <span className="font-bold uppercase text-xs tracking-wide block mb-1">Địa chỉ:</span>
                <span className="text-neutral-800 font-medium">{siteConfig.company.address}</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-[#fff100] border-2 border-black">
            <div className="flex items-center gap-3">
              <Clock className="size-5 text-black" aria-hidden />
              <span className="font-bold uppercase text-xs tracking-wide">Giờ làm việc:</span>
              <span className="font-medium text-black">{siteConfig.openingHours.join(", ")}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t-4 border-black">
          <p className="font-bold uppercase text-xs tracking-wide mb-3">Kênh liên hệ:</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5555] text-white border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-white hover:text-[#0F5555] transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
              aria-label="Chat qua Zalo"
            >
              <Image src="/logo/Zalo.png" alt="Zalo" width={18} height={18} />
              Zalo
            </a>
            {sameAs.filter((u) => !/zalo\.me\//.test(u)).map((url) => {
              const { src, alt } = iconForUrl(url);
              const host = new URL(url).hostname.replace("www.", "");
              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                >
                  <Image src={src} alt={alt} width={18} height={18} />
                  {host}
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_#B5CCBC]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-4 border-black">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#fff100]" />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-wide">Gửi yêu cầu</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide">Họ tên *</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Nguyễn Văn A" className="border-2 border-black bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-secondary)] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">Email *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="border-2 border-black bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-secondary)] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wide">Số điện thoại</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="090x xxx xxx" className="border-2 border-black bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-secondary)] font-medium" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wide">Chủ đề</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Hỗ trợ đơn hàng #1234" className="border-2 border-black bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-secondary)] font-medium" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wide">Nội dung *</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={6} required placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..." className="border-2 border-black bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand-secondary)] font-medium resize-none" />
          </div>
          {/* Honeypot */}
          <input type="text" name="company" value={form.company} onChange={handleChange} className="hidden" autoComplete="off" tabIndex={-1} aria-hidden="true" />
          <div className="md:col-span-2">
            <button type="submit" className="px-8 py-3 bg-black text-white border-2 border-black font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_#B5CCBC] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
              → Gửi email tới {siteConfig.contact.email}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
