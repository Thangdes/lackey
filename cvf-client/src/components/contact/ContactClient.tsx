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
      <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Liên hệ nhanh</h2>
        <ul className="space-y-2 text-neutral-800">
          <li className="flex items-center gap-2">
            <Phone className="size-4 text-neutral-600" aria-hidden />
            <span className="font-medium">Điện thoại</span>
            <a href={`tel:${siteConfig.contact.telephoneE164}`} className="ml-1 text-blue-600 hover:underline" aria-label={`Gọi ${siteConfig.contact.telephone}`}>
              {siteConfig.contact.telephone}
            </a>
            <button onClick={() => onCopy("phone")} className="ml-2 text-xs rounded border border-neutral-300 px-2 py-0.5 hover:bg-neutral-50" aria-label="Sao chép số điện thoại">
              {copied === "phone" ? "Đã sao chép" : "Sao chép"}
            </button>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="size-4 text-neutral-600" aria-hidden />
            <span className="font-medium">Email</span>
            <a href={`mailto:${siteConfig.contact.email}`} className="ml-1 text-blue-600 hover:underline" aria-label={`Gửi email tới ${siteConfig.contact.email}`}>
              {siteConfig.contact.email}
            </a>
            <button onClick={() => onCopy("email")} className="ml-2 text-xs rounded border border-neutral-300 px-2 py-0.5 hover:bg-neutral-50" aria-label="Sao chép email">
              {copied === "email" ? "Đã sao chép" : "Sao chép"}
            </button>
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-neutral-600" aria-hidden />
            <span className="font-medium">Địa chỉ</span>
            <span className="ml-1">{siteConfig.company.address}</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="size-4" aria-hidden />
            <span>Giờ làm việc: {siteConfig.openingHours.join("; ")}</span>
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F5555] px-4 py-2 text-sm text-white hover:bg-[#0F5555]/90 shadow-sm"
            aria-label="Chat qua Zalo"
          >
            <Image src="/logo/Zalo.png" alt="Zalo" width={16} height={16} />
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
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm hover:bg-white/90"
              >
                <Image src={src} alt={alt} width={16} height={16} />
                <span className="inline-flex items-center gap-1">
                  {host}
                  <ExternalLink className="size-3.5 text-neutral-500" aria-hidden />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-black/10 bg-white/70 backdrop-blur p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Gửi yêu cầu</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-neutral-700">Họ tên</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Nguyễn Văn A" className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-neutral-700">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm text-neutral-700">Số điện thoại</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="090x xxx xxx" className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="subject" className="text-sm text-neutral-700">Chủ đề</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Hỗ trợ đơn hàng #1234" className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
          <div className="md:col-span-2 flex flex-col gap-1">
            <label htmlFor="message" className="text-sm text-neutral-700">Nội dung</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} rows={5} required placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..." className="rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600/30" />
          </div>
          {/* Honeypot */}
          <input type="text" name="company" value={form.company} onChange={handleChange} className="hidden" autoComplete="off" tabIndex={-1} aria-hidden="true" />
          <div className="md:col-span-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-white hover:bg-black/90">
              Gửi email tới {siteConfig.contact.email}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
