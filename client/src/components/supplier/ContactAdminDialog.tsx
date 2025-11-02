"use client";
import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { Phone, Mail, Facebook } from "lucide-react";
import { siteConfig } from "@/constant/site";

type Props = {
  triggerLabel?: string;
  triggerClassName?: string;
};

export default function ContactAdminDialog({ triggerLabel = "Liên hệ quản trị viên", triggerClassName }: Props) {
  const SUPPORT_EMAIL = siteConfig.support.email;
  const SUPPORT_PHONE = siteConfig.support.phone;
  const FACEBOOK_URL = siteConfig.support.facebook;

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("Tôi muốn đăng ký quyền Nhà cung cấp.");
  const [email, setEmail] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("supplier:contact") || "null");
      if (saved) {
        setName(saved.name || "");
        setPhone(saved.phone || "");
        setMessage(saved.message || "Tôi muốn đăng ký quyền Nhà cung cấp.");
        setEmail(saved.email || "");
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem("supplier:contact", JSON.stringify({ name, phone, message, email }));
    } catch {}
  }, [name, phone, message, email]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName || "h-12 px-4 rounded-md border bg-emerald-600 text-white hover:bg-emerald-700 text-[15px] w-full shadow-sm"}>
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Image src="/logo/logo.jpg" alt="Logo" width={32} height={32} className="h-8 w-8 rounded-sm" />
            <DialogTitle>Liên hệ quản trị viên</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-neutral-600">Chọn cách liên hệ nhanh bên dưới:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="h-11 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">
              <Phone className="h-4 w-4" />
              <span className="text-[15px] font-medium">Gọi: {SUPPORT_PHONE}</span>
            </Link>
            <Link
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Yêu cầu cấp quyền Nhà cung cấp")}&body=${encodeURIComponent(`Xin chào quản trị viên,%0D%0A%0D%0ATôi muốn đăng ký quyền Nhà cung cấp trên hệ thống.%0D%0A%0D%0ATên: ${name || "(Chưa điền)"}%0D%0ASố điện thoại: ${phone || "(Chưa điền)"}%0D%0ANội dung: ${message}%0D%0A%0D%0AEmail của tôi: ${email || "(Chưa điền)"}`)}`}
              className="h-11 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => { setToast("Đã mở ứng dụng email, bạn có thể chỉnh sửa nội dung trước khi gửi."); setTimeout(()=>setToast(null), 3000); }}
            >
              <Mail className="h-4 w-4" />
              <span className="text-[15px] font-medium">Email: {SUPPORT_EMAIL}</span>
            </Link>
            <Link
              href={FACEBOOK_URL}
              className="h-11 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              target="_blank" rel="noopener noreferrer"
            >
              <Facebook className="h-4 w-4" />
              <span className="text-[15px] font-medium">Facebook</span>
            </Link>
            <Link
              href={`https://zalo.me/${SUPPORT_PHONE.replace(/\D/g, "")}`}
              className="h-11 inline-flex items-center justify-center gap-2 rounded-md bg-sky-500 text-white hover:bg-sky-600"
              target="_blank" rel="noopener noreferrer"
            >
              <span className="text-[15px] font-medium">Zalo</span>
            </Link>
          </div>

          <div className="text-xs text-neutral-500">Hoặc điền nhanh thông tin, sau đó bấm Email để mở ứng dụng email của bạn.</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="h-11 rounded-md border px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-none" placeholder="Họ và tên" value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="h-11 rounded-md border px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-none" placeholder="Số điện thoại" value={phone} onChange={(e)=>setPhone(e.target.value)} inputMode="tel" />
          </div>
          <input className="h-11 rounded-md border px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-none w-full" placeholder="Email liên hệ (tuỳ chọn)" value={email} onChange={(e)=>setEmail(e.target.value)} inputMode="email" />
          <textarea className="w-full min-h-[88px] rounded-md border px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-none" value={message} onChange={(e)=>setMessage(e.target.value)} />
          <div className="text-xs text-neutral-600">Chúng tôi sẽ phản hồi trong <span className="font-medium">24 giờ</span>.</div>
        </div>
        {toast && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 rounded-md bg-black text-white px-4 py-2 text-sm">
            {toast}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
