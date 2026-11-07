"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0c0d12] group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-[#665df5] group-[.toast]:text-white group-[.toast]:hover:bg-[#5345f0] group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-zinc-300 group-[.toast]:rounded-lg",
          success: "group-[.toaster]:border-emerald-500/20",
          error: "group-[.toaster]:border-rose-500/20",
          info: "group-[.toaster]:border-indigo-500/20",
          warning: "group-[.toaster]:border-amber-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
