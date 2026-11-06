import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "left" | "right"
  className?: string
}

function Sheet({ open, onOpenChange, children, side = "right", className }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet Panel */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-full max-w-sm flex-col bg-background/95 backdrop-blur-md shadow-2xl border-border duration-300",
          side === "right"
            ? "right-0 border-l animate-in slide-in-from-right"
            : "left-0 border-r animate-in slide-in-from-left",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function SheetHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between border-b border-border/60 px-5 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function SheetTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-base font-semibold text-foreground tracking-tight", className)} {...props}>
      {children}
    </h2>
  )
}

function SheetClose({
  className,
  onClick,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children || <X className="h-4 w-4" />}
    </button>
  )
}

function SheetBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-5 py-4 space-y-6", className)} {...props}>
      {children}
    </div>
  )
}

function SheetFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-border/60 bg-muted/20 p-4", className)} {...props}>
      {children}
    </div>
  )
}

export { Sheet, SheetHeader, SheetTitle, SheetClose, SheetBody, SheetFooter }
