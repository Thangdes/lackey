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
    company: "", 
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
    if (form.company) return; 
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
      <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Liên hệ nhanh</h2>
        </div>
        <div className="space-y-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100/50">
            <div className="flex flex-wrap items-center gap-4">
              <Phone className="size-5 text-gray-400" aria-hidden />
              <span className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Điện thoại:</span>
              <a href={`tel:${siteConfig.contact.telephoneE164}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors" aria-label={`Gọi ${siteConfig.contact.telephone}`}>
                {siteConfig.contact.telephone}
              </a>
              <button onClick={() => onCopy("phone")} className="ml-auto px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm" aria-label="Sao chép số điện thoại">
                {copied === "phone" ? "✓ Đã chép" : "Sao chép"}
              </button>
            </div>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100/50">
            <div className="flex flex-wrap items-center gap-4">
              <Mail className="size-5 text-gray-400" aria-hidden />
              <span className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Email:</span>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors break-all" aria-label={`Gửi email tới ${siteConfig.contact.email}`}>
                {siteConfig.contact.email}
              </a>
              <button onClick={() => onCopy("email")} className="ml-auto px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm" aria-label="Sao chép email">
                {copied === "email" ? "✓ Đã chép" : "Sao chép"}
              </button>
            </div>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100/50">
            <div className="flex items-start gap-4">
              <MapPin className="size-5 text-gray-400 shrink-0 mt-1" aria-hidden />
              <div>
                <span className="font-semibold text-sm text-gray-600 uppercase tracking-wider block mb-1">Địa chỉ:</span>
                <span className="text-gray-900 font-medium text-base">{siteConfig.company.address}</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-4">
              <Clock className="size-5 text-blue-600" aria-hidden />
              <span className="font-semibold text-sm text-blue-800 uppercase tracking-wider">Giờ làm việc:</span>
              <span className="font-medium text-blue-900">{siteConfig.openingHours.join(", ")}</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="font-semibold text-sm text-gray-600 uppercase tracking-wider mb-4">Kênh liên hệ khác:</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors shadow-sm"
              aria-label="Chat qua Zalo"
            >
              <Image src="/logo/Zalo.png" alt="Zalo" width={20} height={20} className="rounded-md" />
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                >
                  <Image src={src} alt={alt} width={20} height={20} className="rounded-md object-contain" />
                  {host}
                  <ExternalLink className="size-4 opacity-50" aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Gửi yêu cầu trực tuyến</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-700">Họ tên <span className="text-red-500">*</span></label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="VD: Nguyễn Văn A" className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email <span className="text-red-500">*</span></label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="VD: you@example.com" className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-semibold text-gray-700">Số điện thoại</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="VD: 090x xxx xxx" className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Chủ đề</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="VD: Hỗ trợ đơn hàng #1234" className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-semibold text-gray-700">Nội dung <span className="text-red-500">*</span></label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={5} required placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..." className="border border-gray-300 rounded-xl bg-gray-50 px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none" />
          </div>
          {}
          <input type="text" name="company" value={form.company} onChange={handleChange} className="hidden" autoComplete="off" tabIndex={-1} aria-hidden="true" />
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <span>Gửi thông tin</span>
              <ExternalLink className="w-4 h-4 opacity-70" />
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
