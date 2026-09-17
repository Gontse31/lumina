import { generateText } from "ai"
import { PRIMARY_MODEL, RESPONSIBLE_AI_GUIDANCE } from "@/lib/ai"

export const maxDuration = 30

type Body = {
  purpose?: string
  tone?: string
  audience?: string
  keyPoints?: string
  senderName?: string
}

export async function POST(req: Request) {
  const { purpose, tone, audience, keyPoints, senderName }: Body =
    await req.json()

  if (!purpose || purpose.trim().length < 3) {
    return Response.json(
      { error: "Please describe what the email should be about." },
      { status: 400 },
    )
  }

  const instructions = [
    RESPONSIBLE_AI_GUIDANCE,
    "You are an expert business communication writer.",
    "Write a single, ready-to-send email.",
    "Return only the email itself: a 'Subject:' line, then the body.",
    "Do not include commentary, explanations, or multiple options.",
    "Use professional formatting with short paragraphs.",
    "Where a real detail is unknown, insert a bracketed placeholder such as [DATE] or [LINK].",
  ].join(" ")

  const prompt = [
    `Write an email for the following purpose: ${purpose}.`,
    `Tone: ${tone ?? "formal"}.`,
    `Primary audience: ${audience ?? "client"}.`,
    keyPoints?.trim()
      ? `Key points to include:\n${keyPoints}`
      : "No additional key points were provided.",
    senderName?.trim()
      ? `Sign the email from: ${senderName}.`
      : "Sign the email with a neutral placeholder [Your Name].",
  ].join("\n")

  try {
    const { text } = await generateText({
      model: PRIMARY_MODEL,
      instructions,
      prompt,
      temperature: 0.6,
    })

    return Response.json({ text })
  } catch (err) {
    console.log("[v0] email generation error:", err)
    return Response.json(
      { error: "Something went wrong while generating the email." },
      { status: 500 },
    )
  }
}
