"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/service/auth.service";
import { Mail, Lock, LogIn } from "lucide-react";

export default function SupplierLoginPrettyPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = useMemo(() => sp?.get("redirect") || "/supplier", [sp]);
  const already = useMemo(() => sp?.get("already") === "1", [sp]);
  const toAfterAlready = useMemo(() => sp?.get("to") || "/supplier", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const zaloSupportUrl = process.env.NEXT_PUBLIC_ZALO_SUPPORT_URL || "https://zalo.me/";

  useEffect(() => {
    if (!already) return;
    const t = setTimeout(() => {
      try { window.dispatchEvent(new CustomEvent("auth:login-success")); } catch {}
      router.replace(toAfterAlready);
    }, 1200);
    return () => clearTimeout(t);
  }, [already, router, toAfterAlready]);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.login({ email: email.trim(), password });
      try { window.dispatchEvent(new CustomEvent("auth:login-success")); } catch {}
      router.replace(redirectTo || "/supplier");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [email, password, redirectTo, router]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1683628005333-3d209d606b0b?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Nông nghiệp hiện đại"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h2 className="text-3xl font-bold drop-shadow">Khu vực Nhà cung cấp</h2>
          <p className="mt-2 max-w-xl text-white/90 drop-shadow">
            Quản lý sản phẩm, theo dõi đơn hàng và hiệu suất kinh doanh của bạn một cách trực quan.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-neutral-50 px-4 py-10">
        <div className="w-full max-w-[480px] rounded-2xl border bg-white p-8 relative">
          <div className="text-center mb-6">
            <Link
              href="/"
              className="font-gumicons font-bold text-3xl xl:text-4xl leading-none tracking-[-0.02em] select-none logo-strong"
              aria-label="LắcKey"
            >
              <span className="mr-1">HẠT TRƯỜNG</span>
              <span className="">XUÂN</span>
            </Link>
            <h1 className="mt-2 text-[22px] font-semibold">Đăng nhập Nhà cung cấp</h1>
            <p className="text-[15px] text-neutral-700 mt-1">Vui lòng nhập thông tin của bạn để tiếp tục.</p>
          </div>

          {already && (
            <div
              role="status"
              className="mb-4 rounded-md border border-blue-200 bg-blue-50 text-blue-900 px-3 py-2 text-sm"
            >
              Đã đăng nhập, chuyển về khu vực nhà cung cấp…
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-[15px] font-medium mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500" aria-hidden>
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  className="w-full h-12 pl-10 rounded-md border px-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-black/80 shadow-none"
                  placeholder="vidu@congty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  inputMode="email"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-[15px] font-medium mb-1">Mật khẩu</label>
                <button
                  type="button"
                  className="text-xs underline text-neutral-700 hover:text-black"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500" aria-hidden>
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  className="w-full h-12 pl-10 rounded-md border px-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-black/80 shadow-none"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="mt-2 text-xs text-neutral-600">Gợi ý: Mật khẩu gồm chữ và số, dễ nhớ với bạn.</div>
            </div>

            {error && (
              <div className="text-sm text-red-600" role="alert">{error}</div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-md bg-black text-white font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2"
              disabled={loading}
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-4">
            <a
              href={zaloSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-full inline-flex items-center justify-center rounded-md border bg-neutral-50 hover:bg-neutral-100 text-[15px]"
              role="button"
            >
              Cần hỗ trợ cấp quyền? Liên hệ quản trị viên
            </a>
          </div>

          <div className="mt-6 text-sm text-neutral-600">
            <p>
              Chưa có tài khoản? Liên hệ quản trị viên để được cấp quyền.
            </p>
            <p className="mt-2">
              <span className="text-neutral-500">Về trang chủ: </span>
              <Link href="/" className="underline">Trang chủ</Link>
            </p>
          </div>

          <div className="mt-2 text-xs text-neutral-600">Cần hỗ trợ? Hãy bấm nút trên để liên hệ. Chúng tôi sẽ phản hồi trong <span className="font-medium">24 giờ</span>.</div>
        </div>
      </div>
      
    </div>
  );
}
