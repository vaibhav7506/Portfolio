"use client"

import { useEffect, useState } from "react"

interface BootSequenceProps {
  onComplete: () => void
}

const BOOT_LOGS = [
  "LOOPOS SYSTEM BOOTING...",
  "✓ PLANNER          ONLINE",
  "✓ ROUTER           ONLINE",
  "✓ RESEARCH AGENT   ONLINE",
  "✓ EXECUTOR         ONLINE",
  "✓ EVALUATOR        ONLINE",
  "✓ MEMORY LAYER     ONLINE",
  "  AI GATEWAY       CONNECTED",
  "  DURABLE OBJECTS  INITIALIZED",
  "  LOOP v1.0.0      READY",
]

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < BOOT_LOGS.length) {
      const delay = currentIndex === 0 ? 300 : currentIndex === BOOT_LOGS.length - 1 ? 400 : 150
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, BOOT_LOGS[currentIndex]])
        setCurrentIndex((prev) => prev + 1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      // Boot complete, hold for 600ms then transition out
      const timer = setTimeout(() => {
        onComplete()
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, onComplete])

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0D12] flex items-center justify-center font-mono p-6">
      <div className="max-w-md w-full border border-border bg-[#0F1318] p-6 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
          </div>
          <span className="text-xs text-text-3 font-semibold tracking-wider">LOOP_OS_BOOT.EXE</span>
        </div>

        {/* Console Text */}
        <div className="space-y-1.5 text-xs select-none">
          {logs.map((log, index) => {
            const isHeader = index === 0
            const isSuccess = log.includes("✓")
            const isReady = log.includes("READY")
            
            let textColor = "text-text-2"
            if (isHeader) textColor = "text-accent font-bold"
            else if (isSuccess) textColor = "text-success"
            else if (isReady) textColor = "text-accent-dim text-text-mono font-bold animate-pulse"

            return (
              <div key={index} className={`${textColor} flex items-center gap-2`}>
                <span>{log}</span>
              </div>
            )
          })}
          {currentIndex < BOOT_LOGS.length && (
            <span className="inline-block w-1.5 h-4 bg-accent animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}
