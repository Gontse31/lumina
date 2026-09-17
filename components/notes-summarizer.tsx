"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Loader2,
  Wand2,
  ListChecks,
  Gavel,
  FileText,
  ClipboardList,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AiDisclaimer } from "@/components/ai-disclaimer"
import { CopyButton } from "@/components/copy-button"
import { Section, BulletList } from "@/components/result-blocks"

type ActionItem = { task: string; owner: string; deadline: string }
type Summary = {
  summary: string
  keyPoints: string[]
  decisions: string[]
  actionItems: ActionItem[]
}

const sample = `Team sync - Q3 launch. Attendees: Priya, Marcus, Dana.
Priya reported the beta is stable; 2 blocking bugs remain on checkout.
Marcus will fix the payment bug by Friday. Dana owns the onboarding copy.
We agreed to push the public launch to Oct 3 and run a press release the same day.
Open question: do we need legal review on the new terms? Priya to check with legal next week.`

function toText(s: Summary) {
  return [
    `SUMMARY\n${s.summary}`,
    `\nKEY POINTS\n${s.keyPoints.map((p) => `- ${p}`).join("\n")}`,
    `\nDECISIONS\n${s.decisions.map((d) => `- ${d}`).join("\n")}`,
    `\nACTION ITEMS\n${s.actionItems
      .map((a) => `- ${a.task} (Owner: ${a.owner}, Due: ${a.deadline})`)
      .join("\n")}`,
  ].join("\n")
}

export function NotesSummarizer() {
  const [notes, setNotes] = useState("")
  const [result, setResult] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRun() {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a few sentences of notes.")
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Summarize failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Meeting notes or transcript</Label>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setNotes(sample)}
              type="button"
            >
              Use sample
            </Button>
          </div>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste raw meeting notes, bullet points, or a transcript..."
            className="min-h-72 resize-y"
          />
          <Button onClick={handleRun} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {loading ? "Summarizing..." : "Summarize notes"}
          </Button>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Summary</h2>
          {result && <CopyButton value={toText(result)} />}
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="mt-4 h-20 w-full" />
            </div>
          ) : result ? (
            <div className="flex flex-col gap-5">
              <Section title="Overview" icon={FileText}>
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </Section>
              <Section title="Key points" icon={ListChecks}>
                <BulletList items={result.keyPoints} />
              </Section>
              <Section title="Decisions" icon={Gavel}>
                <BulletList items={result.decisions} />
              </Section>
              <Section title="Action items" icon={ClipboardList}>
                {result.actionItems?.length ? (
                  <ul className="flex flex-col gap-2">
                    {result.actionItems.map((a, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm"
                      >
                        <div className="font-medium">{a.task}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          Owner: {a.owner} · Due: {a.deadline}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">None identified.</p>
                )}
              </Section>
              <AiDisclaimer>
                Extracted by AI from your notes. Confirm owners and deadlines
                before assigning work.
              </AiDisclaimer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Your structured summary will appear here.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
