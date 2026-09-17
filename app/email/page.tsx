import { Mail } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { EmailGenerator } from "@/components/email-generator"

export default function EmailPage() {
  return (
    <div>
      <ToolHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Generate professional, context-aware emails with adjustable tone and audience."
      />
      <EmailGenerator />
    </div>
  )
}
