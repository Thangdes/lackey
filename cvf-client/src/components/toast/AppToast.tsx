"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type AppToastOptions = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
};

function BaseToast({
  title,
  message,
  actionLabel,
  onAction,
  tone = "info",
}: { title?: string; message?: string; actionLabel?: string; onAction?: () => void; tone?: "success" | "error" | "info" }) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "error"
      ? "border-red-200 bg-red-50"
      : "border-neutral-200 bg-white";
  const titleClasses =
    tone === "success"
      ? "text-emerald-800"
      : tone === "error"
      ? "text-red-800"
      : "text-neutral-900";
  const msgClasses =
    tone === "success"
      ? "text-emerald-700"
      : tone === "error"
      ? "text-red-700"
      : "text-neutral-700";

  return (
    <div className={`flex w-[320px] sm:w-[360px] items-start gap-3 rounded-lg border ${toneClasses} p-3 shadow-lg`}>
      <div className="min-w-0 flex-1">
        {title ? <div className={`text-sm font-medium ${titleClasses} truncate`}>{title}</div> : null}
        {message ? <div className={`mt-0.5 text-[12px] ${msgClasses} line-clamp-3`}>{message}</div> : null}
        {actionLabel ? (
          <div className="mt-2">
            <Button size="sm" variant={tone === "error" ? "destructive" : "secondary"} className="h-8 px-3" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function showSuccessToast(opts: AppToastOptions) {
  toast.custom(() => <BaseToast tone="success" title={opts.title} message={opts.message} actionLabel={opts.actionLabel} onAction={opts.onAction} />, {
    duration: opts.duration ?? 2200,
    position: opts.position ?? "bottom-right",
  });
}

export function showErrorToast(opts: AppToastOptions) {
  toast.custom(() => <BaseToast tone="error" title={opts.title} message={opts.message} actionLabel={opts.actionLabel} onAction={opts.onAction} />, {
    duration: opts.duration ?? 3200,
    position: opts.position ?? "bottom-right",
  });
}

export function showInfoToast(opts: AppToastOptions) {
  toast.custom(() => <BaseToast tone="info" title={opts.title} message={opts.message} actionLabel={opts.actionLabel} onAction={opts.onAction} />, {
    duration: opts.duration ?? 2000,
    position: opts.position ?? "bottom-right",
  });
}
