"use client"

import * as React from "react"
import { PanelLeft, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

interface SidebarContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleSidebar: () => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export function SidebarProvider({
  defaultOpen = true,
  children,
  className = "",
}: {
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setOpen(false)
      } else {
        setOpen(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar, isMobile }}>
      <div className={`relative flex min-h-screen w-full bg-[#030305] text-white ${className}`}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger({
  className = "",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={`h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl transition-colors ${className}`}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function Sidebar({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open, isMobile, setOpen } = useSidebar()

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#090a0f] transition-all duration-300 ease-in-out lg:static ${
          open
            ? "w-64 translate-x-0"
            : isMobile
            ? "-translate-x-full w-64"
            : "w-0 -translate-x-full lg:w-0 overflow-hidden border-none"
        } ${className}`}
      >
        <div className="flex h-full w-64 flex-col overflow-hidden">
          {children}
        </div>
      </aside>
    </>
  )
}

export function SidebarHeader({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  const { isMobile, setOpen } = useSidebar()

  return (
    <div
      className={`flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 ${className}`}
    >
      {children}
      {isMobile && (
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

export function SidebarContent({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-6 ${className}`}>
      {children}
    </div>
  )
}

export function SidebarGroup({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={`flex flex-col space-y-1 ${className}`}>{children}</div>
}

export function SidebarGroupLabel({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono ${className}`}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={`space-y-1 ${className}`}>{children}</div>
}

export function SidebarMenu({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <nav className={`space-y-1 ${className}`}>{children}</nav>
}

export function SidebarMenuItem({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return <div className={`relative ${className}`}>{children}</div>
}

export function SidebarMenuButton({
  asChild,
  isActive,
  children,
  className = "",
  ...props
}: {
  asChild?: boolean
  isActive?: boolean
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const activeStyles = isActive
    ? "bg-[#665df5] text-white shadow-md shadow-indigo-600/30 font-semibold"
    : "text-zinc-400 hover:text-white hover:bg-white/5 font-medium"

  if (asChild) {
    return (
      <div
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all ${activeStyles} ${className}`}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarFooter({
  children,
  className = "",
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`shrink-0 border-t border-white/10 p-3 ${className}`}>
      {children}
    </div>
  )
}
