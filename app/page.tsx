import Link from "next/link"
import { ArrowRight, Sparkles, Clock, ShieldCheck, Zap } from "lucide-react"
import { tools } from "@/lib/tools"
import { Card } from "@/components/ui/card"

const stats = [
  { icon: Zap, label: "AI tools", value: "6" },
  { icon: Clock, label: "Avg. task time saved", value: "~15 min" },
  { icon: ShieldCheck, label: "Responsible AI", value: "Built-in" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          AI-powered workplace assistant
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
          Automate the busywork. Focus on the work that matters.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground text-pretty md:text-base">
          FlowDesk brings six AI tools into one workspace — drafting emails,
          summarizing meetings, planning your day, researching topics, building
          resumes, and answering questions on demand.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Your tools
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.slug} href={tool.href} className="group">
                <Card className="h-full gap-0 p-5 transition-all hover:border-primary/40 hover:shadow-sm">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">
                    {tool.name}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted-foreground text-pretty">
                    {tool.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {tool.cta}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
