import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CopyButton } from "@/components/copy-button"
import { AiDisclaimer } from "@/components/ai-disclaimer"

export function OutputCard({
  title = "Result",
  loading,
  content,
  emptyLabel,
  actions,
}: {
  title?: string
  loading?: boolean
  content: string
  emptyLabel: string
  actions?: React.ReactNode
}) {
  const hasContent = content.trim().length > 0

  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          {actions}
          {hasContent && <CopyButton value={content} />}
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : hasContent ? (
          <div className="flex flex-col gap-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {content}
            </pre>
            <AiDisclaimer />
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </p>
        )}
      </div>
    </Card>
  )
}
