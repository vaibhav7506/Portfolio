import { projectStatusLabels, type Project } from "@/lib/projects"

const tones: Record<Project["status"], { badge: string; dot: string }> = {
  active: { badge: "border-success/30 bg-success/10 text-success", dot: "bg-success" },
  live: { badge: "border-success/20 bg-success/5 text-success", dot: "bg-success" },
  prototype: { badge: "border-accent/25 bg-accent/5 text-text-mono", dot: "bg-accent" },
  "in-development": { badge: "border-warning/20 bg-warning/5 text-warning", dot: "bg-warning" },
}

export function ProjectStatusBadge({ status }: { status: Project["status"] }) {
  const tone = tones[status]

  return (
    <span data-project-status={status} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${tone.badge}`}>
      <span aria-hidden="true" className={`w-1 h-1 rounded-full ${tone.dot}`} />
      {projectStatusLabels[status]}
    </span>
  )
}
