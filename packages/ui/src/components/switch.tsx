"use client"

import * as React from "react"
import { cn } from "cn"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, onChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? defaultChecked ?? false)

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked)
      }
    }, [checked])

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextChecked = e.target.checked
      if (checked === undefined) {
        setIsChecked(nextChecked)
      }
      onChange?.(e)
      onCheckedChange?.(nextChecked)
    }

    return (
      <label className={cn("inline-flex items-center cursor-pointer", className)}>
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleToggle}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out",
            "bg-zinc-800 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#665df5]",
            "peer-checked:bg-[#665df5]",
            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
            "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-200",
            "peer-checked:after:translate-x-4"
          )}
        />
      </label>
    )
  }
)

Switch.displayName = "Switch"

export { Switch }
