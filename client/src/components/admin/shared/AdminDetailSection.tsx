"use client";
import React from "react";
import { cn } from "@/lib/utils";

export type AdminDetailSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function AdminDetailSection({ title, description, children, actions, className }: AdminDetailSectionProps) {
  return (
    <div className={cn("border rounded-lg bg-card", className)}>
      <div className="flex items-start justify-between gap-4 p-4 border-b">
        <div className="space-y-1">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
