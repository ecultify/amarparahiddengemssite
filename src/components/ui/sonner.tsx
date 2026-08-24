"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast items-start gap-2.5 border border-border bg-popover shadow-[0_10px_30px_-12px_rgba(27,42,74,0.45)]",
          title: "text-[13px] font-semibold text-foreground",
          // Sonner dims descriptions by default, which drops them under 4.5:1.
          description: "!text-[13px] !leading-snug !text-foreground/70",
          success: "[&_[data-icon]]:text-grass",
          error: "[&_[data-icon]]:text-destructive",
          warning: "[&_[data-icon]]:text-amber",
          info: "[&_[data-icon]]:text-cyan",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
