import { ShieldAlert } from "lucide-react"

export function AiDisclaimer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/50 px-3.5 py-3 text-xs text-muted-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" />
      <p className="leading-relaxed">
        {children ?? (
          <>
            This content is AI-generated and may contain errors or bias. Review
            and verify all facts, names, and figures before sending or acting on
            it.
          </>
        )}
      </p>
    </div>
  )
}
