import type { LucideIcon } from "lucide-react"

export function ToolHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </div>
  )
}
