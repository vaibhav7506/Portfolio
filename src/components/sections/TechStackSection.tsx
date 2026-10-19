"use client"

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import { Code2, BrainCircuit, Server, Database, ShieldCheck, type LucideIcon } from "lucide-react"
import { TechPetMascot } from "@/components/ui/TechPetMascot"
import styles from "./TechStackSection.module.css"

interface StackCategory {
  key: "web" | "ai" | "backend" | "data" | "devops"
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
  const [activeKey, setActiveKey] = useState(CATEGORIES[0].key)
  const [replay, setReplay] = useState(0)
  const [motionPaused, setMotionPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const active = CATEGORIES.find((c) => c.key === activeKey) ?? CATEGORIES[0]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    const visibility = () => setPageVisible(!document.hidden)
    visibility()
    document.addEventListener("visibilitychange", visibility)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility) }
  }, [])

  const selectCategory = (index: number) => {
    setActiveKey(CATEGORIES[index].key)
    setReplay((value) => value + 1)
  }
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number
    if (event.key === "ArrowRight") next = (index + 1) % CATEGORIES.length
    else if (event.key === "ArrowLeft") next = (index - 1 + CATEGORIES.length) % CATEGORIES.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = CATEGORIES.length - 1
    else return
    event.preventDefault()
    selectCategory(next)
    tabsRef.current[next]?.focus()
  }

  return (
    <section
      id="stack"
      ref={sectionRef}
      data-category={activeKey}
      data-running={inView && pageVisible}
      className={`w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50 scroll-mt-[56px] ${styles.section}`}
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
            {CATEGORIES.map((cat, index) => {
              const isActive = cat.key === activeKey
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.key}
                  type="button"
                  id={`stack-tab-${cat.key}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="stack-technologies"
                  tabIndex={isActive ? 0 : -1}
                  ref={(element) => { tabsRef.current[index] = element }}
                  data-category={cat.key}
                  onKeyDown={(event) => navigateTabs(event, index)}
                  onClick={() => selectCategory(index)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold rounded-md border transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${styles.tab} ${
                    isActive
                      ? "border-accent bg-accent-dim text-accent"
                      : "border-border text-text-2 hover:text-text hover:border-accent/40"
                  }`}
                >
                  <span key={isActive ? replay : "idle"} className={styles.tabIcon} aria-hidden="true"><CatIcon className="w-3.5 h-3.5" strokeWidth={2.25} /></span>
                  <span className={styles.tabLabel}>{cat.label}</span>
                  <span className={styles.tabEffect} aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <div
            id="stack-technologies"
            role="tabpanel"
            aria-labelledby={`stack-tab-${activeKey}`}
            tabIndex={0}
            className={styles.panel}
          >
            <div key={`${activeKey}-${replay}`} className={styles.tags}>
              {active.tags.map((tag, index) => (
                <span key={tag} className={styles.tagEntry} style={{ "--order": index } as CSSProperties}>
                  <span className={styles.tag} data-variant={index % 2}>
                    <span className={styles.tagDecoration} aria-hidden="true" />
                    <span className={styles.tagText}>{tag}</span>
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: companion mascot panel */}
        <div className={`border border-border bg-surface rounded-lg p-6 flex flex-col items-center justify-center gap-4 shadow-panel min-h-[220px] ${styles.companion}`}>
          <TechPetMascot key={`${activeKey}-${replay}`} icon={active.icon} label={active.label} category={activeKey} running={inView && pageVisible && !motionPaused} />
          <button type="button" className={styles.motionControl} aria-pressed={motionPaused} onClick={() => setMotionPaused((value) => !value)}>
            {motionPaused ? "Resume animation" : "Pause animation"}
          </button>
        </div>
      </div>
    </section>
  )
}
