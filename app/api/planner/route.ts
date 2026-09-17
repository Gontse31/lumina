import { generateText, Output } from "ai"
import { z } from "zod"
import { PRIMARY_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

const schema = z.object({
  summary: z.string().describe("A short overview of the plan and its focus."),
  blocks: z
    .array(
      z.object({
        label: z.string().describe("Time block (e.g. '09:00 - 10:30') or day (e.g. 'Monday')."),
        task: z.string(),
        priority: z.enum(["high", "medium", "low"]),
        note: z.string().describe("A brief rationale or tip for this block."),
      }),
    )
    .describe("Ordered, prioritized schedule blocks."),
  tips: z.array(z.string()).describe("Time-optimization and productivity strategies."),
})

export async function POST(req: Request) {
  const { tasks, timeframe, hours }: {
    tasks?: string
    timeframe?: string
    hours?: string
  } = await req.json()

  if (!tasks || tasks.trim().length < 5) {
    return Response.json(
      { error: "List the tasks you need to plan first." },
      { status: 400 },
    )
  }

  try {
    const { output } = await generateText({
      model: PRIMARY_MODEL,
      instructions: `${RESPONSIBLE_AI_GUIDANCE} You are an expert productivity coach. Build realistic, prioritized schedules. Apply proven techniques (Eisenhower matrix, time-blocking, batching, deep-work first). Do not overload the schedule.`,
      prompt: [
        `Create a structured ${timeframe ?? "daily"} plan.`,
        `Available working hours: ${hours ?? "9am-5pm"}.`,
        `Tasks and context:\n${tasks}`,
        `Prioritize by urgency and importance, and include short breaks.`,
      ].join("\n"),
      output: Output.object({ schema }),
    })

    return Response.json(output)
  } catch (err) {
    console.log("[v0] planner error:", err)
    return Response.json(
      { error: "Something went wrong while building the plan." },
      { status: 500 },
    )
  }
}
