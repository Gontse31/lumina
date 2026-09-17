"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Wand2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { OptionPills } from "@/components/option-pills"
import { OutputCard } from "@/components/output-card"

const tones = [
  { value: "formal", label: "Formal" },
  { value: "informal", label: "Informal" },
  { value: "persuasive", label: "Persuasive" },
  { value: "friendly", label: "Friendly" },
  { value: "apologetic", label: "Apologetic" },
]

const audiences = [
  { value: "client", label: "Client" },
  { value: "manager", label: "Manager" },
  { value: "team", label: "Team" },
  { value: "vendor", label: "Vendor" },
  { value: "customer", label: "Customer" },
]

export function EmailGenerator() {
  const [purpose, setPurpose] = useState("")
  const [keyPoints, setKeyPoints] = useState("")
  const [senderName, setSenderName] = useState("")
  const [tone, setTone] = useState("formal")
  const [audience, setAudience] = useState("client")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    if (purpose.trim().length < 3) {
      toast.error("Describe what the email is about first.")
      return
    }
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, tone, audience, keyPoints, senderName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data.text)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="purpose">What is the email about?</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Follow up with a client about the delayed project deliverable and propose a new timeline."
              className="min-h-24 resize-y"
            />
          </div>

          <OptionPills label="Tone" options={tones} value={tone} onChange={setTone} />
          <OptionPills
            label="Audience"
            options={audiences}
            value={audience}
            onChange={setAudience}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="keyPoints">Key points (optional)</Label>
            <Textarea
              id="keyPoints"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="One point per line — dates, names, next steps..."
              className="min-h-20 resize-y"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sender">Your name (optional)</Label>
            <Input
              id="sender"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
          </div>

          <Button onClick={handleGenerate} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {loading ? "Generating..." : "Generate email"}
          </Button>
        </div>
      </Card>

      <OutputCard
        title="Generated email"
        loading={loading}
        content={result}
        emptyLabel="Your generated email will appear here."
      />
    </div>
  )
}
