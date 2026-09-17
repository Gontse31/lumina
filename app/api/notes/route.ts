import { generateText, Output } from "ai"
import { z } from "zod"
import { PRIMARY_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

const schema = z.object({
  summary: z.string().describe("A concise 2-4 sentence overview of the meeting."),
  keyPoints: z.array(z.string()).describe("The most important discussion points."),
  decisions: z.array(z.string()).describe("Concrete decisions that were made."),
  actionItems: z
    .array(
      z.object({
        task: z.string(),
        owner: z.string().describe("Person responsible, or 'Unassigned'."),
        deadline: z.string().describe("Deadline if mentioned, otherwise 'No deadline'."),
      }),
    )
    .describe("Action items with owners and deadlines."),
})

export async function POST(req: Request) {
  const { notes }: { notes?: string } = await req.json()

  if (!notes || notes.trim().length < 20) {
    return Response.json(
      { error: "Please paste at least a few sentences of meeting notes." },
      { status: 400 },
    )
  }

  try {
    const { output } = await generateText({
      model: PRIMARY_MODEL,
      instructions: `${RESPONSIBLE_AI_GUIDANCE} You are a meticulous meeting-notes analyst. Only extract information present in the notes. Never invent owners, deadlines, or decisions. If something is not stated, mark it clearly (e.g. 'Unassigned', 'No deadline').`,
      prompt: `Analyze the following meeting notes and extract a structured summary.\n\nNOTES:\n${notes}`,
      output: Output.object({ schema }),
    })

    return Response.json(output)
  } catch (err) {
    console.log("[v0] notes summarize error:", err)
    return Response.json(
      { error: "Something went wrong while summarizing the notes." },
      { status: 500 },
    )
  }
}
