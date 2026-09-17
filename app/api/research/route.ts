import { generateText, Output } from "ai"
import { z } from "zod"
import { PRIMARY_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

const schema = z.object({
  overview: z.string().describe("A clear 3-5 sentence overview of the topic or text."),
  keyInsights: z.array(z.string()).describe("The most important insights or findings."),
  recommendations: z.array(z.string()).describe("Actionable recommendations or next steps."),
  simplified: z
    .string()
    .describe("A plain-language explanation a non-expert could understand."),
})

export async function POST(req: Request) {
  const { input, mode }: { input?: string; mode?: string } = await req.json()

  if (!input || input.trim().length < 10) {
    return Response.json(
      { error: "Enter a topic or paste text to research." },
      { status: 400 },
    )
  }

  try {
    const { output } = await generateText({
      model: PRIMARY_MODEL,
      instructions: `${RESPONSIBLE_AI_GUIDANCE} You are a research analyst. Base your analysis only on well-established, general knowledge or the text provided. Do not fabricate statistics, studies, or citations. If the topic requires current or specialized data you are unsure of, say so explicitly in the overview.`,
      prompt:
        mode === "text"
          ? `Summarize and analyze the following text:\n\n${input}`
          : `Research and analyze this topic for a busy professional: ${input}`,
      output: Output.object({ schema }),
    })

    return Response.json(output)
  } catch (err) {
    console.log("[v0] research error:", err)
    return Response.json(
      { error: "Something went wrong while researching." },
      { status: 500 },
    )
  }
}
