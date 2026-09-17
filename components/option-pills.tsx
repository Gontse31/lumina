"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

export type PillOption = { value: string; label: string }

export function OptionPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: PillOption[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
