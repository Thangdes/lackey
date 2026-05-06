"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminInfoCardProps = {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminInfoCard({ icon: Icon, title, children, className }: AdminInfoCardProps) {
  return (
    <div className={cn("border rounded-lg p-4 space-y-3 bg-card", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
