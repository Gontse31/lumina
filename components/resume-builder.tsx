"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Wand2, Download, ShieldCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AiDisclaimer } from "@/components/ai-disclaimer"
import { CopyButton } from "@/components/copy-button"
import { Section } from "@/components/result-blocks"

type Experience = {
  role: string
  company: string
  period: string
  bullets: string[]
}
type Resume = {
  summary: string
  skills: string[]
  experience: Experience[]
  atsTips: string[]
}

function toText(name: string, role: string, r: Resume) {
  return [
    name || "[Your Name]",
    role,
    "",
    "PROFESSIONAL SUMMARY",
    r.summary,
    "",
    "SKILLS",
    r.skills.join(", "),
    "",
    "EXPERIENCE",
    ...r.experience.flatMap((e) => [
      `${e.role} — ${e.company} (${e.period})`,
      ...e.bullets.map((b) => `  • ${b}`),
      "",
    ]),
  ].join("\n")
}

export function ResumeBuilder() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState("")
  const [education, setEducation] = useState("")
  const [result, setResult] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRun() {
    if (role.trim().length < 2 || experience.trim().length < 10) {
      toast.error("Add a target role and some experience details.")
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, experience, skills, education }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Request failed")
      setResult(data)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    if (!result) return
    const blob = new Blob([toText(name, role, result)], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${(name || "resume").replace(/\s+/g, "-").toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Resume downloaded")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-5">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Target role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Product Marketing Manager"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="experience">Experience (rough notes are fine)</Label>
            <Textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder={"e.g.\n- 3 years at Acme as marketing associate, ran email campaigns, grew list\n- Managed a team of 2, launched product on Product Hunt"}
              className="min-h-36 resize-y"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="skills">Skills (optional)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="SEO, analytics, copywriting, Figma"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="education">Education (optional)</Label>
            <Input
              id="education"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="BA Communications, University of Cape Town"
            />
          </div>

          <Button onClick={handleRun} disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {loading ? "Building..." : "Build resume"}
          </Button>
        </div>
      </Card>

      <Card className="gap-0 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Resume preview</h2>
          {result && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="size-3.5" />
                Export
              </Button>
              <CopyButton value={toText(name, role, result)} />
            </div>
          )}
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : result ? (
            <div className="flex flex-col gap-5">
              <div>
                <div className="text-lg font-semibold">
                  {name || "[Your Name]"}
                </div>
                <div className="text-sm text-primary">{role}</div>
              </div>

              <Section title="Professional summary">
                <p className="text-sm leading-relaxed">{result.summary}</p>
              </Section>

              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Section>

              <Section title="Experience">
                <div className="flex flex-col gap-4">
                  {result.experience.map((e, i) => (
                    <div key={i}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">{e.role}</span>
                        <span className="text-xs text-muted-foreground">
                          {e.period}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {e.company}
                      </div>
                      <ul className="mt-1.5 flex flex-col gap-1">
                        {e.bullets.map((b, j) => (
                          <li key={j} className="flex gap-2 text-sm leading-relaxed">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="ATS tips" icon={ShieldCheck}>
                <ul className="flex flex-col gap-1.5">
                  {result.atsTips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <AiDisclaimer>
                AI-generated resume content. Replace all bracketed placeholders
                with real numbers, and verify every claim is accurate and
                truthful before submitting.
              </AiDisclaimer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Your tailored, ATS-friendly resume will appear here.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
