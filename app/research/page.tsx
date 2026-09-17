import { Search } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { ResearchAssistant } from "@/components/research-assistant"

export default function ResearchPage() {
  return (
    <div>
      <ToolHeader
        icon={Search}
        title="AI Research Assistant"
        description="Summarize articles or topics into key insights, recommendations, and plain-language explanations."
      />
      <ResearchAssistant />
    </div>
  )
}
