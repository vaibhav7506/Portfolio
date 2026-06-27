"use client"

import { useEffect, useRef, useState } from "react"

interface StageNode {
  id: string
  label: string
  project: string
  desc: string
  desktop: { x: number; y: number }
  mobile: { x: number; y: number }
}

const DESKTOP_CENTER = { x: 400, y: 280 }
const MOBILE_CENTER  = { x: 200, y: 200 }

const STAGES: StageNode[] = [
  {
    id: "observe", label: "OBSERVE", project: "LoopOS",
    desc: "Trace every decision, every cost, every failure point",
    desktop: { x: 400, y: 90  }, mobile: { x: 200, y: 55  },
  },
  {
    id: "scale", label: "SCALE", project: "GitBlamed",
    desc: "Built for edge delivery and viral load, not just demos",
    desktop: { x: 650, y: 280 }, mobile: { x: 345, y: 200 },
  },
  {
    id: "evaluate", label: "EVALUATE", project: "Automation",
    desc: "Score outputs against explicit, weighted criteria",
    desktop: { x: 400, y: 470 }, mobile: { x: 200, y: 345 },
  },
  {
    id: "recover", label: "RECOVER", project: "SentientWallet",
    desc: "Guardrails enforced before the LLM ever decides",
    desktop: { x: 150, y: 280 }, mobile: { x: 55,  y: 200 },
  },
]

export function UnifiedArchitectureSection() {
  const [inView, setInView]         = useState(false)
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const [isMobile, setIsMobile]     = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const CENTER = isMobile ? MOBILE_CENTER : DESKTOP_CENTER
  const viewBox = isMobile ? "0 0 400 400" : "0 0 800 560"

  const pos = (stage: StageNode) => isMobile ? stage.mobile : stage.desktop

  // Node dimensions — smaller on mobile
  const nodeW  = isMobile ? 100 : 130
  const nodeH  = isMobile ? 42  : 48
  const nodeRx = 8
  const labelSize  = isMobile ? "text-[9px]"  : "text-[11px]"
  const projectSize = isMobile ? "text-[8px]" : "text-[9px]"
  const centerR = isMobile ? 46 : 62
  const centerTextSize = isMobile ? "text-[8px]" : "text-[10px]"

  const activeStage = STAGES.find((s) => s.id === hoveredStage)

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
      <div className="flex flex-col space-y-3 mb-12">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          UNIFIED ARCHITECTURE
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          One engineering question, four answers.
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          &quot;How do you build AI-adjacent systems that don&apos;t fail silently, don&apos;t scale poorly, and don&apos;t surprise you in production?&quot;
        </p>
      </div>

      <div
        ref={sectionRef}
        className="border border-border bg-[#0A0D12] rounded-lg p-4 md:p-6"
      >
        <svg
          viewBox={viewBox}
          className="w-full"
          style={{ touchAction: "none" }}
        >
          <defs>
            <filter id="uas-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Center → Stage lines */}
          {STAGES.map((stage) => (
            <line
              key={`line-${stage.id}`}
              x1={CENTER.x} y1={CENTER.y}
              x2={pos(stage).x} y2={pos(stage).y}
              stroke={hoveredStage === stage.id ? "var(--accent)" : "var(--border-active)"}
              strokeWidth={hoveredStage === stage.id ? "2" : "1.5"}
              className="transition-colors duration-300"
            />
          ))}

          {/* Animated packets */}
          {inView && STAGES.map((stage) => (
            <circle key={`packet-${stage.id}`} r={isMobile ? "2.5" : "3.5"} fill="var(--accent)">
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                path={`M ${pos(stage).x} ${pos(stage).y} L ${CENTER.x} ${CENTER.y}`}
              />
            </circle>
          ))}

          {/* Center node */}
          <g filter="url(#uas-glow)">
            <circle
              cx={CENTER.x} cy={CENTER.y} r={centerR}
              className="fill-accent/10 stroke-accent"
              strokeWidth="2"
            >
              {inView && (
                <animate
                  attributeName="r"
                  values={`${centerR};${centerR + 5};${centerR}`}
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
          <text x={CENTER.x} y={CENTER.y - (isMobile ? 6 : 8)} textAnchor="middle"
            className={`fill-text font-mono font-bold ${centerTextSize}`}>
            UNIFIED
          </text>
          <text x={CENTER.x} y={CENTER.y + (isMobile ? 6 : 6)} textAnchor="middle"
            className={`fill-text font-mono font-bold ${centerTextSize}`}>
            ENGINEERING
          </text>
          <text x={CENTER.x} y={CENTER.y + (isMobile ? 18 : 20)} textAnchor="middle"
            className={`fill-text font-mono font-bold ${centerTextSize}`}>
            PHILOSOPHY
          </text>

          {/* Stage nodes */}
          {STAGES.map((stage) => {
            const p = pos(stage)
            const isHovered = hoveredStage === stage.id
            return (
              <g
                key={stage.id}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                onTouchStart={() => setHoveredStage(stage.id)}
                onTouchEnd={() => setHoveredStage(null)}
                className="cursor-pointer"
              >
                <rect
                  x={p.x - nodeW / 2} y={p.y - nodeH / 2}
                  width={nodeW} height={nodeH}
                  rx={nodeRx}
                  className={`transition-all duration-200 ${
                    isHovered ? "fill-accent/15 stroke-accent" : "fill-surface stroke-border"
                  }`}
                  strokeWidth="2"
                />
                <text
                  x={p.x} y={p.y - (isMobile ? 3 : 2)}
                  textAnchor="middle"
                  className={`font-mono font-bold transition-colors ${labelSize} ${
                    isHovered ? "fill-accent" : "fill-text"
                  }`}
                >
                  {stage.label}
                </text>
                <text
                  x={p.x} y={p.y + (isMobile ? 11 : 14)}
                  textAnchor="middle"
                  className={`font-mono transition-colors ${projectSize} ${
                    isHovered ? "fill-success" : "fill-text-3"
                  }`}
                >
                  {stage.project}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Description panel */}
        <div className="mt-4 border-t border-border/50 pt-4 min-h-[48px] font-mono text-xs">
          {activeStage ? (
            <div className="flex flex-col gap-1">
              <span className="text-accent font-bold uppercase tracking-wider">
                {activeStage.label} — {activeStage.project}
              </span>
              <span className="text-text-2">{activeStage.desc}</span>
            </div>
          ) : (
            <span className="text-text-3 italic">
              {isMobile ? "Tap" : "Hover"} a stage to see how each project demonstrates it.
            </span>
          )}
        </div>
      </div>
    </section>
  )
}