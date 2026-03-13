"use client";
import React from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AdminDetailFieldProps = {
  label: string;
  value: React.ReactNode;
  copyable?: boolean;
  copyValue?: string;
  className?: string;
  vertical?: boolean;
};

export function AdminDetailField({ label, value, copyable, copyValue, className, vertical }: AdminDetailFieldProps) {
  const handleCopy = async () => {
    try {
      const textToCopy = copyValue || (typeof value === "string" ? value : "");
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`Đã copy ${label}`);
    } catch {
      toast.error("Không thể copy");
    }
  };

  if (vertical) {
    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className="flex items-start gap-2">
          <div className="text-sm flex-1">{value || "—"}</div>
          {copyable && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
              <Copy className="size-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start justify-between gap-4 py-2", className)}>
      <div className="text-sm font-medium text-muted-foreground min-w-[120px]">{label}</div>
      <div className="flex items-start gap-2 flex-1">
        <div className="text-sm text-right flex-1">{value || "—"}</div>
        {copyable && (
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
            <Copy className="size-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
