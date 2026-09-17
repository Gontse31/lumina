import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { CHAT_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: CHAT_MODEL,
    instructions: `${RESPONSIBLE_AI_GUIDANCE} You are FlowDesk's conversational workplace assistant. Help with drafting, planning, summarizing, brainstorming, and answering professional questions. Be concise and practical. When you are uncertain or a question needs current or specialized data, say so rather than guessing. Format answers with short paragraphs and bullet points where helpful.`,
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
