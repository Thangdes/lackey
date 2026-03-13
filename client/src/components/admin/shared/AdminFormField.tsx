"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type AdminFormFieldProps = {
  label: string;
  name?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email" | "url" | "textarea" | "date" | "datetime-local";
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  maxLength?: number;
  className?: string;
};

export function AdminFormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  min,
  max,
  step,
  rows = 4,
  maxLength,
  className,
}: AdminFormFieldProps) {
  const id = name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(error && "border-destructive focus-visible:ring-destructive/20")}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          className={cn(error && "border-destructive focus-visible:ring-destructive/20")}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
