import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  FileUser,
  type LucideIcon,
} from "lucide-react"

export type Tool = {
  slug: string
  href: string
  name: string
  short: string
  description: string
  icon: LucideIcon
  cta: string
}

export const tools: Tool[] = [
  {
    slug: "email",
    href: "/email",
    name: "Smart Email Generator",
    short: "Draft professional emails",
    description:
      "Generate context-aware emails with adjustable tone and audience in seconds.",
    icon: Mail,
    cta: "Draft an email",
  },
  {
    slug: "notes",
    href: "/notes",
    name: "Meeting Notes Summarizer",
    short: "Summarize meetings",
    description:
      "Turn long notes or transcripts into summaries, decisions, and action items.",
    icon: FileText,
    cta: "Summarize notes",
  },
  {
    slug: "planner",
    href: "/planner",
    name: "AI Task Planner",
    short: "Plan your day or week",
    description:
      "Prioritize tasks and build a structured, time-blocked schedule automatically.",
    icon: ListChecks,
    cta: "Plan my time",
  },
  {
    slug: "research",
    href: "/research",
    name: "AI Research Assistant",
    short: "Summarize & simplify",
    description:
      "Summarize articles or topics into key insights, takeaways, and recommendations.",
    icon: Search,
    cta: "Research a topic",
  },
  {
    slug: "resume",
    href: "/resume",
    name: "AI Resume Builder",
    short: "Build an ATS resume",
    description:
      "Generate polished, ATS-friendly resume content tailored to a target role.",
    icon: FileUser,
    cta: "Build a resume",
  },
  {
    slug: "chat",
    href: "/chat",
    name: "AI Assistant Chat",
    short: "Ask anything",
    description:
      "A conversational workplace assistant for quick questions and multi-step help.",
    icon: MessageSquare,
    cta: "Open chat",
  },
]
