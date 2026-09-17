import { FileText } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { NotesSummarizer } from "@/components/notes-summarizer"

export default function NotesPage() {
  return (
    <div>
      <ToolHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn long notes or transcripts into summaries, decisions, and action items."
      />
      <NotesSummarizer />
    </div>
  )
}
