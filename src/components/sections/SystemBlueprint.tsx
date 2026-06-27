"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const SystemBlueprintCanvas = dynamic(
  () => import("./SystemBlueprintCanvas").then((mod) => mod.SystemBlueprintCanvas),
  { ssr: false, loading: () => (
    <div className="w-full h-[500px] border border-border bg-surface rounded-lg flex items-center justify-center text-xs font-mono text-text-3">
      INITIALIZING WebGL CANVAS ENGINE...
    </div>
  )}
)

export type ScenarioType = "NORMAL" | "FAILURE" | "BUDGET" | "QUALITY"

export function SystemBlueprint() {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("NORMAL")
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<{
    name: string
    role: string
    tech: string
    decision: string
  } | null>(null)

  const scenarios = [
    { id: "NORMAL", label: "Normal Run", desc: "Happy path: fast edge-cache resolution." },
    { id: "FAILURE", label: "Provider Failure", desc: "Simulates LLM cascade fallback (Groq → Gemini → Claude)." },
    { id: "BUDGET", label: "Budget Spike", desc: "Guardrail activates to halt task run when token threshold exceeded." },
    { id: "QUALITY", label: "Low Quality Output", desc: "Evaluator rejects run (Score < 7.5) and triggers retry." },
  ]

  const handleNodeHover = (nodeData: typeof hoveredNodeInfo) => {
    setHoveredNodeInfo(nodeData)
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-border/50">
      {/* Header */}
      <div className="flex flex-col space-y-3 mb-10">
        <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">
          SYSTEM BLUEPRINT
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-text tracking-tight">
          Interactive Distributed Architecture Blueprint
        </h2>
        <p className="text-sm text-text-2 max-w-2xl font-sans leading-relaxed">
          Recruiters check for systems engineering competence. Rotate, zoom, and inspect this live 3D representation of LoopOS infrastructure to see our architectural design decisions.
        </p>
      </div>

      {/* Control Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 font-mono text-[10px]">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s.id as ScenarioType)}
            className={`px-3 py-1.5 rounded-md border font-semibold tracking-wider uppercase transition-all cursor-pointer ${
              activeScenario === s.id
                ? "border-accent bg-accent-dim text-accent"
                : "border-border hover:border-text-3 text-text-3"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch">
        {/* WebGL Canvas */}
        <div className="relative min-h-[500px] border border-border bg-[#0A0D12] rounded-lg overflow-hidden flex flex-col justify-between">
          <SystemBlueprintCanvas
            scenario={activeScenario}
            onHoverNode={handleNodeHover}
          />
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[9px] text-text-3 bg-bg/80 backdrop-blur px-2.5 py-1 rounded border border-border/50">
            [Left-Click + Drag to Rotate · Right-Click + Drag to Pan · Scroll to Zoom · Hover Nodes to Inspect]
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="border border-border bg-surface p-6 rounded-lg flex flex-col justify-between font-mono text-xs shadow-panel">
          <div>
            <div className="border-b border-border/50 pb-3 mb-4">
              <span className="text-[10px] text-text-3 uppercase tracking-wider font-bold">
                Scenario Impact
              </span>
              <p className="text-text-mono font-bold mt-1 text-[11px]">
                {scenarios.find((s) => s.id === activeScenario)?.desc}
              </p>
            </div>

            {hoveredNodeInfo ? (
              <div className="space-y-4">
                <div>
                  <span className="text-text-3 text-[10px] font-bold">NODE</span>
                  <div className="text-text font-bold text-sm tracking-wide mt-0.5">{hoveredNodeInfo.name}</div>
                </div>
                <div>
                  <span className="text-text-3 text-[10px] font-bold">ROLE</span>
                  <div className="text-text-2 mt-0.5 leading-relaxed">{hoveredNodeInfo.role}</div>
                </div>
                <div>
                  <span className="text-text-3 text-[10px] font-bold">INFRA STACK</span>
                  <div className="text-text-mono mt-0.5">{hoveredNodeInfo.tech}</div>
                </div>
                <div>
                  <span className="text-text-3 text-[10px] font-bold">ENGINEERING DECISION</span>
                  <div className="text-success mt-1 border-l-2 border-success/30 pl-3 leading-relaxed text-[11px]">
                    {hoveredNodeInfo.decision}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-[260px] text-text-3 italic p-4">
                Hover over a 3D network node in the canvas to inspect its production engineering decisions.
              </div>
            )}
          </div>

          <div className="border-t border-border/50 pt-4 mt-6 text-[9px] text-text-3 leading-relaxed uppercase">
            System status: nominal. LoopOS is fully instrumented with telemetry vectors.
          </div>
        </div>
      </div>
    </section>
  )
}
