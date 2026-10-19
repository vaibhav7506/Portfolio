"use client"

import { useEffect, useState } from "react"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const BOOT_LOGS = [
  "LOOPOS SYSTEM BOOTING...",
  "✓ PLANNER          ONLINE",
  "✓ RECRUITER        ONLINE",
  "✓ ROUTER           ONLINE",
  "✓ RESEARCH AGENT   ONLINE",
  "✓ EXECUTOR         ONLINE",
  "✓ EVALUATOR        ONLINE",
  "✓ MEMORY LAYER     ONLINE",
  "  AI GATEWAY       CONNECTED",
  "  DURABLE OBJECTS  INITIALIZED",
  "  LOOP v1.0.0      READY",
]

export function BootSequence() {
  const reducedMotion = usePrefersReducedMotion()
  const [status, setStatus] = useState<"idle" | "playing" | "complete">("idle")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (status !== "playing" || reducedMotion) return

    if (currentIndex < BOOT_LOGS.length) {
      const delay = currentIndex === 0 ? 300 : currentIndex === BOOT_LOGS.length - 1 ? 400 : 150
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setStatus("complete")
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, status, reducedMotion])

  const logs = reducedMotion || status === "complete" ? BOOT_LOGS : BOOT_LOGS.slice(0, currentIndex)
  const play = () => {
    setCurrentIndex(0)
    setStatus("playing")
  }

  return (
    <section id="loopos-boot" aria-labelledby="loopos-boot-title" className="max-w-6xl mx-auto px-6 py-10 border-b border-border/50 grid md:grid-cols-[0.75fr_1fr] gap-6 md:gap-10 items-start">
      <div className="space-y-3">
        <p className="font-mono text-[10px] text-accent font-bold tracking-widest uppercase">LoopOS · Startup animation</p>
        <h2 id="loopos-boot-title" className="text-xl font-bold tracking-tight text-text">Inside the boot sequence</h2>
        <p className="text-sm text-text-2 leading-relaxed max-w-sm">Play the terminal-style startup sequence, then explore the interactive run simulation below.</p>
        <p className="font-mono text-[10px] text-text-3">Illustrative sequence · sample output</p>
      </div>
      <div data-boot-state={reducedMotion ? "static" : status} className="w-full min-w-0 border border-border bg-[#0F1318] p-4 sm:p-6 rounded-lg shadow-panel font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
          </div>
          <span className="text-[10px] text-text-3 font-semibold tracking-wider">LOOP_OS_BOOT.EXE</span>
        </div>

        {/* Console Text */}
        <div role="log" aria-label="Illustrative LoopOS boot output" aria-live="off" className="min-h-[250px] space-y-1.5 text-xs leading-4">
          {!reducedMotion && status === "idle" && <p className="text-text-3">Press play to begin the startup animation.</p>}
          {logs.map((log, index) => {
            const isHeader = index === 0
            const isSuccess = log.includes("✓")
            const isReady = log.includes("READY")
            
            let textColor = "text-text-2"
            if (isHeader) textColor = "text-accent font-bold"
            else if (isSuccess) textColor = "text-success"
            else if (isReady) textColor = "text-text-mono font-bold"

            return (
              <div key={index} className={`${textColor} flex items-center gap-2`}>
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            )
          })}
          {!reducedMotion && status === "playing" && currentIndex < BOOT_LOGS.length && (
            <span aria-hidden="true" className="inline-block w-1.5 h-4 bg-accent motion-safe:animate-pulse" />
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3 mt-4 min-h-10">
          <span role="status" className="text-[10px] text-text-3">
            {reducedMotion ? "Static preview" : status === "playing" ? "Playing…" : status === "complete" ? "Sequence complete" : "Ready to play"}
          </span>
          {!reducedMotion && (
            <button
              type="button"
              onClick={status === "playing" ? () => setStatus("complete") : play}
              className="px-3 py-1.5 border border-accent/40 rounded text-[10px] font-bold text-accent hover:bg-accent/10 hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4 cursor-pointer"
            >
              {status === "playing" ? "Skip animation" : status === "complete" ? "Replay boot sequence" : "Play boot sequence"}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
