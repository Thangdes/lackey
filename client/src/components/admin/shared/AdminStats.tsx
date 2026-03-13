"use client";
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminStatItem = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
};

export type AdminStatsProps = {
  stats: AdminStatItem[];
  className?: string;
};

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200",
};

export function AdminStats({ stats, className }: AdminStatsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClass = colorClasses[stat.color || "primary"];

        return (
          <div key={index} className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={cn(
                        "font-medium",
                        stat.trend.direction === "up" ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {stat.trend.direction === "up" ? "↑" : "↓"} {Math.abs(stat.trend.value)}%
                    </span>
                    <span className="text-muted-foreground">{stat.trend.label}</span>
                  </div>
                )}
              </div>
              {Icon && (
                <div className={cn("size-10 rounded-lg flex items-center justify-center", colorClass)}>
                  <Icon className="size-5" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
