"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AppToastOptions } from "@/type/toast";

function BaseToast({
  title,
  message,
  actionLabel,
  onAction,
  tone = "info",
}: { title?: string; message?: string; actionLabel?: string; onAction?: () => void; tone?: "success" | "error" | "info" }) {
  const toneClasses =
    tone === "success"
      ? "border-[#B5CCBC] bg-[#f0f5f2] shadow-[4px_4px_0px_0px_rgba(181,204,188,0.4)]"
      : tone === "error"
      ? "border-[#E3B1B4] bg-[#fdf5f5] shadow-[4px_4px_0px_0px_rgba(227,177,180,0.4)]"
      : "border-[#5A5E63] bg-[#fafafa] shadow-[4px_4px_0px_0px_rgba(90,94,99,0.2)]";
  const titleClasses =
    tone === "success"
      ? "text-[#2f4f4f]"
      : tone === "error"
      ? "text-[#5A5E63]"
      : "text-[#5A5E63]";
  const accentColor =
    tone === "success"
      ? "bg-[#B5CCBC]"
      : tone === "error"
      ? "bg-[#E3B1B4]"
      : "bg-[#5A5E63]";

  return (
    <div className={`flex w-[320px] sm:w-[360px] items-start gap-3 rounded-none border-3 ${toneClasses} p-4 transition-all duration-300 animate-in slide-in-from-bottom-5`}>
      <div className={`w-1 h-full ${accentColor} rounded-full shrink-0`} />
      <div className="min-w-0 flex-1">
        {title ? (
          <div className={`font-[family-name:var(--font-retro)] text-base font-bold ${titleClasses} truncate uppercase tracking-wide`}>
            {title}
          </div>
        ) : null}
        {message ? (
          <div className="mt-1.5 text-sm text-[#2f4f4f]/80 line-clamp-3 leading-relaxed">
            {message}
          </div>
        ) : null}
        {actionLabel ? (
          <div className="mt-3">
            <Button 
              size="sm" 
              variant={tone === "error" ? "destructive" : "secondary"} 
              className="h-8 px-4 rounded-none border-2 font-medium uppercase tracking-wide text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" 
              onClick={onAction}
            >
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
    duration: opts.duration ?? 3000,
    position: opts.position ?? "bottom-right",
  });
}

export function showErrorToast(opts: AppToastOptions) {
  toast.custom(() => <BaseToast tone="error" title={opts.title} message={opts.message} actionLabel={opts.actionLabel} onAction={opts.onAction} />, {
    duration: opts.duration ?? 4000,
    position: opts.position ?? "bottom-right",
  });
}

export function showInfoToast(opts: AppToastOptions) {
  toast.custom(() => <BaseToast tone="info" title={opts.title} message={opts.message} actionLabel={opts.actionLabel} onAction={opts.onAction} />, {
    duration: opts.duration ?? 3000,
    position: opts.position ?? "bottom-right",
  });
}
