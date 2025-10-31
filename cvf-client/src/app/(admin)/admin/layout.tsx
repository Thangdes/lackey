"use client";
import React, { Suspense, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth.service";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/type/user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const prof = await authService.profile().catch(() => null) as User | null;
        const role = (prof?.role ? String(prof.role) : '').toLowerCase();
        const roles = Array.isArray((prof as unknown as { roles?: unknown })?.roles)
          ? ((prof as unknown as { roles?: string[] }).roles || []).map((r) => String(r).toLowerCase())
          : [];
        const email = typeof prof?.email === 'string' ? prof.email : '';
        const isAdmin = role === 'admin' || roles.includes('admin') || email.toLowerCase().startsWith('admin@');
        setAllowed(isAdmin);
        if (!isAdmin) router.replace("/");
      } finally {
        setChecking(false);
      }
    };
    run();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <SidebarProvider>
      <Sidebar>
        <AdminSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="text-sm font-medium inline-flex items-center gap-2">
            Khu vực quản trị
          </div>
        </header>
        <div className="p-6">
          <Suspense fallback={<div className="text-sm text-muted-foreground p-2">Đang tải…</div>}>
            {children}
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
