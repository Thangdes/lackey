"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth.service";
import type { User } from "@/type/user";
import SupplierSidebar from "@/components/supplier/SupplierSidebar";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const prof = (await authService.profile().catch(() => null)) as User | null;
        const role = (prof?.role ? String(prof.role) : "").toLowerCase();
        const roles = Array.isArray((prof as unknown as { roles?: unknown })?.roles)
          ? ((prof as unknown as { roles?: string[] }).roles || []).map((r) => String(r).toLowerCase())
          : [];
        const isSupplier = role === "supplier" || roles.includes("supplier") || role === "admin" || roles.includes("admin");
        setAllowed(isSupplier);
        if (!isSupplier) router.replace("/supplier/login?redirect=/supplier");
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
        <SupplierSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="text-sm font-medium inline-flex items-center gap-2 flex-1">
            Khu vực nhà cung cấp
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
