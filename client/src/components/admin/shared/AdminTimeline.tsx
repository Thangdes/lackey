"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Circle, CheckCircle2 } from "lucide-react";

export type AdminTimelineItem = {
  title: string;
  description?: string;
  timestamp: string;
  status?: "completed" | "current" | "pending";
  icon?: React.ReactNode;
};

export type AdminTimelineProps = {
  items: AdminTimelineItem[];
  className?: string;
};

export function AdminTimeline({ items, className }: AdminTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const status = item.status || "pending";

        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center border-2",
                  status === "completed" && "bg-emerald-100 border-emerald-500 text-emerald-700",
                  status === "current" && "bg-primary/10 border-primary text-primary",
                  status === "pending" && "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {item.icon ? (
                  item.icon
                ) : status === "completed" ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <Circle className="size-3" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[32px]",
                    status === "completed" ? "bg-emerald-200" : "bg-muted"
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className={cn("text-sm font-medium", status === "pending" && "text-muted-foreground")}>
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{item.timestamp}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
