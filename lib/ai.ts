// Central AI configuration. All tools route through the Vercel AI Gateway,
// which is zero-config in v0 previews and on Vercel deployments.

// Fast, capable general-purpose model used for the productivity tools.
export const PRIMARY_MODEL = "openai/gpt-4.1-mini"

// Used for the conversational chatbot where responsiveness matters.
export const CHAT_MODEL = "openai/gpt-4.1-mini"

// Shared responsible-AI framing injected into every generation so outputs
// stay professional, unbiased, and clearly marked as AI-assisted drafts.
export const RESPONSIBLE_AI_GUIDANCE = [
  "You are a workplace productivity assistant.",
  "Produce professional, inclusive, and unbiased content.",
  "Never invent specific facts, figures, names, quotes, or citations. If information is missing, use a clearly marked placeholder like [ROLE] or [DATE] instead of fabricating details.",
  "Do not include discriminatory, harmful, or non-compliant language.",
  "Keep outputs concise and directly useful for a working professional.",
].join(" ")
