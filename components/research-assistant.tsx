"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Search, Lightbulb, Target, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { OptionPills } from "@/components/option-pills"
import { AiDisclaimer } from "@/components/ai-disclaimer"
import { CopyButton } from "@/components/copy-button"
import { Section, BulletList } from "@/components/result-blocks"

type Research = {
  overview: string
  keyInsights: string[]
  recommendations: string[]
  simplified: string
}

const modes = [
  { value: "topic", label: "Research a topic" },
  { value: "text", label: "Summarize pasted text" },
]

function toText(r: Research) {
  return [
    `OVERVIEW\n${r.overview}`,
    `\nKEY INSIGHTS\n${r.keyInsights.map((i) => `- ${i}`).join("\n")}`,
    `\nRECOMMENDATIONS\n${r.recommendations.map((i) => `- ${i}`).join("\n")}`,
    `\nIN SIMPLE TERMS\n${r.simplified}`,
  ].join("\n")
}

export function ResearchAssistant() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState("topic")
  const [result, setResult] = useState<Research | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRun() {
    if (input.trim().length < 10) {
      toast.error("Enter a topic or paste some text first.")
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Research failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex flex-col gap-5">
          <OptionPills
            label="Mode"
            options={modes}
            value={mode}
            onChange={setMode}
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="input">
              {mode === "topic" ? "Topic or question" : "Text to summarize"}
            </Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "topic"
                  ? "e.g. What is retrieval-augmented generation and why does it matter for enterprise search?"
                  : "Paste an article, report, or long document here..."
              }
              className="min-h-56 resize-y"
            />
          </div>
          <Button onClick={handleRun} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Insights</h2>
          {result && <CopyButton value={toText(result)} />}
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : result ? (
            <div className="flex flex-col gap-5">
              <Section title="Overview" icon={BookOpen}>
                <p className="text-sm leading-relaxed">{result.overview}</p>
              </Section>
              <Section title="Key insights" icon={Lightbulb}>
                <BulletList items={result.keyInsights} />
              </Section>
              <Section title="Recommendations" icon={Target}>
                <BulletList items={result.recommendations} />
              </Section>
              <Section title="In simple terms">
                <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                  {result.simplified}
                </p>
              </Section>
              <AiDisclaimer>
                AI-generated analysis based on general knowledge. Verify facts
                and figures against primary sources before relying on them.
              </AiDisclaimer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Insights and recommendations will appear here.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
