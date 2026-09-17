import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="size-3.5 text-primary" />}
        {title}
      </h3>
      {children}
    </section>
  )
}

export function BulletList({ items }: { items: string[] }) {
  if (!items?.length)
    return <p className="text-sm text-muted-foreground">None identified.</p>
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge
      className={cn(
        "border-transparent capitalize",
        priorityStyles[priority] ?? priorityStyles.low,
      )}
    >
      {priority}
    </Badge>
  )
}
