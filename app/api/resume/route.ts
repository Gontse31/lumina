import { generateText, Output } from "ai"
import { z } from "zod"
import { PRIMARY_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

const schema = z.object({
  summary: z.string().describe("A punchy 2-3 sentence professional summary."),
  skills: z.array(z.string()).describe("Relevant hard and soft skills, ATS-friendly."),
  experience: z
    .array(
      z.object({
        role: z.string(),
        company: z.string(),
        period: z.string(),
        bullets: z
          .array(z.string())
          .describe("Achievement-focused bullets starting with action verbs."),
      }),
    )
    .describe("Work experience rewritten with impact and metrics placeholders."),
  atsTips: z.array(z.string()).describe("Tips to pass Applicant Tracking Systems."),
})

export async function POST(req: Request) {
  const { name, role, experience, skills, education }: {
    name?: string
    role?: string
    experience?: string
    skills?: string
    education?: string
  } = await req.json()

  if (!role || role.trim().length < 2 || !experience || experience.trim().length < 10) {
    return Response.json(
      { error: "Add a target role and some experience details first." },
      { status: 400 },
    )
  }

  try {
    const { output } = await generateText({
      model: PRIMARY_MODEL,
      instructions: `${RESPONSIBLE_AI_GUIDANCE} You are a professional resume writer specializing in ATS optimization. Rewrite the candidate's raw input into polished resume content. Use strong action verbs and quantify impact. Where a specific metric is not provided, insert a clearly bracketed placeholder like [X%] or [amount] instead of inventing numbers. Never fabricate employers, titles, or credentials the user did not provide.`,
      prompt: [
        name?.trim() ? `Candidate name: ${name}.` : "",
        `Target role: ${role}.`,
        `Raw experience:\n${experience}`,
        skills?.trim() ? `Skills provided: ${skills}.` : "",
        education?.trim() ? `Education: ${education}.` : "",
        `Tailor the content specifically to the target role.`,
      ]
        .filter(Boolean)
        .join("\n"),
      output: Output.object({ schema }),
    })

    return Response.json(output)
  } catch (err) {
    console.log("[v0] resume error:", err)
    return Response.json(
      { error: "Something went wrong while building the resume." },
      { status: 500 },
    )
  }
}
