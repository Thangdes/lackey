"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminDetailHeaderProps = {
  backHref: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function AdminDetailHeader({
  backHref,
  backLabel = "Quay lại",
  title,
  subtitle,
  badge,
  actions,
  className,
}: AdminDetailHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <Button variant="ghost" size="sm" asChild>
        <Link href={backHref}>
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      </Button>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
