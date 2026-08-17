"use client"

import { useState } from "react"
import { Code2, BrainCircuit, Server, Database, ShieldCheck, type LucideIcon } from "lucide-react"
import { TechPetMascot } from "@/components/ui/TechPetMascot"

interface StackCategory {
  key: string
  label: string
  icon: LucideIcon
  tags: string[]
}

// Every tag here is pulled directly from a live project's techStack in
// src/lib/projects.ts (or a stated, verifiable skill) — nothing padded.
const CATEGORIES: StackCategory[] = [
  {
    key: "web",
    label: "Web Development",
    icon: Code2,
    tags: ["TypeScript", "Next.js", "React", "Tailwind CSS", "GSAP", "Three.js", "Vite"],
  },
  {
    key: "ai",
    label: "AI & Agent Engineering",
    icon: BrainCircuit,
    tags: ["LangChain", "OpenAI API", "Groq", "Gemini", "Claude", "Cloudflare AI Gateway"],
  },
  {
    key: "backend",
    label: "Backend & Infrastructure",
    icon: Server,
    tags: ["Node.js", "Express.js", "Hono.js", "Cloudflare Workers", "Durable Objects", "Java"],
  },
  {
    key: "data",
    label: "Data & Storage",
    icon: Database,
    tags: [
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "Drizzle ORM",
      "Cloudflare D1",
      "Cloudflare KV",
      "Cloudflare R2",
      "Supabase",
    ],
  },
  {
    key: "devops",
    label: "DevOps, Testing & Security",
    icon: ShieldCheck,
    tags: ["Vercel", "Playwright", "Vitest", "Zod", "AES-256-GCM", "OWASP LLM Top 10", "Cloudflare Turnstile"],
  },
]

export function TechStackSection() {
  const [activeKey, setActiveKey] = useState<string>(CATEGORIES[0].key)
  const active = CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0]

  return (
    <section
      id="stack"
      className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50 scroll-mt-[56px]"
    >
      {/* Header */}
      <div className="flex flex-col space-y-3 mb-12">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">STACK</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          What&apos;s actually running under the hood
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          Every tag below ships in at least one live project — no resume padding, no frameworks sitting unused in a
          &quot;familiar with&quot; list.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 lg:gap-12 items-start">
        {/* Left: category tabs + tag grid */}
        <div>
          <div
            role="tablist"
            aria-label="Tech stack categories"
            className="flex flex-wrap gap-2 mb-8"
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat.key === activeKey
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveKey(cat.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-md border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                    isActive
                      ? "border-accent bg-accent-dim text-accent"
                      : "border-border text-text-2 hover:text-text hover:border-accent/40"
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" strokeWidth={2.25} />
                  {cat.label}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            aria-label={`${active.label} technologies`}
            className="flex flex-wrap gap-2.5"
          >
            {active.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-xs font-mono rounded-md bg-elevated border border-border/50 text-text-2 hover:text-text hover:border-accent/40 transition-colors duration-150"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: companion mascot panel */}
        <div className="border border-border bg-surface rounded-lg p-6 flex flex-col items-center justify-center gap-4 shadow-panel min-h-[220px]">
          <TechPetMascot icon={active.icon} label={active.label} />
        </div>
      </div>
    </section>
  )
}