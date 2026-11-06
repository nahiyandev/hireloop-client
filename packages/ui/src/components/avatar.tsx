import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

function Avatar({ className, src, alt, fallback, children, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted select-none",
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          onError={() => setImageError(true)}
          className="aspect-square size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-primary/10 text-primary font-semibold text-xs uppercase">
          {fallback || alt?.slice(0, 2) || "U"}
        </div>
      )}
      {children}
    </div>
  )
}

function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted font-medium text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Avatar, AvatarFallback }
