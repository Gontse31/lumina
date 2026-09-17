import { MessageSquare } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { AssistantChat } from "@/components/assistant-chat"

export default function ChatPage() {
  return (
    <div>
      <ToolHeader
        icon={MessageSquare}
        title="AI Assistant Chat"
        description="A conversational workplace assistant for quick questions and multi-step help."
      />
      <AssistantChat />
    </div>
  )
}
