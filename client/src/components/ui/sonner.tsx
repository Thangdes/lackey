"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group-[.toaster]:rounded-none group-[.toaster]:border-3 group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(90,94,99,0.3)] group-[.toaster]:font-medium",
          title: "group-[.toast]:font-[family-name:var(--font-retro)] group-[.toast]:text-base group-[.toast]:font-bold group-[.toast]:uppercase group-[.toast]:tracking-wide group-[.toast]:text-[#2f4f4f]",
          description: "group-[.toast]:text-sm group-[.toast]:text-[#2f4f4f]/80 group-[.toast]:mt-1 group-[.toast]:leading-relaxed",
          actionButton: "group-[.toast]:rounded-none group-[.toast]:border-2 group-[.toast]:border-[#5A5E63] group-[.toast]:bg-[#5A5E63] group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:uppercase group-[.toast]:tracking-wide group-[.toast]:text-xs group-[.toast]:px-4 group-[.toast]:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:group-[.toast]:shadow-none hover:group-[.toast]:translate-x-[2px] hover:group-[.toast]:translate-y-[2px] group-[.toast]:transition-all",
          cancelButton: "group-[.toast]:rounded-none group-[.toast]:border-2 group-[.toast]:font-medium group-[.toast]:uppercase group-[.toast]:tracking-wide group-[.toast]:text-xs group-[.toast]:px-4 group-[.toast]:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:group-[.toast]:shadow-none hover:group-[.toast]:translate-x-[2px] hover:group-[.toast]:translate-y-[2px] group-[.toast]:transition-all",
          success: "group-[.toaster]:border-[#B5CCBC] group-[.toaster]:bg-[#f0f5f2] group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(181,204,188,0.4)]",
          error: "group-[.toaster]:border-[#E3B1B4] group-[.toaster]:bg-[#fdf5f5] group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(227,177,180,0.4)]",
          warning: "group-[.toaster]:border-[#f59e0b] group-[.toaster]:bg-[#fffbeb] group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(245,158,11,0.4)]",
          info: "group-[.toaster]:border-[#5A5E63] group-[.toaster]:bg-[#fafafa] group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(90,94,99,0.2)]",
        },
      }}
      gap={12}
      offset={16}
      style={
        {
          "--normal-bg": "#fafafa",
          "--normal-text": "#2f4f4f",
          "--normal-border": "#5A5E63",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
