"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Wand2, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { OptionPills } from "@/components/option-pills"
import { AiDisclaimer } from "@/components/ai-disclaimer"
import { CopyButton } from "@/components/copy-button"
import { Section, PriorityBadge } from "@/components/result-blocks"

type Block = { label: string; task: string; priority: string; note: string }
type Plan = { summary: string; blocks: Block[]; tips: string[] }

const timeframes = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
]

function toText(p: Plan) {
  return [
    p.summary,
    "",
    ...p.blocks.map(
      (b) => `${b.label} [${b.priority}] ${b.task}${b.note ? ` — ${b.note}` : ""}`,
    ),
    "",
    "TIPS",
    ...p.tips.map((t) => `- ${t}`),
  ].join("\n")
}

export function TaskPlanner() {
  const [tasks, setTasks] = useState("")
  const [hours, setHours] = useState("9:00am - 5:00pm")
  const [timeframe, setTimeframe] = useState("daily")
  const [result, setResult] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRun() {
    if (tasks.trim().length < 5) {
      toast.error("List the tasks you need to plan.")
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, timeframe, hours }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Planning failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tasks">Tasks and priorities</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"List everything on your plate, e.g.\n- Finish Q3 report (due tomorrow)\n- Prep client demo\n- Reply to 20 emails\n- 1:1 with manager"}
              className="min-h-44 resize-y"
            />
          </div>

          <OptionPills
            label="Timeframe"
            options={timeframes}
            value={timeframe}
            onChange={setTimeframe}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="hours">Working hours</Label>
            <Input
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 9:00am - 5:00pm"
            />
          </div>

          <Button onClick={handleRun} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {loading ? "Planning..." : "Build my plan"}
          </Button>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Your plan</h2>
          {result && <CopyButton value={toText(result)} />}
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : result ? (
            <div className="flex flex-col gap-5">
              <p className="text-sm leading-relaxed">{result.summary}</p>

              <ol className="flex flex-col gap-2">
                {result.blocks.map((b, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-muted/40 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-primary">
                        {b.label}
                      </span>
                      <PriorityBadge priority={b.priority} />
                    </div>
                    <div className="mt-1 text-sm font-medium">{b.task}</div>
                    {b.note && (
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {b.note}
                      </div>
                    )}
                  </li>
                ))}
              </ol>

              <Section title="Time optimization tips" icon={Lightbulb}>
                <ul className="flex flex-col gap-1.5">
                  {result.tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <AiDisclaimer>
                This plan is an AI-generated suggestion. Adjust it to fit your
                real commitments and energy levels.
              </AiDisclaimer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Your prioritized schedule will appear here.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
