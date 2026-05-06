"use client";
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AdminSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AdminSearchBar({ value, onChange, placeholder = "Tìm kiếm...", className }: AdminSearchBarProps) {
  return (
    <div className={cn("relative flex-1 max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9"
      />
    </div>
  );
}
