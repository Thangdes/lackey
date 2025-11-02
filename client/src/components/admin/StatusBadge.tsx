"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

export type StatusBadgeProps = React.ComponentProps<typeof Badge> & {
  status?: StatusBadgeVariant;
};

const statusClasses: Record<StatusBadgeVariant, string> = {
  primary:
    "border-transparent bg-primary/90 text-primary-foreground",
  success:
    "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/30 dark:text-emerald-200",
  warning:
    "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200",
  danger:
    "border-red-200 bg-red-100 text-red-700 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200",
  info:
    "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-900/40 dark:bg-sky-900/30 dark:text-sky-200",
  neutral:
    "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-200",
};

export function StatusBadge({ status = "neutral", className, children, ...rest }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusClasses[status], className)} {...rest}>
      {children}
    </Badge>
  );
}

export function badgeForBoolean(v: boolean, opts?: { trueText?: string; falseText?: string }) {
  return (
    <StatusBadge status={v ? "success" : "neutral"}>
      {v ? opts?.trueText ?? "Kích hoạt" : opts?.falseText ?? "Tắt"}
    </StatusBadge>
  );
}
