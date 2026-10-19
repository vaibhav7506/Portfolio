"use client"

import Link from "next/link"
import { Project } from "@/lib/projects"
import { ProjectStatusBadge } from "./ProjectStatusBadge"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div data-project={project.slug} className="group relative flex flex-col justify-between p-6 border border-border bg-surface rounded-lg hover:border-accent/40 transition-all duration-250 ease-out hover:shadow-2xl">
      {/* Decorative Top Glow */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />

      <div>
        {/* Header (Status + Year) */}
        <div className="flex items-center justify-between mb-4 font-mono text-[10px]">
          <ProjectStatusBadge status={project.status} />
          <span className="text-text-3 font-semibold">{project.year}</span>
        </div>

        {/* Title & Tagline */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors duration-150">
            {project.title}
          </h3>
          <p className="text-xs font-mono text-text-mono mt-1">
            {project.role}
          </p>
          <p className="text-xs text-text-2 mt-2 leading-relaxed">
            {project.tagline}
          </p>
        </div>

        {/* Metrics Grid inside Card */}
        <div className="grid grid-cols-2 gap-3 py-3 my-4 border-y border-border/50 font-mono text-[10px]">
          {project.metrics.slice(0, 2).map((metric, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-text-3 font-semibold uppercase">{metric.label}</span>
              <span className="text-text-2 mt-0.5 truncate">{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[9px] font-mono rounded bg-elevated border border-border/50 text-text-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Links */}
      <div className="flex items-center justify-between pt-2 mt-auto font-mono text-[11px] font-bold">
        <Link
          href={`/work/${project.slug}`}
          className="text-accent hover:text-accent/80 transition-colors duration-150 flex items-center gap-1"
        >
          READ CASE STUDY <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
        <div className="flex gap-4">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-2 hover:text-text transition-colors duration-150"
            >
              DEMO ↗
            </a>
          )}
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-2 hover:text-text transition-colors duration-150"
          >
            GITHUB ↗
          </a>
        </div>
      </div>
    </div>
  )
}
