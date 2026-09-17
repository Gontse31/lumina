import { ListChecks } from "lucide-react"
import { ToolHeader } from "@/components/tool-header"
import { TaskPlanner } from "@/components/task-planner"

export default function PlannerPage() {
  return (
    <div>
      <ToolHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Prioritize tasks and build a structured, time-blocked schedule automatically."
      />
      <TaskPlanner />
    </div>
  )
}
