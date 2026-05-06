"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AppToastOptions } from "@/type/toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

function BaseToast({
  title,
  message,
  actionLabel,
  onAction,
  tone = "info",
}: { title?: string; message?: string; actionLabel?: string; onAction?: () => void; tone?: "success" | "error" | "info" }) {
  
  const styles = {
    success: {
      wrapper: "border-[#B5CCBC] bg-white shadow-xl shadow-[#B5CCBC]/10",
      icon: <CheckCircle2 className="w-5 h-5 text-[#B5CCBC] mt-0.5" />,
      title: "text-[#2f4f4f]",
      accent: "bg-[#B5CCBC]",
    },
    error: {
      wrapper: "border-[#E3B1B4] bg-white shadow-xl shadow-[#E3B1B4]/10",
      icon: <AlertCircle className="w-5 h-5 text-[#E3B1B4] mt-0.5" />,
      title: "text-[#5A5E63]",
      accent: "bg-[#E3B1B4]",
    },
    info: {
      wrapper: "border-[#5A5E63] bg-white shadow-xl shadow-[#5A5E63]/10",
      icon: <Info className="w-5 h-5 text-[#5A5E63] mt-0.5" />,
      title: "text-[#5A5E63]",
      accent: "bg-[#5A5E63]",
    }
  };

  const currentStyle = styles[tone];

  return (
    <div className={`flex w-[320px] sm:w-[360px] items-start gap-3 rounded-xl border border-neutral-100 ${currentStyle.wrapper} p-4 transition-all duration-300 animate-in slide-in-from-bottom-5`}>
      <div className={`w-1.5 h-full min-h-[40px] ${currentStyle.accent} rounded-full shrink-0`} />
      
      <div className="shrink-0">
        {currentStyle.icon}
      </div>

      <div className="min-w-0 flex-1">
        {title ? (
          <div className={`text-sm font-bold ${currentStyle.title} truncate tracking-tight`}>
            {title}
          </div>
        ) : null}
        {message ? (
          <div className="mt-1 text-sm text-neutral-500 line-clamp-3 leading-relaxed">
            {message}
          </div>
        ) : null}
        {actionLabel ? (
          <div className="mt-3">
            <Button 
              size="sm" 
              variant={tone === "error" ? "destructive" : "secondary"} 
              className="h-8 px-4 rounded-lg font-medium text-xs transition-all" 
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
