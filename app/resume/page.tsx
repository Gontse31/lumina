import { FileUser } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { ResumeBuilder } from "@/components/resume-builder"

export default function ResumePage() {
  return (
    <div>
      <ToolHeader
        icon={FileUser}
        title="AI Resume Builder"
        description="Generate polished, ATS-friendly resume content tailored to a target role, then export it."
      />
      <ResumeBuilder />
    </div>
  )
}
